import { demoScriptSteps, journeySegments, type DemoJourneyStep } from './demoScript'

// A stage of a flow whose screen isn't built yet. Rendered as a numbered card on
// the ConceptScreen and narrated as one step of the guided journey.
//
// `en` doubles as the step's `focus` needle AND the card's aria-label. The demo
// highlighter matches on ORIGINAL English text/attributes (see `originalAttr` in
// i18n.tsx), so an English aria-label resolves in both languages — that is what
// lets the concept cards reuse the existing glow engine untouched. Keep the `en`
// labels within a flow distinct, and never make one a substring of another: the
// matcher does a substring search and keeps the smallest hit.
export type ConceptStage = {
  en: string
  vi: string
  script: string
  scriptEn: string
  // Optional link out to a real, live page (opens in a new tab). When present the
  // step gets a CTA, so "Open ▸" in the demo dock actually opens it — the concept
  // screen stops being a mock-up at that point and shows the running product.
  link?: { url: string; labelEn: string; labelVi: string }
  // A built screen inside this app to render as THIS stage's backdrop instead of the
  // generic concept card. When set, the guided journey drops the concept card for this
  // step and loads the real screen; if the stage also has a `link`, "Open ▸" opens that
  // live URL in a parallel tab (see `openUrl` on the generated step). This is what lets
  // one stage both switch the preview into the product AND pop the public site.
  builtPath?: string
}

export type RoleFlow = {
  id: string
  actor: string
  nameVi: string
  nameEn: string
  descVi: string
  descEn: string
  stages?: ConceptStage[]
  steps: DemoJourneyStep[]
}

const ENTERPRISES = '/partner/site/enterprises'
const INVITATIONS = '/partner/site/invitations'
const SITE_SETTING = '/partner/site/setting'

// Built Partner Portal concept-flow pages (see the components in App.tsx). Each step's
// `focus` matches an English aria-label on that page so the guided glow lands in both
// languages.
const P_ECOSYSTEM = '/partner/ecosystem'
const P_EVENTS = '/partner/events'
const P_SPONSORS = '/partner/sponsors'
const P_ARO = '/partner/aro'
const P_FINANCE = '/partner/financial-reports'
const P_RFQ = '/partner/rfq-dealroom'
const P_POST_EXPO = '/partner/post-expo'
const P_JOURNEY = '/partner/journey'
const P_OPERATIONS = '/partner/operation/live'

type FlowDef = Omit<RoleFlow, 'steps'> & { screenSteps?: DemoJourneyStep[] }

// Screen-backed steps first, then one narrated step per concept stage. A flow can
// have both: the real screens it does have, followed by the stages it doesn't.
const makeFlow = (def: FlowDef): RoleFlow => ({
  ...def,
  steps: [
    ...(def.screenSteps ?? []),
    ...(def.stages ?? []).map((stage): DemoJourneyStep => {
      const base = {
        actor: def.actor,
        action: stage.en,
        screen: def.nameEn,
        script: stage.script,
        scriptEn: stage.scriptEn,
      }
      // A stage backed by a real screen: render it instead of the concept card. If it
      // also links out, "Open ▸" pops that live page in a parallel tab (openUrl) while
      // the preview already shows the built screen.
      if (stage.builtPath) {
        return {
          ...base,
          path: stage.builtPath,
          ...(stage.link ? { cta: stage.link.labelEn, openUrl: stage.link.url } : {}),
        }
      }
      return {
        ...base,
        path: `/concept/${def.id}`,
        focus: stage.en,
        concept: true,
        // The highlighter matches on ORIGINAL English, and the link renders in the
        // viewer's language — so the anchor carries this label as an English
        // aria-label (see ConceptScreen) and the CTA resolves in both languages.
        ...(stage.link ? { cta: stage.link.labelEn } : {}),
      }
    }),
  ],
})

const adminFlows: RoleFlow[] = [
  makeFlow({
    id: 'admin-create-expo', actor: 'Admin',
    nameVi: 'Tạo & cấu hình Expo', nameEn: 'Create & Configure an Expo',
    descVi: 'Chỉ vài bước, Admin dựng xong một Expo cho Partner: chọn template, gắn thương hiệu, phân khu booth và ấn định lịch tổ chức.',
    descEn: 'Admin creates a new Expo for a Partner: template, owner email, banner, category, schedule, hall and booth counts.',
    screenSteps: journeySegments.adminCreateExpo,
  }),
  makeFlow({
    id: 'admin-govern', actor: 'Admin',
    nameVi: 'Duyệt & điều phối tham gia', nameEn: 'Govern Participation',
    descVi: 'Admin phê duyệt các Expo do Partner gửi lên, quản lý doanh nghiệp tham gia và phân quyền trên từng tenant.',
    descEn: 'Admin approves Expos submitted by Partners, manages participating businesses and assigns permissions per tenant.',
    stages: [
      { en: 'Approval queue', vi: 'Hàng chờ duyệt',
        script: 'Admin mở hàng chờ duyệt: mọi Expo được Partner submit đều xuất hiện ở đây kèm trạng thái và người submit.',
        scriptEn: 'Admin opens the approval queue: every Expo submitted by a Partner lands here with its status and submitter.' },
      { en: 'Review and approve an Expo', vi: 'Xem xét & duyệt Expo',
        script: 'Admin xem lại cấu hình Expo, đối chiếu với hợp đồng của Partner, rồi duyệt hoặc trả về kèm lý do.',
        scriptEn: 'Admin reviews the Expo configuration against the Partner contract, then approves it or returns it with a reason.' },
      { en: 'Manage tenant permissions', vi: 'Phân quyền tenant',
        script: 'Admin phân quyền cho từng tenant: ai được tạo Expo, ai được mời doanh nghiệp, ai chỉ được xem báo cáo.',
        scriptEn: 'Admin assigns permissions per tenant: who can create Expos, who can invite businesses, who can only read reports.' },
    ],
  }),
  makeFlow({
    id: 'admin-monitor', actor: 'Admin',
    nameVi: 'Giám sát hiệu suất nền tảng', nameEn: 'Monitor Platform Performance',
    descVi: 'Toàn bộ sức khỏe nền tảng trong một màn hình: Expo đang chạy, doanh nghiệp tham gia, lượng RFQ và doanh thu.',
    descEn: 'Admin tracks platform-wide metrics: running Expos, participating businesses, RFQ volume and revenue.',
    stages: [
      { en: 'Platform overview', vi: 'Tổng quan nền tảng',
        script: 'Dashboard tổng hợp toàn bộ nền tảng: số Expo đang chạy, số doanh nghiệp active và lưu lượng truy cập.',
        scriptEn: 'The dashboard aggregates the whole platform: running Expos, active businesses and traffic.' },
      { en: 'Revenue and RFQ volume', vi: 'Doanh thu & lượng RFQ',
        script: 'Admin xem doanh thu theo Partner, theo Expo, cùng số RFQ và tỉ lệ chuyển đổi thành báo giá.',
        scriptEn: 'Admin reviews revenue by Partner and by Expo, alongside RFQ volume and the conversion rate into quotations.' },
    ],
  }),
]

