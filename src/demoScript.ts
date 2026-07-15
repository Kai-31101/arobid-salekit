import { furnitureExpoMock } from './mockData'
import { demoScriptEn } from './i18n.dict'

export type DemoJourneyStep = {
  actor: string
  action: string
  screen: string
  script: string
  // English narration. Authored inline on flow-specific steps; folded in from the
  // positional `demoScriptEn` array for the steps of the full journey below.
  scriptEn?: string
  path: string
  cta?: string
  prep?: string[]
  focus?: string
  // Narrated over a ConceptScreen rather than a built screen.
  concept?: boolean
  // An external, live URL to open in a parallel browser tab when the presenter runs
  // this step's "Open ▸". Used by built-screen stages (see flows.ts) so one step can
  // both show the real product AND pop the public site.
  openUrl?: string
}

const eid = furnitureExpoMock.id
// Script content strictly follows "Arobid - TradeXpo Sell Kit - Offline Word.docx".
const rawDemoScriptSteps: DemoJourneyStep[] = [
    { actor: 'Seller / Demo Presenter', action: 'Click Run Demo Journey', screen: 'Role Selection', path: '/', script: 'Đây là trang điều hướng chính của Sales Kit. Người xem có thể chạy toàn bộ demo journey từ đầu, hoặc mở từng role để xem từng màn hình riêng biệt.' },
    { actor: 'Seller / Demo Presenter', action: 'Expand từng Role card', screen: 'Role Selection', path: '/', script: 'Mỗi role đại diện cho một nhóm người dùng trong hệ sinh thái Arobid: Admin, Partner, Exhibitor và Visitor. Khi click vào role, hệ thống hiển thị các màn hình tương ứng đã được chuẩn bị cho demo.' },
    { actor: 'Admin', action: 'Mở Expo Management List', screen: '/admin/expo', path: '/admin/expo', script: 'Admin bắt đầu bằng việc quản lý danh sách Expo. Đây là nơi Admin xem các chương trình Expo đang có, trạng thái, ngày tổ chức, owner và các thông tin vận hành chính.' },
    { actor: 'Admin', action: 'Click Create New', screen: '/admin/expo/create', path: '/admin/expo', cta: 'Create New', script: 'Admin tạo Expo mới cho Partner. Form đã được prefill bằng dữ liệu mẫu để mô phỏng quy trình thật, bao gồm template, owner email, mô tả, category, thời gian, hall và số lượng booth.' },
    { actor: 'Admin', action: 'Kiểm tra Expo Owner Email', screen: 'Create Expo', path: '/admin/expo/create', focus: 'Owner email', script: 'Email owner là partner-email@domain.com. Dữ liệu này được dùng xuyên suốt các bước tiếp theo để thể hiện Partner là chủ sở hữu Expo.' },
    { actor: 'Admin', action: 'Kiểm tra Thumbnail / Banner', screen: 'Create Expo', path: '/admin/expo/create', focus: 'banner preview', script: 'Thumbnail đã được upload sẵn bằng banner Furniture Expo. Đây là hình đại diện sẽ xuất hiện trong danh sách Expo của Partner và các màn hình downstream.' },
    { actor: 'Admin', action: 'Kiểm tra Hall configuration', screen: 'Create Expo', path: '/admin/expo/create', focus: 'Hall name', script: 'Admin cấu hình số lượng booth: Basic 150 slot, Professional 40 slot, Premium 10 slot. Tổng số slot này sẽ dùng cho các bước vận hành Expo sau.' },
    { actor: 'Admin', action: 'Click Submit', screen: 'Create Expo → Role Selection', path: '/admin/expo/create', cta: 'Submit', script: 'Sau khi Admin submit, hệ thống quay về Role Selection để chuyển sang vai trò Partner. Điều này mô phỏng việc Admin đã tạo xong Expo và Partner sẽ tiếp tục cấu hình / vận hành.' },
    { actor: 'Partner', action: 'Mở Partner Role → Expo Config List', screen: '/partner/expos', path: '/partner/expos', script: 'Partner nhìn thấy Expo vừa được Admin tạo. Trạng thái ở giai đoạn cấu hình là Draft, nghĩa là Partner cần kiểm tra và submit approval.' },
    { actor: 'Partner', action: 'Click Expo card', screen: 'Partner Expo Detail', path: '/partner/expos', cta: 'Vietnam Furniture Expo 2026', script: 'Khi Partner click vào card, hệ thống mở màn hình chi tiết Expo. Tại đây Partner có thể xem thông tin, banner, template 3D, category, thời gian và các dữ liệu đã được Admin tạo trước đó.' },
    { actor: 'Partner', action: 'Click ảnh 3D Template', screen: 'Partner Expo Detail', path: `/partner/expos/${eid}`, cta: 'preview 3D expo map', script: 'Partner có thể preview template 3D đã được Admin chọn trước đó. Khi click vào ảnh nhỏ, hệ thống mở popup chứa 3D Expo Hall template.' },
    { actor: 'Partner', action: 'Click Submit for Approval', screen: 'Partner Expo Detail', path: `/partner/expos/${eid}`, cta: 'Submit for Approval', script: 'Partner submit Expo để chuyển sang trạng thái vận hành. Sau bước này, Expo chuyển sang trạng thái Upcoming.' },
    { actor: 'Partner', action: 'Mở Expo Operation List', screen: '/partner/operation/expos', path: '/partner/operation/expos', script: 'Ở màn hình Operation, Partner quản lý các Expo đã được duyệt hoặc sắp diễn ra. Expo hiện có trạng thái Upcoming, sẵn sàng cho các hành động vận hành như mời Exhibitor hoặc Visitor.' },
    { actor: 'Partner', action: 'Click Expo Operation card', screen: 'Partner Operation Detail', path: '/partner/operation/expos', cta: 'Vietnam Furniture Expo 2026', script: 'Partner vào chi tiết Expo ở trạng thái vận hành. Lúc này hệ thống hiển thị nút Invite Exhibitor để bắt đầu mời doanh nghiệp tham gia làm nhà trưng bày.' },
    { actor: 'Partner', action: 'Click Invite Exhibitor', screen: 'Invite Exhibitor Modal', path: `/partner/operation/expos/${eid}`, cta: 'Invite Exhibitor', script: 'Đây là modal mời Exhibitor. Partner có thể mời từ danh sách công ty có profile trên Arobid hoặc mời external bằng email.' },
    { actor: 'Partner', action: 'Switch Arobid / External', screen: 'Invite Exhibitor Modal', path: `/partner/operation/expos/${eid}`, cta: 'External', prep: ['Invite Exhibitor'], script: 'Tab Arobid dùng để chọn các company profile đã có trong hệ thống. Tab External dùng để gửi invitation qua email cho các doanh nghiệp bên ngoài.' },
    { actor: 'Partner', action: 'Chọn company profile', screen: 'Invite Exhibitor Modal', path: `/partner/operation/expos/${eid}`, cta: 'Verified supplier', prep: ['Invite Exhibitor', 'Arobid'], script: 'Partner có thể check/uncheck nhiều công ty trong danh sách. Đây mô phỏng danh sách Arobid company profile.' },
    { actor: 'Partner', action: 'Dán nhiều email', screen: 'External Invite Modal', path: `/partner/operation/expos/${eid}`, prep: ['Invite Exhibitor', 'External'], focus: 'Paste emails', script: 'Ở chế độ External, Partner chỉ cần paste nhiều email vào input. Hệ thống tự parse thành email tags, không cần bấm Add Email thủ công.' },
    { actor: 'Partner', action: 'Click Download Excel Template', screen: 'External Invite Modal', path: `/partner/operation/expos/${eid}`, cta: 'Download Excel Template', prep: ['Invite Exhibitor', 'External'],
      script: 'Với danh sách dài, Partner không paste từng email. Partner tải file Excel mẫu — file có sẵn cột Email và vài dòng ví dụ, chỉ cần điền danh sách doanh nghiệp cần mời vào đó.',
      scriptEn: 'For a long list, the Partner does not paste emails one by one. They download the Excel template — it already has an Email column and a few sample rows, so they just fill in the businesses they want to invite.' },
    { actor: 'Partner', action: 'Upload Excel email list', screen: 'External Invite Modal', path: `/partner/operation/expos/${eid}`, prep: ['Invite Exhibitor', 'External'], focus: 'Upload Excel Email List',
      script: 'Điền xong, Partner upload chính file đó lên. Hệ thống đọc file Excel, tự tách toàn bộ email thành tags và bỏ qua các email đã có trong danh sách — không cần nhập tay dòng nào.',
      scriptEn: 'Once filled in, the Partner uploads that same file. The system reads the Excel file, turns every address into a tag, and skips any email already in the list — nothing is typed by hand.' },
    { actor: 'Partner', action: 'Click Copy Invitation Link', screen: 'Invite Modal', path: `/partner/operation/expos/${eid}`, cta: 'Copy Invitation Link', prep: ['Invite Exhibitor'], script: 'Partner có thể copy invitation link để gửi qua kênh riêng như Zalo, email cá nhân hoặc CRM.' },
    { actor: 'Partner', action: 'Click Preview Invitation Email', screen: 'Invite Modal', path: `/partner/operation/expos/${eid}`, cta: 'Preview Invitation Email', prep: ['Invite Exhibitor', 'External'], script: 'Partner preview email trước khi gửi. Email có CTA Join và note rằng template có thể được Arobid điều chỉnh theo yêu cầu Partner.' },
    { actor: 'Partner', action: 'Click Batch Send', screen: 'Invite Modal', path: `/partner/operation/expos/${eid}`, cta: 'Batch Send', prep: ['Invite Exhibitor', 'External'], script: 'Partner gửi hàng loạt invitation email. Trong demo, hệ thống hiển thị trạng thái mock sent để mô phỏng việc email đã được queue.' },
    { actor: 'Exhibitor', action: 'Mở Invitation Email', screen: '/exhibitor/invitation', path: '/exhibitor/invitation', script: 'Exhibitor nhận email mời tham gia Expo. Email có thông tin Expo, ngày tổ chức, category và CTA Join.' },
    { actor: 'Exhibitor', action: 'Click Join', screen: 'TradeXpo Detail', path: '/exhibitor/invitation', cta: 'Join', script: 'Khi Exhibitor click Join, họ được đưa đến trang Expo Detail để xem thông tin Expo trước khi chọn booth.' },
    { actor: 'Exhibitor', action: 'Click Book Now', screen: '/tradexpo/select-position', path: '/tradexpo/expo-detail', cta: 'Book Now', script: 'Exhibitor bắt đầu quy trình đặt booth. Họ có thể chọn booth tier và vị trí booth trên map.' },
    { actor: 'Exhibitor', action: 'Click điểm trên map', screen: 'Select Position', path: '/tradexpo/select-position', cta: 'Select a booth', script: 'Khi click vào một điểm trên map, hệ thống chuyển sang trạng thái selected để thể hiện booth đã được chọn.' },
    { actor: 'Exhibitor', action: 'Click Process to Payment', screen: 'Quick Signup Popup', path: '/tradexpo/select-position', cta: 'Proceed to Payment', prep: ['Select a booth'], script: 'Trước khi payment, hệ thống hiển thị popup Quick Signup ngay trên màn hình hiện tại.' },
    { actor: 'Exhibitor', action: 'Click Quick Sign up', screen: 'Payment Success', path: '/tradexpo/select-position', cta: 'Quick Sign Up', prep: ['Select a booth', 'Proceed to Payment'], script: 'Sau Quick Signup, Khách hàng thanh toán theo phương thức được chọn, sau khi thanh toán thành công, hệ thống chuyển đến màn hình thanh toán thành công.' },
    { actor: 'Exhibitor', action: 'Click Customize your booth', screen: '/exhibitor/ai-onboarding', path: '/tradexpo/payment-success', cta: 'Customize', script: 'Sau payment thành công, Exhibitor được dẫn đến bước customize booth, bắt đầu từ AI Onboarding.' },
    { actor: 'Exhibitor', action: 'Click AroAI Onboarding', screen: 'AI Onboarding', path: '/exhibitor/ai-onboarding', cta: 'AroAI Onboarding', script: 'AroAI Onboarding cho phép doanh nghiệp nhập website để AI crawl và tạo profile ban đầu.' },
    { actor: 'Exhibitor', action: 'Click Start Scan & Create Profile', screen: 'AI Loading → General Info', path: '/exhibitor/ai-onboarding', cta: 'Start Scan', prep: ['AroAI Onboarding'], script: 'Sau quá trình AI extracting, hệ thống hiển thị trang General Info với dữ liệu đã được prefill.' },
    { actor: 'Exhibitor', action: 'Click Preview Profile', screen: 'General Info', path: '/exhibitor/general-info', cta: 'Preview Profile', script: 'Exhibitor có thể preview profile public trên Arobid.' },
    { actor: 'Exhibitor', action: 'Click Submit', screen: 'General Info → Login', path: '/exhibitor/general-info', cta: 'Submit', script: 'Sau khi submit General Info, hệ thống chuyển Exhibitor đến trang tạo tài khoản.' },
    { actor: 'Exhibitor', action: 'Mở Create Account', screen: '/exhibitor/login', path: '/exhibitor/login', script: 'Đây là màn hình tạo tài khoản Arobid cho Exhibitor.' },
    { actor: 'Exhibitor', action: 'Click Create Arobid Account', screen: '/user/workspace', path: '/exhibitor/login', cta: 'Create Arobid Account', script: 'Sau khi Tạo tài khoản/ Đăng nhập, Exhibitor được dẫn đến trang Booth Config.' },
    { actor: 'Exhibitor', action: 'Mở Booth Config Workspace', screen: '/user/workspace', path: '/user/workspace', script: 'Đây là workspace để Exhibitor cấu hình booth: màu sắc, banner, featured products, video, preview và save customization.' },
    { actor: 'Exhibitor', action: 'Click Select Product', screen: 'Product Selection Modal', path: '/user/workspace', cta: 'Select Product', script: 'Featured Products cho phép chọn sản phẩm đã được upload trước đó từ AI Onboarding. User có thể check/uncheck sản phẩm để đưa vào booth.' },
    { actor: 'Exhibitor', action: 'Click Save Customization Booth', screen: 'Expo Dashboard', path: '/user/workspace', cta: 'Save Customization', script: 'Sau khi lưu booth customization, hệ thống chuyển sang dashboard các Expo mà doanh nghiệp đã tham gia.' },
    { actor: 'Exhibitor', action: 'Click Expo card', screen: 'Joined Expo Detail', path: '/user/workspace/expo-dashboard', cta: 'Vietnam Furniture Expo 2026', script: 'Khi Exhibitor chọn expo, hệ thống hiển thị chi tiết Expo ở màn hình quản lý của Exhibitor.' },
    { actor: 'Exhibitor', action: 'Click Go to RFQ Center', screen: 'KPI Section', path: `/user/workspace/expo-dashboard/${eid}`, cta: 'RFQ Center', script: 'CTA này đại diện cho việc đi đến RFQ Center để xử lý các RFQ từ buyer. Trong demo hiện tại, button thể hiện entry point tương tác.' },
    { actor: 'Exhibitor', action: 'Click Go to Deal Room (Chat)', screen: 'KPI Section', path: `/user/workspace/expo-dashboard/${eid}`, cta: 'Deal Room', script: 'CTA này đại diện cho việc đi đến Deal Room để chat với buyer hoặc xử lý hội thoại thương mại.' },
    { actor: 'Exhibitor', action: 'Click Go To 3D Expo', screen: 'Joined Expo Detail', path: `/user/workspace/expo-dashboard/${eid}`, cta: '3D Expo', script: 'User có thể mở 3D expo đã tham gia.' },
    { actor: 'Exhibitor', action: 'Click Invite Visitor', screen: 'Visitor Invite Modal', path: `/user/workspace/expo-dashboard/${eid}`, cta: 'Invite Visitor', script: 'Exhibitor hoặc workspace user có thể mời Visitor vào Expo.' },
    { actor: 'Exhibitor', action: 'Preview Visitor Email', screen: 'Visitor Invite Modal', path: `/user/workspace/expo-dashboard/${eid}`, cta: 'Preview Invitation Email', prep: ['Invite Visitor'], script: 'Email preview có CTA Join. CTA này dẫn Visitor đến Expo Detail Page để xem thông tin Expo.' },
    { actor: 'Visitor', action: 'Mở Visitor Invitation Email', screen: '/visitor/invitation', path: '/visitor/invitation', script: 'Visitor nhận email mời tham quan Expo. Nội dung tập trung vào việc khám phá exhibitor, sản phẩm và 3D Expo.' },
    { actor: 'Visitor', action: 'Click Join', screen: '/tradexpo/expo-detail', path: '/visitor/invitation', cta: 'Join', script: 'Visitor được đưa vào Expo Detail Page.' },
    { actor: 'Visitor', action: 'Click Virtual Lobby', screen: 'TradeXpo Banner', path: '/tradexpo/expo-detail', cta: 'Virtual Lobby', script: 'Visitor có thể click Virtual Lobby để vào 3D Expo.' },
    { actor: 'Visitor', action: 'Browse Expo Detail Page', screen: 'TradeXpo Detail', path: '/tradexpo/expo-detail', script: 'Visitor có thể xem thông tin Expo, exhibitor cards, featured products, Who Should Attend, Exclusive Values, booth types và footer.' },
    { actor: 'Visitor / Exhibitor', action: 'Click Book Now', screen: 'Select Position', path: '/tradexpo/expo-detail', cta: 'Book Now', script: 'Nếu người dùng muốn tham gia với vai trò Exhibitor, họ có thể đi tiếp vào flow chọn booth và thanh toán.' },
]

