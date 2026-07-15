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
    descVi: 'Admin tạo Expo mới cho Partner: template, owner email, banner, category, thời gian, hall và số lượng booth.',
    descEn: 'Admin creates a new Expo for a Partner: template, owner email, banner, category, schedule, hall and booth counts.',
    screenSteps: journeySegments.adminCreateExpo,
  }),
  makeFlow({
    id: 'admin-govern', actor: 'Admin',
    nameVi: 'Duyệt & quản trị tham gia', nameEn: 'Govern Participation',
    descVi: 'Admin duyệt Expo do Partner submit, quản lý doanh nghiệp tham gia và phân quyền trên từng tenant.',
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
    descVi: 'Admin theo dõi số liệu toàn nền tảng: Expo đang chạy, doanh nghiệp tham gia, RFQ phát sinh và doanh thu.',
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
    descVi: 'Giới thiệu nhanh Marketplace, TradeXpo, Buyer Find & Match và ARO trong một hệ sinh thái thống nhất.',
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
    descVi: 'Partner được cấp account cho 1 Hạ tầng (tenant) đã thiết lập sẵn → Sign in → Edit logo, Tên Partner, Banner, Hình ảnh, Mô tả ngắn → Homepage của tenant → Done.',
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
        // preview from the concept card into the real portal, and "Open ▸" pops the live
        // public site in a parallel tab.
        builtPath: '/partner/dashboard',
        script: 'Homepage của tenant lên sóng ngay. Đây là Partner Portal thật — bảng điều khiển vận hành mà Partner nhìn thấy sau khi đăng nhập.',
        scriptEn: 'The tenant homepage goes live immediately. This is the real Partner Portal — the operations dashboard the Partner sees after signing in. And this is not a mock-up: in a parallel tab, open the live public portal of the Tay Bac Sai Gon business association, running on Arobid right now.',
        link: {
          url: 'https://arobid.com/partner/en/hdn-taybacsaigon',
          labelEn: 'Open the live Partner portal',
          labelVi: 'Mở portal Partner thực tế',
        } },
    ],
  }),
  makeFlow({
    id: 'partner-member-dashboard', actor: 'Partner',
    nameVi: 'Dashboard: Quản lý doanh nghiệp thành viên', nameEn: 'Member Dashboard',
    descVi: 'Partner Site Management → Enterprises Management → Xem danh sách doanh nghiệp thành viên và trạng thái thành viên.',
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
    nameVi: 'Mời doanh nghiệp tham gia Hạ tầng số', nameEn: 'Business Invitation',
    descVi: "Partner's Workspace → xem danh sách DN + email → Tick chọn → Xem nội dung email (Arobid soạn sẵn theo thông tin tenant) → Gửi mời hàng loạt.",
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
    id: 'partner-expo-setup', actor: 'Partner',
    nameVi: 'Thiết lập Digital Expo hợp tác', nameEn: 'Digital Expo Setup',
    descVi: 'Partner mở Expo do Admin tạo, kiểm tra thông tin, preview template 3D và submit để chuyển sang trạng thái vận hành.',
    descEn: 'Partner opens the Expo created by Admin, checks the details, previews the 3D template and submits it into the operating state.',
    screenSteps: journeySegments.partnerExpoConfig,
  }),
  makeFlow({
    id: 'partner-expo-invite', actor: 'Partner',
    nameVi: 'Mời doanh nghiệp tham gia Digital Expo', nameEn: 'Expo Business Invitations',
    descVi: 'Partner mở Expo đang vận hành, mời Exhibitor từ danh sách Arobid hoặc bằng email external, preview email rồi gửi hàng loạt.',
    descEn: 'Partner opens the operating Expo, invites Exhibitors from the Arobid list or by external email, previews the email and sends in bulk.',
    screenSteps: [...journeySegments.partnerOperation, ...journeySegments.partnerInvite],
  }),
  makeFlow({
    id: 'partner-event-management', actor: 'Partner',
    nameVi: 'Dashboard: Quản lý events trong Expo', nameEn: 'Expo Event Management',
    descVi: 'Workspace → Quản lý Expo → Xem lịch các event của 1 Expo + DN tham gia hoặc Speaker.',
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
    nameVi: 'Dashboard: Quản lý nhà tài trợ', nameEn: 'Sponsor Management',
    descVi: 'Workspace → Quản lý Expo → Xem danh sách nhà tài trợ + Gói tài trợ.',
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
    nameVi: 'Dashboard: Vận hành Expo', nameEn: 'Expo Operations',
    descVi: 'Workspace → Quản lý Expo → Xem toàn bộ các mục liên quan 1 Expo mà Partner có thể làm được, xem được.',
    descEn: 'Workspace → Manage Expo → view everything related to an Expo the Partner can do or see.',
    screenSteps: journeySegments.partnerOperation,
    stages: [
      { en: 'Booth occupancy', vi: 'Tỉ lệ lấp đầy booth',
        script: 'Partner theo dõi tỉ lệ lấp đầy booth theo từng hạng Basic, Professional và Premium để biết còn bao nhiêu slot cần bán.',
        scriptEn: 'The Partner tracks booth occupancy across the Basic, Professional and Premium tiers to see how many slots are left to sell.' },
      { en: 'Live visitor traffic', vi: 'Lưu lượng visitor',
        script: 'Trong lúc Expo đang chạy, Partner thấy lưu lượng visitor theo thời gian thực và booth nào đang thu hút nhiều nhất.',
        scriptEn: 'While the Expo runs, the Partner sees live visitor traffic and which booths are drawing the most attention.' },
    ],
  }),
  makeFlow({
    id: 'partner-aro-ai', actor: 'Partner',
    nameVi: 'ARO AI', nameEn: 'ARO AI',
    descVi: 'Gắn link ARO. Show trực tiếp trên ARO theo các câu hỏi Partner muốn hỏi.',
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
    nameVi: 'Xem báo cáo tài chính', nameEn: 'Financial Reports',
    descVi: 'Workspace → Mục Báo cáo tài chính → Xem báo cáo.',
    descEn: 'Workspace → Financial Reports section → view reports.',
    screenSteps: [
      { actor: 'Partner', action: 'Doanh thu theo Expo', screen: 'Financial Reports', path: P_FINANCE, focus: 'Revenue by Expo',
        script: 'Partner xem doanh thu từng Expo: tiền booth, gói tài trợ và dịch vụ cộng thêm.',
        scriptEn: 'The Partner sees revenue per Expo: booth sales, sponsorship packages and add-on services.' },
      { actor: 'Partner', action: 'Đối soát & thanh toán', screen: 'Financial Reports', path: P_FINANCE, focus: 'Settlement and payouts',
        script: 'Bảng đối soát thể hiện phần Arobid giữ lại và phần Partner nhận về, theo từng kỳ thanh toán.',
        scriptEn: 'The settlement view shows what Arobid retains and what the Partner receives, per payout period.' },
    ],
  }),
  makeFlow({
    id: 'partner-rfq-dealroom', actor: 'Partner',
    nameVi: 'Dashboard RFQ · Deal Room / Expo', nameEn: 'RFQ / Deal Room Dashboard',
    descVi: 'Workspace → Mục Deal Room → Xem báo cáo.',
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
    nameVi: 'Dashboard: Quản lý các Expo của Partner', nameEn: 'Expo Management Dashboard',
    descVi: 'Workspace → Quản lý Expo → Xem toàn bộ Expo đang cấu hình và đang vận hành trong một chỗ.',
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
    nameVi: 'Dashboard: Báo cáo sau Expo', nameEn: 'Post-Expo Reports',
    descVi: 'Workspace → Quản lý Expo → Xem báo cáo số liệu sau Expo (Archived Expo).',
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
    nameVi: 'Journey của Partner trên Arobid', nameEn: 'Partner Journey Map',
    descVi: 'Team SAT tự tạo Journey để show: dạng flow of work.',
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
    nameVi: 'AI Onboarding → Edit → Confirm', nameEn: 'AI Onboarding',
    descVi: 'Doanh nghiệp onboarding bằng AI → Chỉnh sửa thông tin → Xác nhận hồ sơ.',
    descEn: 'Business onboards via AI → edit the information → confirm the profile.',
    screenSteps: journeySegments.exhibitorAiOnboarding,
  }),
  makeFlow({
    id: 'exhibitor-expo-setup', actor: 'Exhibitor',
    nameVi: 'Digital Expo: full flow 1 Expo (vai Exhibitor)', nameEn: 'Digital Expo Setup (Exhibitor)',
    descVi: 'Booking Expo → Chọn loại booth → Thanh toán → Chọn mẫu 3D booth → Chọn sản phẩm tham gia → Set up màu theme + gắn Video & Banner → Xem trên Expo.',
    descEn: 'Book the Expo → choose booth type → pay → pick the 3D booth template → choose the products to show → set theme colour + add video & banner → view it on the Expo.',
    screenSteps: [
      ...journeySegments.exhibitorBooking,
      ...journeySegments.exhibitorAccount,
      ...journeySegments.exhibitorBooth,
    ],
  }),
  makeFlow({
    id: 'exhibitor-rfq-quote', actor: 'Exhibitor',
    nameVi: 'Nhận RFQ & báo giá', nameEn: 'Receive RFQs & Quotations',
    descVi: 'Mở 1 RFQ → Tạo báo giá → Nhập giá và các điều kiện khác nếu có → Send.',
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
    nameVi: 'Digital Expo: khám phá toàn bộ 1 Expo (vai Visitor)', nameEn: 'Digital Expo Discovery (Visitor)',
    descVi: 'Visitor vào Expo → Xem 3D và di chuyển, hoặc search thẳng Exhibitor / sản phẩm → Xem sản phẩm → Gửi RFQ → Chat follow up 24/7.',
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
    nameVi: 'Buyer muốn đi sourcing', nameEn: 'Buyer Sourcing',
    descVi: 'Vào Arobid → Search → chọn sản phẩm → Send RFQ → Workspace xem & quản lý RFQ → có noti → bấm xem báo giá.',
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

export const fullJourney = demoScriptSteps