const partnerFlows: RoleFlow[] = [
  makeFlow({
    id: 'partner-ecosystem', actor: 'Partner',
    nameVi: 'Tổng quan Hệ sinh thái Arobid', nameEn: 'Ecosystem Overview',
    descVi: 'Bốn mảnh ghép — Marketplace, TradeXpo, Buyer Find & Match và trợ lý ARO — cùng vận hành trong một hệ sinh thái thống nhất.',
    descEn: 'Quick intro to Marketplace, TradeXpo, Buyer Find & Match, and ARO in one unified ecosystem.',
    screenSteps: [
      { actor: 'Partner', action: 'Marketplace', screen: 'Arobid Ecosystem', path: P_ECOSYSTEM, focus: 'Marketplace',
        script: 'Marketplace là nơi doanh nghiệp đăng sản phẩm và được buyer tìm thấy quanh năm, không phụ thuộc vào một sự kiện cụ thể.',
        scriptEn: 'Marketplace is where businesses publish products and get found by buyers year-round, independent of any single event.' },
      { actor: 'Partner', action: 'TradeXpo', screen: 'Arobid Ecosystem', path: P_ECOSYSTEM, focus: 'TradeXpo',
        script: 'TradeXpo là hội chợ số: Partner mở Expo, doanh nghiệp thuê booth 3D, visitor tham quan và gửi RFQ ngay trong Expo.',
        scriptEn: 'TradeXpo is the digital trade fair: Partners open an Expo, businesses rent a 3D booth, and visitors browse and send RFQs inside it.' },
      { actor: 'Partner', action: 'Buyer Find & Match', screen: 'Arobid Ecosystem', path: P_ECOSYSTEM, focus: 'Buyer Find and Match',
        script: 'Buyer Find & Match ghép nhu cầu của buyer với nhà cung cấp phù hợp, biến một RFQ thành nhiều báo giá cạnh tranh.',
        scriptEn: 'Buyer Find & Match pairs buyer demand with the right suppliers, turning one RFQ into several competing quotations.' },
      { actor: 'Partner', action: 'Trợ lý ARO AI', screen: 'Arobid Ecosystem', path: P_ECOSYSTEM, focus: 'ARO AI assistant',
        script: 'ARO là lớp AI chạy xuyên suốt: onboarding doanh nghiệp, gợi ý sản phẩm, trả lời buyer và tóm tắt số liệu cho Partner.',
        scriptEn: 'ARO is the AI layer running across all of it: onboarding businesses, recommending products, answering buyers and summarising metrics for Partners.' },
    ],
  }),
  makeFlow({
    id: 'partner-portal-init', actor: 'Partner',
    nameVi: 'Khởi tạo Portal cho Partner', nameEn: 'Portal Initialization',
    descVi: 'Partner nhận sẵn một tenant riêng, chỉ cần đăng nhập rồi gắn logo, tên, banner và vài dòng giới thiệu — cổng thương hiệu lên sóng ngay.',
    descEn: 'Partner gets an account for a pre-configured tenant → Sign in → Edit logo, partner name, banner, images, short description → tenant homepage → Done.',
    stages: [
      { en: 'Sign in to the tenant', vi: 'Đăng nhập vào tenant',
        script: 'Arobid cấp sẵn account gắn với một hạ tầng riêng. Partner chỉ cần đăng nhập, không phải tự dựng gì cả.',
        scriptEn: 'Arobid issues an account already bound to a dedicated tenant. The Partner just signs in — nothing to set up from scratch.' },
      { en: 'Edit branding', vi: 'Chỉnh sửa thương hiệu',
        script: 'Partner cập nhật logo, tên Partner, banner, hình ảnh và mô tả ngắn. Toàn bộ portal đổi theo thương hiệu của Partner.',
        scriptEn: 'The Partner updates the logo, partner name, banner, imagery and short description. The whole portal re-skins to their brand.' },
      { en: 'Publish the tenant homepage', vi: 'Xuất bản homepage tenant',
        // Backed by the built Partner Portal dashboard: reaching this step switches the
        // preview from the concept card into the real portal. (The live public site now
        // opens from Site Setting → "Preview Your Site", not from here.)
        builtPath: '/partner/dashboard',
        script: 'Homepage của tenant lên sóng ngay. Đây là Partner Portal thật — bảng điều khiển vận hành mà Partner nhìn thấy sau khi đăng nhập.',
        scriptEn: 'The tenant homepage goes live immediately. This is the real Partner Portal — the operations dashboard the Partner sees after signing in.' },
    ],
  }),
  makeFlow({
    id: 'partner-member-dashboard', actor: 'Partner',
    nameVi: 'Quản lý doanh nghiệp thành viên', nameEn: 'Member Dashboard',
    descVi: 'Toàn bộ doanh nghiệp trên tenant của Partner gói gọn một nơi — ai đã là thành viên, ai cần mời thêm đều thấy rõ.',
    descEn: "Partner Site Management → Enterprises Management → view the member business list and each business's membership status.",
    // Backed by the built Enterprises Management screen (the same page the Business
    // Invitation flow uses), narrated here as the read-only member dashboard: the
    // member list, then each business's membership status.
    screenSteps: [
      { actor: 'Partner', action: 'Mở Enterprises Management', screen: 'Enterprises Management', path: ENTERPRISES,
        script: 'Partner mở Partner Site Management → Enterprises Management. Đây là dashboard doanh nghiệp thành viên: mỗi dòng là một doanh nghiệp trên hạ tầng số của Partner, kèm email liên hệ và ngành hàng. Partner có thể tìm kiếm hoặc lọc theo ngành hàng và trạng thái.',
        scriptEn: "The Partner opens Partner Site Management → Enterprises Management. This is the member-business dashboard: each row is a business on the Partner's tenant, with its contact email and industry. The Partner can search or filter by industry and status." },
      { actor: 'Partner', action: 'Kiểm tra trạng thái thành viên', screen: 'Enterprises Management', path: ENTERPRISES, focus: 'Member',
        script: 'Cột Status cho biết trạng thái của từng doanh nghiệp: Member là đã tham gia hạ tầng số, Not invited là chưa được mời. Partner nhìn vào đây để biết ai đã là thành viên và cần mời thêm ai.',
        scriptEn: 'The Status column shows where each business stands: Member means already on the tenant, Not invited means not yet invited. The Partner reads this to see who is already a member and who still needs inviting.' },
    ],
  }),
  makeFlow({
    id: 'partner-business-invite', actor: 'Partner',
    nameVi: 'Mời doanh nghiệp lên hạ tầng số', nameEn: 'Business Invitation',
    descVi: 'Chọn doanh nghiệp cần mời, xem trước email Arobid đã soạn sẵn theo thương hiệu, rồi gửi lời mời hàng loạt chỉ trong một cú nhấp.',
    descEn: 'Partner Workspace → view business list + emails → tick to select → review the email (pre-written by Arobid with tenant info) → send bulk invitations.',
    // Tenant-level invitation, mirroring the Expo-level flow but on the Partner's own
    // infrastructure. These steps are authored here rather than spliced into
    // `demoScriptSteps`, because the full journey follows the offline Word script and
    // does not cover Partner Site Management.
    screenSteps: [
      { actor: 'Partner', action: 'Mở Enterprises Management', screen: 'Enterprises Management', path: ENTERPRISES,
        script: 'Partner vào Workspace → Partner Site Management → Enterprises Management. Đây là danh sách doanh nghiệp trên hạ tầng số của Partner, kèm email liên hệ, ngành hàng và trạng thái thành viên.',
        scriptEn: "The Partner opens Workspace → Partner Site Management → Enterprises Management. This is the list of businesses on the Partner's own digital infrastructure, with contact email, industry and membership status." },
      { actor: 'Partner', action: 'Tick chọn doanh nghiệp', screen: 'Enterprises Management', path: ENTERPRISES, cta: 'Select all',
        script: 'Partner tick chọn từng doanh nghiệp cần mời, hoặc chọn tất cả trong một lần. Doanh nghiệp đã là thành viên bị khoá sẵn nên không thể mời trùng.',
        scriptEn: 'The Partner ticks the businesses to invite, or selects them all at once. Businesses that are already members are locked, so nobody gets invited twice.' },
      { actor: 'Partner', action: 'Nhấn Invite Businesses', screen: 'Invite Businesses Modal', path: ENTERPRISES, cta: 'Invite Businesses', prep: ['Select all'],
        script: 'Partner mở modal mời. Email của các doanh nghiệp vừa tick đã được đưa sẵn vào danh sách người nhận — Partner không phải copy tay email nào.',
        scriptEn: 'The Partner opens the invite modal. The emails of the businesses just ticked are already in the recipient list — the Partner copies nothing by hand.' },
      { actor: 'Partner', action: 'Import danh sách từ Excel', screen: 'Invite Businesses Modal', path: ENTERPRISES, prep: ['Select all', 'Invite Businesses'], focus: 'Upload Excel Email List',
        script: 'Nếu danh sách doanh nghiệp nằm ngoài hệ thống, Partner tải file Excel mẫu, điền email rồi upload lên — hệ thống tự tách toàn bộ email thành tags.',
        scriptEn: 'If the business list lives outside the system, the Partner downloads the Excel template, fills in the emails and uploads it — the system turns every address into a tag automatically.' },
      { actor: 'Partner', action: 'Xem nội dung email mời', screen: 'Invite Businesses Modal', path: ENTERPRISES, cta: 'Preview Invitation Email', prep: ['Select all', 'Invite Businesses'],
        script: 'Email đã được Arobid soạn sẵn theo thông tin tenant — tên hiệp hội, link tham gia. Partner chỉ xem lại chứ không phải tự viết nội dung.',
        scriptEn: 'The email is pre-written by Arobid from the tenant record — association name, join link. The Partner only reviews it, never composes it.' },
      { actor: 'Partner', action: 'Nhấn Batch Send', screen: 'Invitations', path: ENTERPRISES, cta: 'Batch Send', prep: ['Select all', 'Invite Businesses'],
        script: 'Partner gửi hàng loạt trong một lần bấm. Sau khi gửi, hệ thống chuyển sang trang Invitations để theo dõi.',
        scriptEn: 'The Partner sends them all in one click. Once sent, the system moves to the Invitations page to track them.' },
      { actor: 'Partner', action: 'Theo dõi trạng thái lời mời', screen: 'Invitations', path: INVITATIONS,
        script: 'Trang Invitations ghi lại mọi lời mời đã gửi và trạng thái của từng lời mời: đã gửi, đã mở, đã tham gia. Partner biết chính xác cần follow up ai, và có thể gửi lại.',
        scriptEn: 'The Invitations page logs every invitation sent and where each one stands: sent, opened, joined. The Partner knows exactly who to follow up with, and can resend.' },
    ],
  }),
  makeFlow({
    id: 'partner-site-management', actor: 'Partner',
    nameVi: 'Quản lý Partner Site', nameEn: 'Partner Site Management',
    descVi: 'Cài đặt Site: gắn logo, tên, tagline, banner homepage, màu thương hiệu và tên miền — cổng thương hiệu của Partner lên sóng đúng nhận diện.',
    descEn: 'Site Setting: set the logo, name, tagline, homepage banner, theme colour and domain — the Partner\'s branded site goes live on brand.',
    screenSteps: [
      { actor: 'Partner', action: 'Nhận diện Site', screen: 'Site Setting', path: SITE_SETTING, focus: 'Site name',
        script: 'Cài đặt Site cho phép Partner gắn logo, tên site, tagline và mô tả ngắn — toàn bộ portal đổi theo thương hiệu của Partner.',
        scriptEn: "Site Setting lets the Partner set the logo, site name, tagline and short description — the whole portal re-skins to the Partner's brand." },
      { actor: 'Partner', action: 'Banner homepage', screen: 'Site Setting', path: SITE_SETTING, focus: 'Homepage banner',
        script: 'Partner tải lên banner cho homepage — hình ảnh đầu tiên visitor thấy khi vào cổng của tenant.',
        scriptEn: 'The Partner uploads the homepage banner — the first image visitors see when they land on the tenant portal.' },
      { actor: 'Partner', action: 'Thương hiệu & tên miền', screen: 'Site Setting', path: SITE_SETTING, focus: 'Custom domain',
        script: 'Partner đặt màu thương hiệu, tên miền riêng và email liên hệ, rồi Publish để đưa site lên sóng đúng nhận diện.',
        scriptEn: 'The Partner sets the theme colour, a custom domain and a contact email, then hits Publish to take the site live on brand.' },
      { actor: 'Partner', action: 'Xem trước Site', screen: 'Site Setting', path: SITE_SETTING, cta: 'Preview Your Site',
        script: 'Partner bấm Preview Your Site để mở cổng thương hiệu thật của tenant trong một tab mới — đây là site đang chạy thật trên Arobid, không phải bản mô phỏng.',
        scriptEn: "The Partner clicks Preview Your Site to open the tenant's real branded portal in a new tab — the live site running on Arobid right now, not a mock-up." },
    ],
  }),
  makeFlow({
    id: 'partner-expo-setup', actor: 'Partner',
    nameVi: 'Thiết lập Digital Expo', nameEn: 'Digital Expo Setup',
    descVi: 'Partner mở Expo Admin vừa tạo, kiểm tra thông tin, xem trước template 3D rồi submit để đưa vào vận hành.',
    descEn: 'Partner opens the Expo created by Admin, checks the details, previews the 3D template and submits it into the operating state.',
    screenSteps: journeySegments.partnerExpoConfig,
  }),
  makeFlow({
    id: 'partner-expo-invite', actor: 'Partner',
    nameVi: 'Mời doanh nghiệp tham gia Expo', nameEn: 'Expo Business Invitations',
    descVi: 'Từ Expo đang chạy, Partner mời Exhibitor có sẵn trên Arobid hoặc bằng email bên ngoài, xem trước nội dung rồi gửi hàng loạt.',
    descEn: 'Partner opens the operating Expo, invites Exhibitors from the Arobid list or by external email, previews the email and sends in bulk.',
    screenSteps: [...journeySegments.partnerOperation, ...journeySegments.partnerInvite],
  }),
  makeFlow({
    id: 'partner-event-management', actor: 'Partner',
    nameVi: 'Quản lý sự kiện trong Expo', nameEn: 'Expo Event Management',
    descVi: 'Toàn bộ lịch sự kiện của một Expo — hội thảo, lễ khai mạc, phiên kết nối B2B — cùng doanh nghiệp và speaker tham gia từng phiên.',
    descEn: "Workspace → Manage Expo → view an Expo's event schedule + participating businesses or speakers.",
    screenSteps: [
      { actor: 'Partner', action: 'Lịch sự kiện', screen: 'Event Management', path: P_EVENTS, focus: 'Event schedule',
        script: 'Partner xem toàn bộ lịch event trong một Expo: hội thảo, lễ khai mạc, phiên kết nối B2B.',
        scriptEn: 'The Partner sees the full event schedule inside an Expo: seminars, the opening ceremony, B2B matchmaking sessions.' },
      { actor: 'Partner', action: 'Speaker & doanh nghiệp tham gia', screen: 'Event Management', path: P_EVENTS, focus: 'Speakers and participants',
        script: 'Mỗi event gắn với doanh nghiệp tham gia hoặc speaker cụ thể, giúp Partner điều phối nội dung và truyền thông.',
        scriptEn: 'Each event is linked to its participating businesses or speakers, so the Partner can coordinate content and promotion.' },
    ],
  }),
  makeFlow({
    id: 'partner-sponsor-management', actor: 'Partner',
    nameVi: 'Quản lý nhà tài trợ', nameEn: 'Sponsor Management',
    descVi: 'Danh sách nhà tài trợ cùng mức tài trợ, trạng thái thanh toán và quyền lợi từng gói — tất cả trong một bảng.',
    descEn: 'Workspace → Manage Expo → view sponsor list + sponsorship packages.',
    screenSteps: [
      { actor: 'Partner', action: 'Danh sách nhà tài trợ', screen: 'Sponsor Management', path: P_SPONSORS, focus: 'Sponsor list',
        script: 'Partner xem danh sách nhà tài trợ của Expo cùng mức tài trợ và trạng thái thanh toán.',
        scriptEn: "The Partner reviews the Expo's sponsor list with each sponsorship tier and payment status." },
      { actor: 'Partner', action: 'Gói tài trợ', screen: 'Sponsor Management', path: P_SPONSORS, focus: 'Sponsorship packages',
        script: 'Từng gói tài trợ định nghĩa quyền lợi: vị trí logo, booth ưu tiên, suất speaker, banner trong 3D Expo.',
        scriptEn: 'Each sponsorship package defines its benefits: logo placement, priority booth, a speaking slot, banners inside the 3D Expo.' },
    ],
  }),
  makeFlow({
    id: 'partner-expo-operations', actor: 'Partner',
    nameVi: 'Bảng điều hành Expo', nameEn: 'Expo Operations',
    descVi: 'Trung tâm vận hành của một Expo đang chạy: tỉ lệ lấp đầy booth, lưu lượng visitor thời gian thực và mọi việc Partner có thể theo dõi hay xử lý.',
    descEn: 'Workspace → Manage Expo → the live operations centre of a running Expo.',
    screenSteps: [
      ...journeySegments.partnerOperation,
      { actor: 'Partner', action: 'Tỉ lệ lấp đầy booth', screen: 'Expo Operations', path: P_OPERATIONS, focus: 'Booth occupancy',
        script: 'Khi Expo đang Live, bảng điều hành cho Partner theo dõi tỉ lệ lấp đầy booth theo từng hạng Basic, Professional và Premium — biết còn bao nhiêu slot cần bán.',
        scriptEn: 'While the Expo is Live, the operations board lets the Partner track booth occupancy across the Basic, Professional and Premium tiers — how many slots are left to sell.' },
      { actor: 'Partner', action: 'Lưu lượng visitor', screen: 'Expo Operations', path: P_OPERATIONS, focus: 'Live visitor traffic',
        script: 'Partner thấy lưu lượng visitor theo thời gian thực — bao nhiêu người đang online và booth nào đang thu hút nhiều nhất ngay lúc này.',
        scriptEn: 'The Partner sees live visitor traffic in real time — how many people are online and which booths are drawing the most attention right now.' },
    ],
  }),
  makeFlow({
    id: 'partner-aro-ai', actor: 'Partner',
    nameVi: 'Trợ lý ARO AI', nameEn: 'ARO AI',
    descVi: 'Hỏi ARO bằng ngôn ngữ tự nhiên, nhận câu trả lời ngay từ dữ liệu thật của bạn — kèm số liệu và nguồn, khỏi lật báo cáo.',
    descEn: 'Embed the ARO link. Show directly in ARO based on the questions the Partner wants to ask.',
    screenSteps: [
      { actor: 'Partner', action: 'Đặt câu hỏi cho ARO', screen: 'ARO AI', path: P_ARO, focus: 'Ask ARO a question',
        script: 'Partner hỏi ARO bằng ngôn ngữ tự nhiên, ví dụ Expo nào đang bán booth tốt nhất quý này.',
        scriptEn: 'The Partner asks ARO in plain language — for example, which Expo is selling booths best this quarter.' },
      { actor: 'Partner', action: 'ARO trả lời từ dữ liệu thật', screen: 'ARO AI', path: P_ARO, focus: 'ARO answers from live data',
        script: 'ARO trả lời dựa trên dữ liệu thật của tenant, kèm số liệu và nguồn, thay vì bắt Partner tự đọc báo cáo.',
        scriptEn: "ARO answers from the tenant's live data, with figures and sources, instead of making the Partner read a report." },
    ],
  }),
  makeFlow({
    id: 'partner-financial-reports', actor: 'Partner',
    nameVi: 'Báo cáo tài chính', nameEn: 'Financial Reports',
    descVi: 'Báo cáo tổng theo loại doanh thu — booth Expo, tài trợ — kèm chi tiết hoa hồng từng Expo và bảng đối soát phần Partner nhận.',
    descEn: 'Workspace → Financial Reports section → view reports.',
    screenSteps: [
      { actor: 'Partner', action: 'Báo cáo doanh thu tổng', screen: 'Financial Reports', path: P_FINANCE, focus: 'General report',
        script: 'Partner xem báo cáo tổng: từng loại doanh thu — booth Expo, gói tài trợ — với tổng doanh thu và phần doanh thu Partner nhận.',
        scriptEn: 'The Partner sees the general report: each revenue type — Expo booths, sponsorships — with total revenue and the Partner\'s share.' },
      { actor: 'Partner', action: 'Chi tiết theo Expo', screen: 'Financial Reports', path: P_FINANCE, focus: 'Revenue by Expo',
        script: 'Lọc theo tên Expo để xem tên và thời gian diễn ra, cùng bảng chi tiết như báo cáo tổng kèm thêm cột tỉ lệ — doanh thu Partner bằng tổng nhân tỉ lệ, phần còn lại thuộc Arobid.',
        scriptEn: 'Filtering by Expo shows its name and dates, plus the same table as the general report with an extra rate column — Partner revenue is total × rate, the remainder goes to Arobid.' },
      { actor: 'Partner', action: 'Đối soát & thanh toán', screen: 'Financial Reports', path: P_FINANCE, focus: 'Settlement and payouts',
        script: 'Bảng đối soát thể hiện phần Arobid giữ lại và phần Partner nhận về, theo từng kỳ thanh toán.',
        scriptEn: 'The settlement view shows what Arobid retains and what the Partner receives, per payout period.' },
    ],
  }),
  makeFlow({
    id: 'partner-rfq-dealroom', actor: 'Partner',
    nameVi: 'Bảng theo dõi RFQ & Deal Room', nameEn: 'RFQ / Deal Room Dashboard',
    descVi: 'Số RFQ mỗi Expo tạo ra và các cuộc thương lượng đang mở — thước đo trực tiếp cho giá trị Expo mang lại cho doanh nghiệp.',
    descEn: 'Workspace → Deal Room section → view reports.',
    screenSteps: [
      { actor: 'Partner', action: 'Lượng RFQ theo Expo', screen: 'RFQ & Deal Room', path: P_RFQ, focus: 'RFQ volume per Expo',
        script: 'Partner thấy số RFQ phát sinh trong từng Expo — thước đo trực tiếp cho giá trị mà Expo mang lại cho doanh nghiệp.',
        scriptEn: 'The Partner sees how many RFQs each Expo generated — the most direct measure of the value the Expo delivers to businesses.' },
      { actor: 'Partner', action: 'Hội thoại Deal Room', screen: 'RFQ & Deal Room', path: P_RFQ, focus: 'Deal Room conversations',
        script: 'Partner theo dõi số hội thoại Deal Room đang mở và tỉ lệ RFQ được phản hồi bằng báo giá.',
        scriptEn: 'The Partner tracks open Deal Room conversations and the share of RFQs answered with a quotation.' },
    ],
  }),
  makeFlow({
    id: 'partner-expo-dashboard', actor: 'Partner',
    nameVi: 'Tổng quan các Expo', nameEn: 'Expo Management Dashboard',
    descVi: 'Mọi Expo của Partner trên một màn hình — từ Draft, Upcoming, Live đến Archived.',
    descEn: 'Workspace → Manage Expo → see every Expo being configured and every Expo running, in one place.',
    screenSteps: [...journeySegments.partnerExpoConfig.slice(0, 1), ...journeySegments.partnerOperation.slice(0, 1)],
    stages: [
      { en: 'Portfolio across Expos', vi: 'Toàn cảnh các Expo',
        script: 'Partner nhìn toàn bộ danh mục Expo qua các giai đoạn Draft, Upcoming, Live và Archived trong một màn hình.',
        scriptEn: 'The Partner sees the whole Expo portfolio across the Draft, Upcoming, Live and Archived stages on one screen.' },
    ],
  }),
  makeFlow({
    id: 'partner-post-expo', actor: 'Partner',
    nameVi: 'Báo cáo sau Expo', nameEn: 'Post-Expo Reports',
    descVi: 'Khi Expo khép lại, hệ thống tự tổng kết số Exhibitor, visitor, RFQ và giá trị giao dịch — sẵn sàng xuất báo cáo ROI.',
    descEn: 'Workspace → Manage Expo → view post-Expo report data (Archived Expo).',
    screenSteps: [
      { actor: 'Partner', action: 'Tổng kết sau Expo', screen: 'Post-Expo Reports', path: P_POST_EXPO, focus: 'Post-Expo summary',
        script: 'Khi Expo đóng, hệ thống tổng kết: số exhibitor, số visitor, số RFQ và giá trị giao dịch ước tính.',
        scriptEn: 'When the Expo closes, the system summarises it: exhibitors, visitors, RFQs and estimated deal value.' },
      { actor: 'Partner', action: 'Xuất báo cáo', screen: 'Post-Expo Reports', path: P_POST_EXPO, focus: 'Export the report',
        script: 'Partner xuất báo cáo để gửi cho nhà tài trợ và hiệp hội — bằng chứng ROI cho kỳ Expo tiếp theo.',
        scriptEn: 'The Partner exports the report for sponsors and trade associations — the ROI evidence that sells the next Expo.' },
    ],
  }),
  makeFlow({
    id: 'partner-journey-map', actor: 'Partner',
    nameVi: 'Hành trình Partner trên Arobid', nameEn: 'Partner Journey Map',
    descVi: 'Bốn chặng làm nên vòng đời một Partner: dựng hạ tầng, phát triển thành viên, vận hành Expo và khai thác doanh thu.',
    descEn: 'The SAT team builds a Journey to showcase — a flow-of-work view.',
    screenSteps: [
      { actor: 'Partner', action: 'Khởi tạo hạ tầng', screen: 'Partner Journey', path: P_JOURNEY, focus: 'Onboard the tenant',
        script: 'Bước một trong journey: Partner nhận hạ tầng số riêng và dựng thương hiệu lên đó.',
        scriptEn: 'Step one of the journey: the Partner receives a dedicated tenant and brands it.' },
      { actor: 'Partner', action: 'Phát triển thành viên', screen: 'Partner Journey', path: P_JOURNEY, focus: 'Grow the member base',
        script: 'Bước hai: Partner mời doanh nghiệp vào hạ tầng và xây dựng cộng đồng thành viên.',
        scriptEn: 'Step two: the Partner invites businesses onto the tenant and grows the member community.' },
      { actor: 'Partner', action: 'Vận hành Expo', screen: 'Partner Journey', path: P_JOURNEY, focus: 'Run Expos',
        script: 'Bước ba: Partner mở Expo, bán booth, mời exhibitor và visitor, vận hành sự kiện.',
        scriptEn: 'Step three: the Partner opens Expos, sells booths, invites exhibitors and visitors, and runs the event.' },
      { actor: 'Partner', action: 'Khai thác & báo cáo', screen: 'Partner Journey', path: P_JOURNEY, focus: 'Monetise and report',
        script: 'Bước bốn: Partner thu doanh thu từ booth và tài trợ, rồi báo cáo lại giá trị cho các bên liên quan.',
        scriptEn: 'Step four: the Partner earns from booths and sponsorships, then reports the value back to stakeholders.' },
    ],
  }),
]