// `demoScriptEn` (i18n.dict.ts) is a positional array covering the ORIGINAL steps
// of this journey. Fold it into each step ONCE, here, so every consumer reads
// `step.scriptEn` instead of indexing by position — a role flow that replays a
// SUBSET of these steps would otherwise pair each step with the wrong translation.
//
// Steps added later carry their `scriptEn` inline. They must NOT consume a slot in
// the positional array, or every step after an insertion point would shift onto the
// wrong translation — hence the separate cursor rather than the map index.
let enCursor = 0
export const demoScriptSteps: DemoJourneyStep[] = rawDemoScriptSteps.map((step) =>
  step.scriptEn ? step : { ...step, scriptEn: demoScriptEn[enCursor++] ?? step.script },
)

// Named segments of the full journey, replayed by the role flows in `flows.ts`.
// Flows may share a segment — they are plain data, so overlap is free.
const seg = (from: number, to: number) => demoScriptSteps.slice(from, to)
export const journeySegments = {
  adminCreateExpo: seg(2, 8), //        Expo list → Create New → owner/banner/hall checks → Submit
  partnerExpoConfig: seg(8, 12), //     Config list → Expo card → 3D template → Submit for Approval
  partnerOperation: seg(12, 14), //     Operation list → Operation detail
  partnerInvite: seg(14, 23), //        Invite Exhibitor modal → Arobid/External → emails → Excel import → preview → Batch Send
  exhibitorBooking: seg(23, 30), //     Invitation → Join → Book Now → booth position → Quick Signup → payment → Customize
  exhibitorAiOnboarding: seg(30, 34), // AroAI Onboarding → Start Scan → Preview Profile → Submit
  exhibitorAccount: seg(34, 36), //     Create Account → Create Arobid Account
  exhibitorBooth: seg(36, 39), //       Booth Config Workspace → Select Product → Save Customization
  exhibitorExpoDetail: seg(39, 41), //  Joined Expo card → Go to RFQ Center
  visitorDiscovery: seg(45, 50), //     Visitor invite → Join → Virtual Lobby → browse Expo detail → Book Now
}
