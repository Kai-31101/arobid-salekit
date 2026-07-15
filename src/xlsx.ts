// Minimal, dependency-free .xlsx read/write for the invite email list.
//
// An .xlsx is a ZIP of XML parts. We only need two things, so pulling in a
// spreadsheet library would be overkill:
//
//   write — build the ZIP with STORED (uncompressed) entries, so no compressor
//           is needed, only a CRC32. Excel opens these fine.
//   read  — walk the ZIP central directory and inflate the XML parts with the
//           browser's native DecompressionStream('deflate-raw'), then pull the
//           emails out of the text. Real .xlsx files from Excel are deflated, so
//           this handles a file the user actually saved from Excel.
//
// Plain .csv / .txt are read as text instead — see extractEmailsFromFile.

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g

// A bare `Uint8Array` is `Uint8Array<ArrayBufferLike>`, which Blob won't accept
// (it could be backed by a SharedArrayBuffer). Pin the buffer type instead.
type Bytes = Uint8Array<ArrayBuffer>

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i += 1) {
    let c = i
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[i] = c >>> 0
  }
  return table
})()

const crc32 = (bytes: Bytes): number => {
  let c = 0xffffffff
  for (let i = 0; i < bytes.length; i += 1) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// --- write ------------------------------------------------------------------

type ZipEntry = { name: string; data: Bytes }

// ZIP with method 0 (stored). Every entry is written verbatim, so the only
// checksum work is the CRC32 above.
const zipStored = (entries: ZipEntry[]): Blob => {
  const encoder = new TextEncoder()
  const parts: Bytes[] = []
  const central: Bytes[] = []
  let offset = 0

  for (const entry of entries) {
    const name = encoder.encode(entry.name)
    const crc = crc32(entry.data)
    const size = entry.data.length

    const local = new Uint8Array(30 + name.length)
    const lv = new DataView(local.buffer)
    lv.setUint32(0, 0x04034b50, true) // local file header
    lv.setUint16(4, 20, true) //          version needed
    lv.setUint16(8, 0, true) //           method: stored
    lv.setUint32(14, crc, true)
    lv.setUint32(18, size, true) //       compressed size
    lv.setUint32(22, size, true) //       uncompressed size
    lv.setUint16(26, name.length, true)
    local.set(name, 30)
    parts.push(local, entry.data)

    const cd = new Uint8Array(46 + name.length)
    const cv = new DataView(cd.buffer)
    cv.setUint32(0, 0x02014b50, true) // central directory header
    cv.setUint16(4, 20, true) //          version made by
    cv.setUint16(6, 20, true) //          version needed
    cv.setUint16(10, 0, true) //          method: stored
    cv.setUint32(16, crc, true)
    cv.setUint32(20, size, true)
    cv.setUint32(24, size, true)
    cv.setUint16(28, name.length, true)
    cv.setUint32(42, offset, true) //     offset of local header
    cd.set(name, 46)
    central.push(cd)

    offset += local.length + size
  }

  const centralSize = central.reduce((total, cd) => total + cd.length, 0)
  const eocd = new Uint8Array(22)
  const ev = new DataView(eocd.buffer)
  ev.setUint32(0, 0x06054b50, true) // end of central directory
  ev.setUint16(8, entries.length, true)
  ev.setUint16(10, entries.length, true)
  ev.setUint32(12, centralSize, true)
  ev.setUint32(16, offset, true)

  return new Blob([...parts, ...central, eocd], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

const columnName = (index: number) => String.fromCharCode(65 + index)

// Cells are written as inline strings (t="inlineStr"), which avoids needing a
// sharedStrings part — and keeps the emails as readable text for the reader below.
const sheetXml = (rows: string[][]) =>
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${rows
    .map(
      (cells, r) =>
        `<row r="${r + 1}">${cells
          .map((value, c) => `<c r="${columnName(c)}${r + 1}" t="inlineStr"><is><t>${escapeXml(value)}</t></is></c>`)
          .join('')}</row>`,
    )
    .join('')}</sheetData></worksheet>`

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`
const ROOT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`
const WORKBOOK = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Invitations" sheetId="1" r:id="rId1"/></sheets></workbook>`
const WORKBOOK_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`

// The template the Partner downloads: a header row plus a few sample rows, so it
// is obvious which column the importer reads.
export const buildEmailTemplateXlsx = (sampleEmails: readonly string[]): Blob => {
  const encoder = new TextEncoder()
  const rows: string[][] = [
    ['Email', 'Company name (optional)'],
    ...sampleEmails.map((email) => [email, '']),
  ]
  return zipStored([
    { name: '[Content_Types].xml', data: encoder.encode(CONTENT_TYPES) },
    { name: '_rels/.rels', data: encoder.encode(ROOT_RELS) },
    { name: 'xl/workbook.xml', data: encoder.encode(WORKBOOK) },
    { name: 'xl/_rels/workbook.xml.rels', data: encoder.encode(WORKBOOK_RELS) },
    { name: 'xl/worksheets/sheet1.xml', data: encoder.encode(sheetXml(rows)) },
  ])
}

// --- read -------------------------------------------------------------------

const inflateRaw = async (data: Bytes): Promise<Bytes> => {
  const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

// Read every XML part out of the .xlsx and return its text. Emails live in the
// worksheet (inline strings) or in sharedStrings.xml depending on how the file
// was produced, so we just read them all and scan the lot.
const readXlsxText = async (buffer: ArrayBuffer): Promise<string> => {
  const bytes = new Uint8Array(buffer)
  const view = new DataView(buffer)

  // Locate the end-of-central-directory record by scanning backwards.
  let eocd = -1
  for (let i = bytes.length - 22; i >= 0 && i >= bytes.length - 22 - 65535; i -= 1) {
    if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break }
  }
  if (eocd < 0) throw new Error('not-a-zip')

  const count = view.getUint16(eocd + 10, true)
  let cursor = view.getUint32(eocd + 16, true)
  const decoder = new TextDecoder()
  let text = ''

  for (let i = 0; i < count; i += 1) {
    if (view.getUint32(cursor, true) !== 0x02014b50) break
    const method = view.getUint16(cursor + 10, true)
    const compressedSize = view.getUint32(cursor + 20, true)
    const nameLength = view.getUint16(cursor + 28, true)
    const extraLength = view.getUint16(cursor + 30, true)
    const commentLength = view.getUint16(cursor + 32, true)
    const localOffset = view.getUint32(cursor + 42, true)
    const name = decoder.decode(bytes.subarray(cursor + 46, cursor + 46 + nameLength))

    if (name.endsWith('.xml')) {
      // The local header repeats the name/extra lengths, and they can differ from
      // the central directory's — the file data starts after the LOCAL ones.
      const localNameLength = view.getUint16(localOffset + 26, true)
      const localExtraLength = view.getUint16(localOffset + 28, true)
      const start = localOffset + 30 + localNameLength + localExtraLength
      const raw = bytes.subarray(start, start + compressedSize)
      const data = method === 0 ? raw : await inflateRaw(raw)
      text += decoder.decode(data) + '\n'
    }

    cursor += 46 + nameLength + extraLength + commentLength
  }

  return text
}

// Pull the email addresses out of an uploaded .xlsx / .csv / .txt, in file order
// and de-duplicated. Throws only if the file can't be read at all.
export const extractEmailsFromFile = async (file: File): Promise<string[]> => {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b // "PK" — an .xlsx is a ZIP
  const text = isZip ? await readXlsxText(buffer) : new TextDecoder().decode(buffer)
  return [...new Set(text.match(EMAIL_RE) ?? [])]
}