const exhibitorFlows: RoleFlow[] = [
  makeFlow({
    id: 'exhibitor-ai-onboarding', actor: 'Exhibitor',
    nameVi: 'Tạo hồ sơ bằng AI', nameEn: 'AI Onboarding',
    descVi: 'AI tự dựng hồ sơ doanh nghiệp từ dữ liệu sẵn có — bạn chỉ chỉnh vài chi tiết và xác nhận là xong.',
    descEn: 'Business onboards via AI → edit the information → confirm the profile.',
    screenSteps: journeySegments.exhibitorAiOnboarding,
  }),
  makeFlow({
    id: 'exhibitor-expo-setup', actor: 'Exhibitor',
    nameVi: 'Dựng gian hàng số trong Expo (vai Exhibitor)', nameEn: 'Digital Expo Setup (Exhibitor)',
    descVi: 'Từ đặt chỗ, chọn hạng booth và thanh toán, đến dựng booth 3D, chọn sản phẩm và trang trí video, banner — rồi lên sóng ngay trong Expo.',
    descEn: 'Book the Expo → choose booth type → pay → pick the 3D booth template → choose the products to show → set theme colour + add video & banner → view it on the Expo.',
    screenSteps: [
      ...journeySegments.exhibitorBooking,
      ...journeySegments.exhibitorAiOnboarding,
      ...journeySegments.exhibitorAccount,
      ...journeySegments.exhibitorBooth,
    ],
  }),
  makeFlow({
    id: 'exhibitor-rfq-quote', actor: 'Exhibitor',
    nameVi: 'Nhận RFQ & gửi báo giá', nameEn: 'Receive RFQs & Quotations',
    descVi: 'Mở một RFQ từ khách, tạo báo giá ngay trên đó, điền giá cùng điều kiện rồi gửi đi — không cần soạn file rời.',
    descEn: 'Open an RFQ → create a quotation → enter price and any other terms → send.',
    // The Expo-detail steps end at "Go to RFQ Center"; from there the flow continues
    // into the built RFQ Hub screens (from the Figma "Submit quotations" board):
    // My Quotations list → RFQ detail → quotation form → sent confirmation.
    screenSteps: [
      ...journeySegments.exhibitorExpoDetail,
      { actor: 'Exhibitor', action: 'Mở RFQ Hub', screen: 'RFQ Hub · My Quotations', path: '/exhibitor/rfq-hub', focus: 'My Quotations',
        script: 'Từ RFQ Center, Exhibitor vào RFQ Hub: toàn bộ RFQ từ buyer, lọc theo Open, Draft, Closed. Mỗi RFQ hiện sản phẩm, số lượng và thời hạn còn lại.',
        scriptEn: 'From the RFQ Center the Exhibitor lands on the RFQ Hub: every RFQ from buyers, filterable by Open, Draft or Closed. Each RFQ shows the product, quantity and time left.' },
      { actor: 'Exhibitor', action: 'Mở một RFQ', screen: 'RFQ Detail', path: '/exhibitor/rfq-hub/detail', focus: 'RFQ Details',
        script: 'Exhibitor mở một RFQ và thấy buyer cần gì: mô tả, giá mục tiêu, số lượng, điểm đến và file đính kèm.',
        scriptEn: 'The Exhibitor opens an RFQ and sees exactly what the buyer needs: description, target price, quantity, destination and the attached spec file.' },
      { actor: 'Exhibitor', action: 'Tạo báo giá', screen: 'Send Quotation', path: '/exhibitor/rfq-hub/quote', focus: 'Your quotations',
        script: 'Exhibitor tạo báo giá ngay trên RFQ đó, không phải soạn lại từ đầu bằng file rời. Form báo giá mở ra ngay cạnh chi tiết RFQ.',
        scriptEn: 'The Exhibitor builds a quotation directly on that RFQ, instead of re-typing everything into a separate file. The quotation form opens right beside the RFQ detail.' },
      { actor: 'Exhibitor', action: 'Nhập giá & điều kiện', screen: 'Send Quotation', path: '/exhibitor/rfq-hub/quote', focus: 'Message to Buyer',
        script: 'Exhibitor nhập đơn giá, số lượng, đơn vị, điểm đến, ghi chú cho buyer và có thể đính kèm hình ảnh.',
        scriptEn: 'The Exhibitor enters unit price, quantity, unit, destination, a note to the buyer, and can attach an image.' },
      { actor: 'Exhibitor', action: 'Gửi báo giá', screen: 'Quotation Sent', path: '/exhibitor/rfq-hub/sent', focus: 'Quotations Sent',
        script: 'Gửi đi, hệ thống xác nhận đã gửi báo giá và chờ buyer phản hồi. Hội thoại tiếp theo diễn ra trong Deal Room.',
        scriptEn: "Once sent, the system confirms the quotation was submitted and awaits the buyer's response. The conversation continues in the Deal Room." },
    ],
  }),
]

