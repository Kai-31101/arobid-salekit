import { useLayoutEffect, useSyncExternalStore } from 'react'
import { vi } from './i18n.dict'

// ============================================================
// Lightweight runtime i18n for the Sales Kit demo.
//
// The app's JSX is authored in English. Rather than wrap every one of the
// hundreds of strings with a t() call, we translate the rendered DOM:
//   - a dictionary maps exact (trimmed) English text -> Vietnamese
//   - a MutationObserver re-applies translation as React renders/updates
//
// MutationObserver callbacks run as microtasks BEFORE the browser paints, so
// React can render English and we swap to Vietnamese in the same frame with no
// visible flicker. The original English is stored per-node so toggling back to
// EN restores it. Subtrees with [data-no-i18n] are left untouched (used for the
// demo narration, which is bilingual via data, and for the toggle itself).
// ============================================================

export type Lang = 'vi' | 'en'

const KEY = 'salekit-lang'
const EVT = 'salekit-lang-change'
const ATTRS = ['placeholder', 'aria-label', 'alt', 'title']
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT'])

export function getLang(): Lang {
  try {
    return localStorage.getItem(KEY) === 'en' ? 'en' : 'vi'
  } catch {
    return 'vi'
  }
}

export function setLang(lang: Lang) {
  try {
    localStorage.setItem(KEY, lang)
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVT, { detail: lang }))
}

// ---- React binding ---------------------------------------------------------

function subscribe(cb: () => void) {
  const onEvt = () => cb()
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb()
  }
  window.addEventListener(EVT, onEvt)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(EVT, onEvt)
    window.removeEventListener('storage', onStorage)
  }
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, () => 'vi')
}

export function useLanguage() {
  const lang = useLang()
  return {
    lang,
    setLang,
    toggle: () => setLang(lang === 'vi' ? 'en' : 'vi'),
  }
}

// ---- Translation engine ----------------------------------------------------

const TEXT_ORIG = new WeakMap<Text, string>()
const ATTR_ORIG = new WeakMap<Element, Record<string, string>>()

function translateText(node: Text, lang: Lang) {
  const raw = node.nodeValue ?? ''
  if (!raw.trim()) return
  if (lang === 'vi') {
    const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(raw)
    if (!m) return
    const [, lead, core, trail] = m
    const translated = vi[core]
    if (translated && translated !== core) {
      if (!TEXT_ORIG.has(node)) TEXT_ORIG.set(node, raw)
      const next = lead + translated + trail
      if (node.nodeValue !== next) node.nodeValue = next
    }
  } else {
    const orig = TEXT_ORIG.get(node)
    if (orig != null && node.nodeValue !== orig) node.nodeValue = orig
  }
}

function translateAttrs(el: Element, lang: Lang) {
  for (const attr of ATTRS) {
    if (!el.hasAttribute(attr)) continue
    const cur = el.getAttribute(attr) ?? ''
    const key = cur.trim()
    if (!key) continue
    if (lang === 'vi') {
      const translated = vi[key]
      if (translated && translated !== key) {
        const store = ATTR_ORIG.get(el) ?? {}
        if (!(attr in store)) {
          store[attr] = cur
          ATTR_ORIG.set(el, store)
        }
        if (cur !== translated) el.setAttribute(attr, translated)
      }
    } else {
      const store = ATTR_ORIG.get(el)
      if (store && attr in store && cur !== store[attr]) el.setAttribute(attr, store[attr])
    }
  }
}

function walk(root: Node, lang: Lang) {
  if (root.nodeType === Node.ELEMENT_NODE) {
    const el = root as Element
    if (SKIP_TAGS.has(el.tagName)) return
    if (el.closest('[data-no-i18n]')) return
    translateAttrs(el, lang)
  }
  for (let child = root.firstChild; child; child = child.nextSibling) {
    if (child.nodeType === Node.TEXT_NODE) {
      translateText(child as Text, lang)
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      walk(child, lang)
    }
  }
}

let observer: MutationObserver | null = null

function startObserver() {
  if (observer) return
  observer = new MutationObserver((records) => {
    const lang = getLang()
    if (lang === 'en') return // React renders English by default; nothing to swap
    for (const record of records) {
      if (record.type === 'characterData') {
        const node = record.target
        if (node.nodeType === Node.TEXT_NODE) {
          const parent = (node as Text).parentElement
          if (!parent || !parent.closest('[data-no-i18n]')) translateText(node as Text, lang)
        }
      } else if (record.type === 'attributes') {
        const el = record.target as Element
        if (!el.closest('[data-no-i18n]')) translateAttrs(el, lang)
      } else {
        record.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const parent = (node as Text).parentElement
            if (!parent || !parent.closest('[data-no-i18n]')) translateText(node as Text, lang)
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            walk(node, lang)
          }
        })
      }
    }
  })
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTRS,
  })
}

function applyAll() {
  if (document.body) walk(document.body, getLang())
}

// ---- Components -------------------------------------------------------------

/**
 * Runs the translation engine for the current document. Rendered once at the
 * app root (in both the top window and the demo iframe). The floating toggle is
 * shown only in the top window so the demo iframe does not draw a second button.
 */
export function I18nRoot() {
  useLayoutEffect(() => {
    startObserver()
    applyAll()
    const onChange = () => applyAll()
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) applyAll()
    }
    window.addEventListener(EVT, onChange)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(EVT, onChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  return <LanguageFab />
}

function LanguageFab() {
  const { lang, toggle } = useLanguage()
  const isEmbedded = typeof window !== 'undefined' && window.self !== window.top
  if (isEmbedded) return null
  return (
    <button
      type="button"
      data-no-i18n
      className="lang-fab"
      onClick={toggle}
      aria-label={lang === 'vi' ? 'Chuyển sang tiếng Anh' : 'Switch to Vietnamese'}
      title="VI / EN"
    >
      <span className={lang === 'vi' ? 'on' : ''}>VI</span>
      <i />
      <span className={lang === 'en' ? 'on' : ''}>EN</span>
    </button>
  )
}