const visitorFlows: RoleFlow[] = [
  makeFlow({
    id: 'visitor-expo-discovery', actor: 'Visitor',
    nameVi: 'Khám phá Digital Expo (vai Visitor)', nameEn: 'Digital Expo Discovery (Visitor)',
    descVi: 'Visitor bước vào Expo, dạo không gian 3D hoặc tìm thẳng Exhibitor và sản phẩm, gửi RFQ rồi chat tiếp 24/7.',
    descEn: 'Visitor enters the Expo → explores in 3D, or searches straight for an Exhibitor / product → views products → sends an RFQ → chat follow-up 24/7.',
    screenSteps: journeySegments.visitorDiscovery,
    stages: [
      { en: 'Search an exhibitor or product', vi: 'Search Exhibitor hoặc sản phẩm',
        script: 'Visitor không muốn đi 3D vẫn có đường tắt: search thẳng tên Exhibitor hoặc sản phẩm rồi vào đúng booth cần xem.',
        scriptEn: 'A Visitor who would rather skip the 3D has a shortcut: search an Exhibitor or product by name and land straight on the right booth.' },
      { en: 'Send an RFQ', vi: 'Gửi RFQ',
        script: 'Thấy sản phẩm phù hợp, Visitor gửi RFQ ngay trong Expo — không cần rời nền tảng hay tìm email liên hệ.',
        scriptEn: 'When a product fits, the Visitor sends an RFQ right there inside the Expo — no leaving the platform, no hunting for a contact email.' },
      { en: 'Chat follow-up', vi: 'Chat follow up',
        script: 'Sau RFQ, hai bên tiếp tục trao đổi trong Deal Room 24/7, kể cả khi Expo đã kết thúc.',
        scriptEn: 'After the RFQ, both sides keep talking in the Deal Room 24/7 — even after the Expo has closed.' },
    ],
  }),
  makeFlow({
    id: 'visitor-buyer-sourcing', actor: 'Visitor / Buyer',
    nameVi: 'Buyer đi tìm nguồn hàng', nameEn: 'Buyer Sourcing',
    descVi: 'Buyer tìm sản phẩm trên Arobid, gửi RFQ tới nhiều nhà cung cấp cùng lúc, quản lý tại một nơi và nhận thông báo khi có báo giá.',
    descEn: 'Enter Arobid → search → choose products → send RFQ → view & manage RFQs in Workspace → get notified → view the quotation.',
    stages: [
      { en: 'Search the marketplace', vi: 'Search trên marketplace',
        script: 'Buyer vào Arobid và search theo sản phẩm hoặc ngành hàng — sourcing quanh năm, không cần chờ tới kỳ Expo.',
        scriptEn: 'The buyer enters Arobid and searches by product or industry — sourcing runs year-round, no need to wait for an Expo.' },
      { en: 'Choose products and send an RFQ', vi: 'Chọn sản phẩm & gửi RFQ',
        script: 'Buyer chọn một hoặc nhiều sản phẩm rồi gửi RFQ. Một RFQ có thể đi tới nhiều nhà cung cấp cùng lúc.',
        scriptEn: 'The buyer picks one or several products and sends an RFQ. A single RFQ can reach multiple suppliers at once.' },
      { en: 'Manage RFQs in the workspace', vi: 'Quản lý RFQ trong workspace',
        script: 'Mọi RFQ đã gửi nằm gọn trong Workspace của buyer, kèm trạng thái và nhà cung cấp đã phản hồi.',
        scriptEn: "Every RFQ sent sits in the buyer's Workspace, with its status and which suppliers have already responded." },
      { en: 'Open the quotation', vi: 'Xem báo giá',
        script: 'Khi nhà cung cấp báo giá, buyer nhận notification và mở báo giá để so sánh giá và điều kiện.',
        scriptEn: 'When a supplier quotes, the buyer gets a notification and opens the quotation to compare price and terms.' },
    ],
  }),
]

export type RoleDef = { icon: string; role: string; description: string; flows: RoleFlow[] }

export const roleDefs: RoleDef[] = [
  { icon: '⌘', role: 'Admin', description: 'Configure expos, govern participation, and monitor performance.', flows: adminFlows },
  { icon: '◈', role: 'Partner', description: 'Launch branded events and manage exhibitors or visitors.', flows: partnerFlows },
  { icon: '▦', role: 'Exhibitor', description: 'Create a booth, publish products, and respond to RFQs.', flows: exhibitorFlows },
  { icon: '◎', role: 'Visitor', description: 'Discover exhibitors, browse expo content, and enter the 3D expo.', flows: visitorFlows },
]

const flowsById = new Map(roleDefs.flatMap((role) => role.flows.map((flow) => [flow.id, flow] as const)))

export const findFlow = (id: string): RoleFlow | undefined => flowsById.get(id)

// Each role's flows grouped into meaningful lifecycle stages, in the order a
// Partner (or other actor) actually moves through them on Arobid. Used by the
// role workflow page: click a role → see its flows laid out as a staged pipeline.
export type WorkflowStage = { en: string; vi: string; hintEn: string; hintVi: string; flowIds: string[] }

export const roleWorkflows: Record<string, WorkflowStage[]> = {
  Admin: [
    { en: 'Create Expos', vi: 'Tạo Expo', hintEn: 'Build and configure an Expo for a Partner', hintVi: 'Dựng và cấu hình Expo cho Partner', flowIds: ['admin-create-expo'] },
    { en: 'Govern Participation', vi: 'Duyệt & điều phối', hintEn: 'Approve Expos and assign tenant permissions', hintVi: 'Duyệt Expo và phân quyền tenant', flowIds: ['admin-govern'] },
    { en: 'Monitor Performance', vi: 'Giám sát', hintEn: 'Track platform-wide health and revenue', hintVi: 'Theo dõi sức khỏe và doanh thu nền tảng', flowIds: ['admin-monitor'] },
  ],
  Partner: [
    { en: 'Onboard & Understand', vi: 'Làm quen & Khởi tạo', hintEn: 'Learn the ecosystem and get a branded Portal', hintVi: 'Hiểu hệ sinh thái và nhận Portal có thương hiệu',
      flowIds: ['partner-journey-map', 'partner-ecosystem', 'partner-portal-init'] },
    { en: 'Grow the Member Base', vi: 'Phát triển thành viên', hintEn: 'Invite and manage businesses on the tenant', hintVi: 'Mời và quản lý doanh nghiệp trên hạ tầng',
      flowIds: ['partner-business-invite', 'partner-member-dashboard', 'partner-site-management'] },
    { en: 'Build & Launch Expos', vi: 'Dựng & Khởi chạy Expo', hintEn: 'Set up Expos, invite participants, run events and sponsors', hintVi: 'Thiết lập Expo, mời tham gia, sự kiện và tài trợ',
      flowIds: ['partner-expo-setup', 'partner-expo-invite', 'partner-event-management', 'partner-sponsor-management'] },
    { en: 'Operate Live', vi: 'Vận hành trực tiếp', hintEn: "Track and run Expos while they're live", hintVi: 'Theo dõi và điều hành Expo đang chạy',
      flowIds: ['partner-expo-operations', 'partner-expo-dashboard', 'partner-aro-ai'] },
    { en: 'Monetise & Report', vi: 'Doanh thu & Báo cáo', hintEn: 'Settle revenue, track RFQs and post-Expo results', hintVi: 'Đối soát doanh thu, RFQ và tổng kết sau Expo',
      flowIds: ['partner-financial-reports', 'partner-rfq-dealroom', 'partner-post-expo'] },
  ],
  Exhibitor: [
    { en: 'Onboard', vi: 'Tạo hồ sơ', hintEn: 'Build the business profile with AI', hintVi: 'Dựng hồ sơ doanh nghiệp bằng AI', flowIds: ['exhibitor-ai-onboarding'] },
    { en: 'Set up the Booth', vi: 'Dựng gian hàng', hintEn: 'Book, pay and build the 3D booth in an Expo', hintVi: 'Đặt chỗ, thanh toán và dựng booth 3D trong Expo', flowIds: ['exhibitor-expo-setup'] },
    { en: 'Win Business', vi: 'Chốt đơn', hintEn: 'Receive RFQs and send quotations', hintVi: 'Nhận RFQ và gửi báo giá', flowIds: ['exhibitor-rfq-quote'] },
  ],
  Visitor: [
    { en: 'Discover at the Expo', vi: 'Khám phá tại Expo', hintEn: 'Explore the 3D Expo and send RFQs', hintVi: 'Dạo Expo 3D và gửi RFQ', flowIds: ['visitor-expo-discovery'] },
    { en: 'Source Year-Round', vi: 'Tìm nguồn quanh năm', hintEn: 'Search the marketplace and manage RFQs', hintVi: 'Tìm trên marketplace và quản lý RFQ', flowIds: ['visitor-buyer-sourcing'] },
  ],
}

export const fullJourney = demoScriptSteps
