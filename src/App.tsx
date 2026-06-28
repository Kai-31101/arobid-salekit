import { useEffect, useRef, useState } from 'react'
import { furnitureExpoMock, mockPartnerEmails } from './mockData'

type Expo = {
  image: string
  name: string
  description: string
  owner: string
  categories: string
  duration: string
  created: string
  status: 'Live' | 'Draft' | 'Archived'
}

const expos: Expo[] = [
  { image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=160&q=80', name: 'Vietnam Manufacturing Expo 2026', description: 'A digital B2B exhibition for industrial components, precision engineering, and manufacturing technologies.', owner: 'expo.owner@vietindustry.vn', categories: 'Industrial Components, Machinery', duration: '12/08/2026 - 14/08/2026', created: '26/06/2026', status: 'Live' },
  { image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=160&q=80', name: 'Vietnam Food Expo 2026', description: 'A marketplace for food and beverage producers, buyers, and international distribution partners.', owner: 'operations@foodexpo.vn', categories: 'Food & Beverage, Packaging', duration: '05/09/2026 - 07/09/2026', created: '24/06/2026', status: 'Draft' },
  { image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=160&q=80', name: 'Smart Retail & Commerce Expo', description: 'Explore retail technology, omnichannel commerce, and new buyer engagement opportunities.', owner: 'admin@smartretail.vn', categories: 'Business Services, Electronics', duration: '20/07/2026 - 22/07/2026', created: '19/06/2026', status: 'Live' },
  { image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=160&q=80', name: 'Vietnam Green Growth Forum', description: 'An event for sustainable products, clean technology, and green trade initiatives.', owner: 'programs@greengrowth.vn', categories: 'Energy, Environmental Services', duration: '15/05/2026 - 16/05/2026', created: '08/05/2026', status: 'Archived' },
  { image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=160&q=80', name: 'Asia Home & Lifestyle Fair', description: 'A curated digital fair for homeware, furniture, gifts, and lifestyle suppliers.', owner: 'partner@asialifestyle.com', categories: 'Home & Garden, Consumer Goods', duration: '02/04/2026 - 04/04/2026', created: '20/03/2026', status: 'Archived' },
]

const menuItems = ['Dashboard', 'Users', 'Companies', 'Expos', 'Categories', 'Packages', 'Orders']

export default function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // On each page access, briefly glow the actionable controls so the user can
  // spot what they can interact with: links/buttons that navigate or open a
  // modal, fill-in fields, and file uploads. Lasts 2s, then clears. Skipped on
  // the demo-journey route (it runs its own guided glow) and inside the demo
  // iframe (the parent demo drives highlighting there).
  useEffect(() => {
    if (pathname === '/demo-journey') return
    if (window.self !== window.top) return
    let glowed: Element[] = []
    const sel = 'a[href], button, input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), textarea, select, [role="button"], label[class*="choose-file"], label[class*="upload"]'
    const start = window.setTimeout(() => {
      glowed = Array.from(document.querySelectorAll(sel)).filter((el) => {
        if (el.closest('.script-overlay')) return false
        // Skip absolutely/fixed-positioned controls (e.g. the floating "Show
        // Script" button): the glow sets position:relative, which would pull them
        // out of place. They also aren't part of the page's primary action flow.
        const pos = window.getComputedStyle(el).position
        if (pos === 'fixed' || pos === 'absolute' || pos === 'sticky') return false
        const r = el.getBoundingClientRect()
        return r.width > 0 && r.height > 0
      })
      glowed.forEach((el) => el.classList.add('page-glow'))
    }, 120)
    const stop = window.setTimeout(() => glowed.forEach((el) => el.classList.remove('page-glow')), 2120)
    return () => {
      window.clearTimeout(start)
      window.clearTimeout(stop)
      glowed.forEach((el) => el.classList.remove('page-glow'))
    }
  }, [pathname])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setPathname(path)
  }

  // Clicking the logo always returns to the role selection (main) page. When a
  // screen is rendered inside the demo-journey iframe, navigate the TOP window so
  // the user lands on the real role selection page instead of just resetting the
  // iframe behind the demo chrome.
  const goRoleSelection = () => {
    if (window.top && window.top !== window.self) {
      window.top.location.href = '/'
    } else {
      navigate('/')
    }
  }

  if (pathname !== '/demo-journey' && pathname !== '/admin/expo' && pathname !== '/admin/expo/create' && pathname !== '/partner/expos' && pathname !== '/partner/operation/expos' && pathname !== '/exhibitor/invitation' && pathname !== '/visitor/invitation' && pathname !== '/exhibitor/login' && pathname !== '/exhibitor/ai-onboarding' && pathname !== '/exhibitor/general-info' && pathname !== '/user/workspace' && pathname !== '/user/workspace/expo-dashboard' && pathname !== `/user/workspace/expo-dashboard/${furnitureExpoMock.id}` && pathname !== '/tradexpo/select-booth-tier' && pathname !== '/tradexpo/expo-detail' && pathname !== '/tradexpo/select-position' && pathname !== '/tradexpo/payment-success' && pathname !== `/partner/expos/${furnitureExpoMock.id}` && pathname !== `/partner/operation/expos/${furnitureExpoMock.id}`) {
    return <RoleSelection onSelect={navigate} />
  }

  if (pathname === '/demo-journey') {
    return <DemoJourney onExit={() => navigate('/')} />
  }

  if (pathname === '/admin/expo/create') {
    return <CreateExpoPage onBack={() => navigate('/admin/expo')} onSubmit={() => navigate('/')} onLogoClick={goRoleSelection} />
  }

  if (pathname === '/exhibitor/invitation') {
    return <ExhibitorInvitationEmail onLogoClick={goRoleSelection} onJoin={() => navigate('/tradexpo/select-booth-tier')} />
  }

  if (pathname === '/visitor/invitation') {
    return <VisitorInvitationEmail onLogoClick={goRoleSelection} onJoin={() => navigate('/tradexpo/expo-detail')} />
  }

  if (pathname === '/tradexpo/select-booth-tier') {
    return <TradeXpoSelectBoothTier onLogoClick={goRoleSelection} onBookNow={() => navigate('/tradexpo/select-position')} />
  }

  if (pathname === '/tradexpo/expo-detail') {
    return <TradeXpoSelectBoothTier onLogoClick={goRoleSelection} onBookNow={() => navigate('/tradexpo/select-position')} autoScroll={false} />
  }

  if (pathname === '/tradexpo/select-position') {
    return <TradeXpoSelectPosition onLogoClick={goRoleSelection} onBack={() => navigate('/tradexpo/select-booth-tier')} onPaymentSuccess={() => navigate('/tradexpo/payment-success')} />
  }

  if (pathname === '/tradexpo/payment-success') {
    return <TradeXpoPaymentSuccess onLogoClick={goRoleSelection} onBackToExpo={() => navigate('/tradexpo/select-booth-tier')} onCustomizeBooth={() => navigate('/exhibitor/ai-onboarding')} />
  }

  if (pathname === '/exhibitor/login') {
    return <ExhibitorLoginReference onLogoClick={goRoleSelection} onCreateAccount={() => navigate('/user/workspace')} />
  }

  if (pathname === '/exhibitor/ai-onboarding') {
    return <ExhibitorAiOnboardingEntry onLogoClick={goRoleSelection} onStartScan={() => navigate('/exhibitor/general-info')} />
  }

  if (pathname === '/exhibitor/general-info') {
    return <ExhibitorGeneralInfoPage onLogoClick={goRoleSelection} onBack={() => navigate('/exhibitor/ai-onboarding')} onSubmit={() => navigate('/exhibitor/login')} />
  }

  if (pathname === '/user/workspace') {
    return <UserWorkspaceBoothConfig onLogoClick={goRoleSelection} onSave={() => navigate('/user/workspace/expo-dashboard')} />
  }

  if (pathname === '/user/workspace/expo-dashboard') {
    return <UserWorkspaceExpoDashboard onLogoClick={goRoleSelection} onOpen={() => navigate(`/user/workspace/expo-dashboard/${furnitureExpoMock.id}`)} />
  }

  if (pathname === `/user/workspace/expo-dashboard/${furnitureExpoMock.id}`) {
    return <UserWorkspaceExpoDetail onLogoClick={goRoleSelection} onBack={() => navigate('/user/workspace/expo-dashboard')} />
  }

  if (pathname === '/partner/expos') {
    return <PartnerExpoList mode="config" onOpen={() => navigate(`/partner/expos/${furnitureExpoMock.id}`)} onLogoClick={goRoleSelection} onExpoConfig={() => navigate('/partner/expos')} onExpoOperation={() => navigate('/partner/operation/expos')} />
  }

  if (pathname === '/partner/operation/expos') {
    return <PartnerExpoList mode="operation" onOpen={() => navigate(`/partner/operation/expos/${furnitureExpoMock.id}`)} onLogoClick={goRoleSelection} onExpoConfig={() => navigate('/partner/expos')} onExpoOperation={() => navigate('/partner/operation/expos')} />
  }

  if (pathname === `/partner/expos/${furnitureExpoMock.id}`) {
    return <PartnerExpoDetail showInvite={false} onBack={() => navigate('/partner/expos')} onLogoClick={goRoleSelection} onExpoConfig={() => navigate('/partner/expos')} onExpoOperation={() => navigate('/partner/operation/expos')} onSubmitApproval={() => navigate('/partner/operation/expos')} />
  }

  if (pathname === `/partner/operation/expos/${furnitureExpoMock.id}`) {
    return <PartnerExpoDetail showInvite onBack={() => navigate('/partner/operation/expos')} onLogoClick={goRoleSelection} onExpoConfig={() => navigate('/partner/expos')} onExpoOperation={() => navigate('/partner/operation/expos')} onSubmitApproval={() => navigate('/partner/operation/expos')} />
  }

  return (
    <div className="admin-app">
      <aside className="sidebar">
        <button className="sidebar-brand logo-button" onClick={goRoleSelection}><img className="arobid-logo" src="/arobid-logo-white.svg" alt="arobid.com" /></button><div className="portal-label">Admin Portal</div>
        <div className="nav-section">Management</div>
        <nav>{menuItems.map((item) => <div key={item} className={`nav-item ${item === 'Expos' ? 'active' : ''}`}><AdminNavIcon item={item} />{item}</div>)}</nav>
        <div className="sidebar-bottom"><span className="admin-avatar">SA</span><div><strong>Super Admin</strong><small>superadmin@gmail.com</small></div><b>›</b></div>
      </aside>

      <section className="admin-content">
        <header className="admin-topbar"><button className="sidebar-toggle" aria-label="Toggle sidebar" onClick={() => window.alert('Mock action: sidebar collapse would happen here.')}>☰</button><div className="breadcrumb"><span>Operations</span><b>/</b><strong>Expos</strong></div><div className="account-menu-wrap"><button className="admin-user" onClick={() => setAccountMenuOpen(!accountMenuOpen)} aria-expanded={accountMenuOpen}><span className="notification">♢</span><span className="user-avatar">SA</span><span>Super Admin</span><span className="chevron">⌄</span></button>{accountMenuOpen && <div className="account-menu"><span className="account-email">superadmin@gmail.com</span><button onClick={() => navigate('/')}><span>◫</span> Role selection</button></div>}</div></header>
        <main className="expos-page">
          <div className="page-heading"><div><h1>Expos</h1><p>Create and manage expos.</p></div><button className="create-button" onClick={() => navigate('/admin/expo/create')}><span>＋</span> Create new</button></div>
          <section className="filters" aria-label="Expo filters">
            <div className="filter search-filter"><label>Search</label><div className="input-shell"><span>⌕</span><input placeholder="Search expo name or owner email" readOnly /></div></div>
            <div className="filter"><label>Status</label><div className="select-shell">All <span>⌄</span></div></div>
            <div className="filter date-filter"><label>Date range</label><div className="date-range"><div>mm/dd/yyyy <span>▣</span></div><i>—</i><div>mm/dd/yyyy <span>▣</span></div></div></div>
            <div className="filter"><label>Category (Level 2)</label><div className="select-shell muted">Select categories <span>⌄</span></div></div>
            <button className="reset-button" onClick={() => window.alert('Mock action: filters reset to default.')}>Reset Filters</button>
          </section>
          <section className="table-card">
            <table>
              <thead><tr><th>Name</th><th>Owner</th><th>Categories</th><th>Duration</th><th>Created</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{expos.map((expo) => <tr key={expo.name}><td className="expo-name"><img src={expo.image} alt="" /><div><strong>{expo.name}</strong><span>{expo.description}</span></div></td><td>{expo.owner}</td><td><span className="category-text">{expo.categories}</span></td><td className="date-cell">{expo.duration}</td><td className="date-cell">{expo.created}</td><td><span className={`status ${expo.status.toLowerCase()}`}>{expo.status}</span></td><td><button className="action-button" aria-label={`Actions for ${expo.name}`} onClick={() => window.alert(`Mock action menu for ${expo.name}: View / Edit / Archive`)}>⋮</button></td></tr>)}</tbody>
            </table>
            <div className="table-footer"><span>Page 1</span><div className="pagination"><div className="per-page">20 / page <span>⌄</span></div><button disabled>← Previous</button><button onClick={() => window.alert('Mock action: next page would load more expos.')}>Next Page →</button></div></div>
          </section>
        </main>
      </section>
    </div>
  )
}

function CreateExpoPage({ onBack, onSubmit, onLogoClick }: { onBack: () => void; onSubmit: () => void; onLogoClick: () => void }) {
  return <div className="admin-app">
    <aside className="sidebar"><button className="sidebar-brand logo-button" onClick={onLogoClick}><img className="arobid-logo" src="/arobid-logo-white.svg" alt="arobid.com" /></button><div className="portal-label">Admin Portal</div><div className="nav-section">Management</div><nav>{menuItems.map((item) => <div key={item} className={`nav-item ${item === 'Expos' ? 'active' : ''}`}><AdminNavIcon item={item} />{item}</div>)}</nav><div className="sidebar-bottom"><span className="admin-avatar">SA</span><div><strong>Super Admin</strong><small>superadmin@gmail.com</small></div><b>›</b></div></aside>
    <section className="admin-content"><header className="admin-topbar"><button className="sidebar-toggle" aria-label="Toggle sidebar" onClick={() => window.alert('Mock action: sidebar collapse would happen here.')}>☰</button><div className="breadcrumb"><span>Operations</span><b>/</b><span>Expos</span><b>/</b><strong>Create Expo</strong></div><div className="account-menu-wrap"><button className="admin-user" onClick={() => window.alert('Mock action: Super Admin account menu would open here.')}><span className="notification">♢</span><span className="user-avatar">SA</span><span>Super Admin</span><span className="chevron">⌄</span></button></div></header>
      <main className="create-expo-page"><div className="create-heading"><div><h1>Create Expo</h1><p>Fill in the details to create a new expo.</p></div><button className="back-list" onClick={onBack}>Back to list</button></div><section className="expo-form">
        <div className="form-grid"><FormField label="Template" required value={furnitureExpoMock.template} select /><FormField label="Expo Owner email" required value={furnitureExpoMock.ownerEmail} select /><FormField label="Expo name" required value={furnitureExpoMock.name} /><FormField label="Timezone" required value={furnitureExpoMock.timezone} select /></div>
        <FormField label="Description" required value={furnitureExpoMock.description} textarea />
        <label className="form-label">Thumbnail</label><div className="upload-box thumbnail-preview"><img src={furnitureExpoMock.thumbnailUrl} alt="Furniture Expo banner preview" /><div className="banner-copy"><strong>{furnitureExpoMock.name}</strong><span>Furniture, design & living spaces</span></div><div className="upload-meta"><strong>{furnitureExpoMock.thumbnailFileName}</strong><span>JPEG, PNG, WEBP up to 5 MB.</span></div><label className="choose-file">Change image<input type="file" accept="image/jpeg,image/png,image/webp" /></label></div>
        <FormField label="Category (Level 2)" required value={furnitureExpoMock.category} select />
        <div className="form-grid"><DateTimeField label="Start date/time" date={furnitureExpoMock.startDate} time={furnitureExpoMock.startTime} /><DateTimeField label="End date/time" date={furnitureExpoMock.endDate} time={furnitureExpoMock.endTime} /></div>
        <div className="hall-heading"><div><h2>Hall configuration</h2><p>One or more halls: name, hall template, and booth tier counts (Basic / Professional / Premium).</p></div><button className="add-hall" onClick={() => window.alert('Mock action: a new hall row would be added.')}>＋ <span>Add Hall</span></button></div>
        <section className="hall-card"><div className="form-grid hall-top"><FormField label="Hall name" required value={furnitureExpoMock.halls[0].name} /><FormField label="Hall template" required value={furnitureExpoMock.halls[0].template} select /></div><button className="delete-hall" aria-label="Delete hall" onClick={() => window.alert('Mock action: this hall would be removed after confirmation.')}>♧</button><div className="tier-grid"><FormField label="Basic" value={String(furnitureExpoMock.halls[0].boothSlots.basic)} /><FormField label="Professional" value={String(furnitureExpoMock.halls[0].boothSlots.professional)} /><FormField label="Premium" value={String(furnitureExpoMock.halls[0].boothSlots.premium)} /></div></section>
        <div className="submit-row"><button className="submit-button" onClick={onSubmit}>Submit</button></div>
      </section></main>
    </section>
  </div>
}

function PartnerExpoList({ mode, onOpen, onLogoClick, onExpoConfig, onExpoOperation }: { mode: 'config' | 'operation'; onOpen: () => void; onLogoClick: () => void; onExpoConfig: () => void; onExpoOperation: () => void }) {
  const totalBooths = Object.values(furnitureExpoMock.halls[0].boothSlots).reduce((total, quantity) => total + quantity, 0)
  const status = mode === 'operation' ? 'Upcoming' : 'Draft'
  return <div className="partner-app"><PartnerSidebar onLogoClick={onLogoClick} onExpoConfig={onExpoConfig} onExpoOperation={onExpoOperation} /><section className="partner-content"><header className="partner-topbar"><span>◧</span><div className="partner-crumb"><span>Overview</span><b>›</b><strong>Expo List</strong></div><span className="partner-notification">♧<i>1</i></span></header><main className="partner-main"><h1>Expo List</h1><div className="partner-filters"><label>⌕<input placeholder="Expo name..." /></label><select defaultValue="All Status"><option>All Status</option><option>Draft</option><option>Upcoming</option><option>Pending Review</option><option>Live</option></select></div><article className="partner-expo-card" onClick={onOpen} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && onOpen()}><img src={furnitureExpoMock.thumbnailUrl} alt="Furniture Expo" /><div className="partner-expo-info"><div className="partner-title-row"><div><h2>{furnitureExpoMock.name}</h2><p>▣ 12 Oct 2026, 09:00 – 16 Oct 2026, 18:00</p></div><span className={mode === 'operation' ? 'upcoming-status' : 'draft-status'}>{status}</span></div><div className="partner-metrics"><div><span>◉</span><b>Total Views</b><strong>0</strong></div><div><span>▧</span><b>Booths</b><strong>0 / {totalBooths}</strong></div><div><span>▤</span><b>RFQs Created</b><strong>0</strong></div><div><span>▢</span><b>Chat Now</b><strong>0</strong></div></div></div></article></main></section></div>
}

function PartnerExpoDetail({ showInvite, onBack, onLogoClick, onExpoConfig, onExpoOperation, onSubmitApproval }: { showInvite: boolean; onBack: () => void; onLogoClick: () => void; onExpoConfig: () => void; onExpoOperation: () => void; onSubmitApproval: () => void }) {
  const [templateOpen, setTemplateOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const notify = (message: string) => window.alert(message)
  return <div className="partner-app"><PartnerSidebar onLogoClick={onLogoClick} onExpoConfig={onExpoConfig} onExpoOperation={onExpoOperation} /><section className="partner-content"><header className="partner-topbar"><span>◧</span><div className="partner-crumb"><span>Overview</span><b>›</b><span>Expo List</span><b>›</b><strong>Expo Detail</strong></div><span className="partner-notification">♧<i>1</i></span></header><main className="partner-main partner-detail-main"><div className="detail-heading"><div><h1>Expo Detail</h1><p>{isEditing ? 'Editing mode is enabled for this demo.' : 'Manage basic information for this expo.'}</p></div><button onClick={onBack}>← Back to list</button></div><section className="detail-card"><div className="detail-card-header"><h2>Basic Information</h2>{showInvite && <button className="invite-exhibitor-button" onClick={() => setInviteOpen(true)}>Invite Exhibitor</button>}</div><div className="detail-basic"><div className="detail-thumb"><label>Thumbnail <b>*</b><small>(500×500px, max 5MB)</small></label><img src={furnitureExpoMock.thumbnailUrl} alt="Furniture Expo thumbnail" /><button onClick={() => notify('Mock action: thumbnail picker would open here.')}>✎</button></div><div className="detail-fields"><label>Exhibition Name <b>*</b><input defaultValue={furnitureExpoMock.name} readOnly={!isEditing && showInvite} /></label><label>Description <b>*</b><textarea defaultValue={furnitureExpoMock.description} rows={3} readOnly={!isEditing && showInvite} /></label><label>Category (Level 2) <b>*</b><div className="detail-chip-field"><span>{furnitureExpoMock.category} ×</span><i>⌄</i></div></label><div className="detail-date-grid"><label>Start Date <b>*</b><input type="datetime-local" defaultValue={`${furnitureExpoMock.startDate}T${furnitureExpoMock.startTime}`} readOnly={!isEditing && showInvite} /></label><label>End Date <b>*</b><input type="datetime-local" defaultValue={`${furnitureExpoMock.endDate}T${furnitureExpoMock.endTime}`} readOnly={!isEditing && showInvite} /></label></div><div><p className="detail-label">3D Template <b>*</b></p><button className="template-preview-card" onClick={() => setTemplateOpen(true)}><img src={furnitureExpoMock.templatePreviewUrl} alt={furnitureExpoMock.templateName} /><span><strong>{furnitureExpoMock.templateName}</strong><small>Click to preview 3D expo map</small></span></button></div><div className="detail-banner"><label>Banner <b>*</b><small>(1080×608px, max 10MB)</small></label><img src={furnitureExpoMock.thumbnailUrl} alt="Furniture Expo banner" /><button onClick={() => notify('Mock action: banner picker would open here.')}>✎</button></div></div></div><div className="detail-actions"><button onClick={onBack}>Cancel</button><div>{showInvite ? <><button onClick={() => setIsEditing(true)}>Edit Details</button><button className="detail-submit" onClick={() => notify('Mock action: expo has been re-submitted for approval.')}>Re-Submit for Approval</button></> : <><button onClick={() => notify('Mock action: draft saved for Partner review.')}>Save Draft</button><button className="detail-submit" onClick={onSubmitApproval}>Submit for Approval</button></>}</div></div></section></main></section>{templateOpen && <ExpoTemplateModal onClose={() => setTemplateOpen(false)} />}{inviteOpen && <InviteExhibitorModal onClose={() => setInviteOpen(false)} />}</div>
}

function ExpoTemplateModal({ onClose }: { onClose: () => void }) {
  return <div className="template-modal-backdrop" role="presentation" onMouseDown={onClose}><section className="template-modal template-viewer-modal" role="dialog" aria-modal="true" aria-label="3D Expo Template Preview" onMouseDown={(event) => event.stopPropagation()}><header><div><p>3D TEMPLATE PREVIEW</p><h2>{furnitureExpoMock.templateName}</h2><span>Selected previously by Admin for this expo.</span></div><button onClick={onClose} aria-label="Close">×</button></header><iframe title="3D Expo map template" src={furnitureExpoMock.templateViewerUrl} allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer" /></section></div>
}

function InviteExhibitorModal({ onClose }: { onClose: () => void }) {
  const suppliers = ['Cath Kidston VN', 'Rex Hotel Saigon', 'Woodcraft Living Co.', 'Vietnam Furniture Export', 'Saigon Interior Studio', 'Automation Hub Vietnam']
  const [externalEmails, setExternalEmails] = useState(['buyer@furniturehub.vn', 'procurement@homeliving.com', 'trade.partner@globalmail.com'])
  const [inviteMode, setInviteMode] = useState<'arobid' | 'external'>('arobid')
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])
  const [emailDraft, setEmailDraft] = useState('')
  const [copied, setCopied] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [sentMessage, setSentMessage] = useState('')
  const copyInvitationLink = () => {
    navigator.clipboard?.writeText('https://arobid.com/invite/vietnam-furniture-expo-2026')
    setCopied(true)
  }
  const addEmail = () => {
    const nextEmail = emailDraft.trim()
    if (!nextEmail || externalEmails.includes(nextEmail)) return
    setExternalEmails([...externalEmails, nextEmail])
    setEmailDraft('')
  }
  const addEmailText = (text: string) => {
    const nextEmails = text.split(/[\s,;]+/).map((email) => email.trim()).filter(Boolean)
    if (!nextEmails.length) return
    setExternalEmails((current) => [...current, ...nextEmails.filter((email) => !current.includes(email))])
    setEmailDraft('')
  }
  const toggleSupplier = (supplier: string) => setSelectedSuppliers((current) => current.includes(supplier) ? current.filter((item) => item !== supplier) : [...current, supplier])
  const selectAllSuppliers = () => setSelectedSuppliers(selectedSuppliers.length === suppliers.length ? [] : suppliers)
  return (
    <div className="template-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="invite-modal" role="dialog" aria-modal="true" aria-label="Invite Exhibitor" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div className="invite-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" /></svg>
          </div>
          <div>
            <h2>Invite Exhibitor</h2>
            <p>{inviteMode === 'arobid' ? 'Select Arobid company profiles to invite' : 'Invite external exhibitors by email'}</p>
          </div>
          <button onClick={onClose} aria-label="Close">×</button>
        </header>

        <div className="invite-body">
          <div className="invite-switch">
            <button className={inviteMode === 'arobid' ? 'active' : ''} onClick={() => setInviteMode('arobid')}>Arobid</button>
            <button className={inviteMode === 'external' ? 'active' : ''} onClick={() => setInviteMode('external')}>External</button>
          </div>

          {inviteMode === 'arobid' ? (
            <>
              <div className="invite-filters">
                <label>⌕<input placeholder="Search suppliers..." /></label>
                <select defaultValue="All Categories"><option>All Categories</option><option>Furnitures</option><option>Home & Garden</option></select>
                <select defaultValue="All Regions"><option>All Regions</option><option>Viet Nam</option><option>Singapore</option><option>Thailand</option></select>
                <button onClick={() => setSelectedSuppliers([])}>× Reset filters</button>
              </div>
              <div className="invite-summary">
                <span>Total 1693 suppliers · {selectedSuppliers.length} selected</span>
                <button onClick={selectAllSuppliers}>{selectedSuppliers.length === suppliers.length ? 'Clear all' : 'Select all'}</button>
              </div>
              <div className="supplier-grid">
                {suppliers.map((supplier, index) => (
                  <button key={supplier} className={`supplier-card ${selectedSuppliers.includes(supplier) ? 'selected' : ''}`} onClick={() => toggleSupplier(supplier)}>
                    <span className="supplier-check">{selectedSuppliers.includes(supplier) ? '✓' : ''}</span>
                    <div className="supplier-row">
                      <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(supplier)}&backgroundColor=fff1e8,e8f8f2,eef3f8`} alt="" />
                      <div><strong>{supplier}</strong><small>✓ Verified supplier</small></div>
                    </div>
                    <span className="supplier-region">{index < 5 ? 'Viet Nam' : 'Singapore'}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="external-invite-panel">
              <label>Email recipients</label>
              <div className="email-tag-input">
                {externalEmails.map((email) => <span key={email}>{email}<button onClick={() => setExternalEmails(externalEmails.filter((item) => item !== email))}>×</button></span>)}
                <input value={emailDraft} onChange={(event) => setEmailDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ',') { event.preventDefault(); addEmailText(emailDraft) } }} onPaste={(event) => { event.preventDefault(); addEmailText(event.clipboardData.getData('text')) }} placeholder="Paste emails or type, then press Enter..." />
              </div>
              <p>External exhibitors will receive an invitation email with the expo registration link.</p>
              {previewOpen && (
                <div className="email-preview">
                  <strong>Invitation Email Preview</strong>
                  <p className="email-subject">Subject: Invitation to join {furnitureExpoMock.name}</p>
                  <div className="email-preview-card">
                    <h3>You're invited to join {furnitureExpoMock.name}</h3>
                    <p>Hello, you are invited to register as an exhibitor for Vietnam Furniture Expo 2026. Click the button below to start onboarding and reserve your booth.</p>
                    <button>Join</button>
                  </div>
                  <p className="email-note">Note: Email template will be modified by Arobid based on Partner requirement.</p>
                </div>
              )}
              {sentMessage && <p className="send-confirmation">{sentMessage}</p>}
            </div>
          )}
        </div>

        <footer>
          {inviteMode === 'external' ? (
            <>
              <button className="copy-link" onClick={copyInvitationLink}>{copied ? '✓ Link Copied' : '🔗 Copy Invitation Link'}</button>
              <button onClick={() => setPreviewOpen(!previewOpen)}>{previewOpen ? 'Hide Email Preview' : 'Preview Invitation Email'}</button>
              <button className="batch-send-button" onClick={() => setSentMessage(`Mock sent: ${externalEmails.length} invitation emails queued.`)}>Batch Send {externalEmails.length}</button>
              <button onClick={onClose}>Cancel</button>
            </>
          ) : (
            <>
              <button className="copy-link" onClick={copyInvitationLink}>{copied ? '✓ Link Copied' : '🔗 Copy Invitation Link'}</button>
              <button onClick={onClose}>Cancel</button>
              <button disabled={!selectedSuppliers.length} onClick={() => setSentMessage(`Mock sent: ${selectedSuppliers.length} Arobid invitations queued.`)}>Send ({selectedSuppliers.length}) Invitations</button>
            </>
          )}
        </footer>
      </section>
    </div>
  )
}

function ExpoHallTemplate({ name, type, selected }: { name: string; type: 'standard' | 'premium' | 'grand'; selected?: boolean }) {
  return <button className={`expo-hall-template ${type} ${selected ? 'selected' : ''}`}><div className="hall-3d"><span className="hall-sign">EXPO</span><span className="hall-stage">STAGE</span><span className="hall-entry">ENTRY</span>{Array.from({ length: type === 'grand' ? 12 : type === 'premium' ? 10 : 8 }, (_, index) => <i key={index} />)}</div><strong>{name}</strong><span>{type === 'standard' ? '200 booth layout' : type === 'premium' ? '300 booth layout' : '500 booth layout'}</span></button>
}

function PartnerSidebar({ onLogoClick, onExpoConfig, onExpoOperation }: { onLogoClick: () => void; onExpoConfig: () => void; onExpoOperation: () => void }) {
  const [roleOpen, setRoleOpen] = useState(false)
  return <aside className="partner-sidebar"><button className="partner-brand logo-button" onClick={onLogoClick}><img className="arobid-logo" src="/arobid-logo-white.svg" alt="arobid.com" /></button><div className="portal-label">Partner Portal</div><nav className="partner-nav"><div className="partner-nav-item"><span>▦</span>Overview</div><div className="partner-nav-item"><span>◌</span>Deal Room</div><PartnerNavGroup icon="♧" label="Partner Site Management" items={['Site Setting', 'Enterprises Management', 'Invitations']} /><PartnerNavGroup icon="◉" label="Expo Programs" items={['Dashboard', 'Expo Settings', 'Invitations']} activeItem="Expo Settings" /><PartnerNavGroup icon="▤" label="Bundle Management" items={['Bundle Creation', 'Bundle Pricing']} /><PartnerNavGroup icon="⊞" label="Data Center" items={['Enterprise Reports', 'Expo Reports', 'Trade Reports', 'Credit & Revenue Reports', 'Buyer Lead Reports']} /><div className="partner-nav-item"><span>▢</span>TradeCredit Wallet</div></nav><div className="partner-profile-wrap"><button className="partner-profile" onClick={() => setRoleOpen(!roleOpen)} aria-expanded={roleOpen}><span>Logo</span><div><strong>Tenant Partner Admin</strong><small>{furnitureExpoMock.ownerEmail}</small></div><b>›</b></button>{roleOpen && <div className="partner-role-menu profile-role-menu"><button onClick={onExpoConfig}><strong>Expo Config</strong><small>Configure expo setup and draft content</small></button><button onClick={onExpoOperation}><strong>Expo Operation</strong><small>Operate approved and upcoming expos</small></button></div>}</div></aside>
}

function PartnerNavGroup({ icon, label, items, activeItem }: { icon: string; label: string; items: string[]; activeItem?: string }) {
  return <section className="partner-nav-group"><div className="partner-nav-item parent"><span>{icon}</span>{label}<b>⌄</b></div><div className="partner-subnav">{items.map((item) => <div key={item} className={`partner-subnav-item ${item === activeItem ? 'selected' : ''}`}>{item}</div>)}</div></section>
}

function UserWorkspaceBoothConfig({ onLogoClick, onSave }: { onLogoClick: () => void; onSave: () => void }) {
  const productCatalog = [
    { name: 'Premium Melamine Board', category: 'Furniture Materials', price: '$42.00 / sheet', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=180&q=80', source: 'AI Onboarding' },
    { name: 'Modern Kitchen Cabinet', category: 'Kitchen Furniture', price: '$680.00 / set', image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=180&q=80', source: 'AI Onboarding' },
    { name: 'Decorative Laminate Surface', category: 'Interior Surface', price: '$35.00 / sqm', image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=180&q=80', source: 'AI Onboarding' },
    { name: 'Wardrobe Sliding Door System', category: 'Home Furniture', price: '$220.00 / set', image: 'https://images.unsplash.com/photo-1618220048045-10a6dbdf83e0?auto=format&fit=crop&w=180&q=80', source: 'AI Onboarding' },
    { name: 'Wood Grain Acrylic Panel', category: 'Decorative Panel', price: '$58.00 / panel', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=180&q=80', source: 'AI Onboarding' },
    { name: 'Modular Office Storage', category: 'Office Furniture', price: '$310.00 / unit', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=180&q=80', source: 'AI Onboarding' },
  ]
  const [productSelectorOpen, setProductSelectorOpen] = useState(false)
  const [selectedProductNames, setSelectedProductNames] = useState(productCatalog.slice(0, 3).map((product) => product.name))
  const selectedProducts = productCatalog.filter((product) => selectedProductNames.includes(product.name))
  const toggleProduct = (productName: string) => setSelectedProductNames((current) => current.includes(productName) ? current.filter((name) => name !== productName) : [...current, productName])

  return (
    <div className="partner-app user-workspace-app">
      <UserWorkspaceSidebar onLogoClick={onLogoClick} />
      <section className="partner-content">
        <header className="partner-topbar user-workspace-topbar">
          <span>□</span>
          <div className="partner-crumb"><span>User Workspace</span><b>›</b><span>Expo Management</span><b>›</b><strong>Booth Config</strong></div>
          <div className="workspace-company">Cong ty Co phan Go An Cuong</div>
          <button className="workspace-language">EN - USD</button>
          <span className="partner-notification">◇<i>1</i></span>
        </header>

        <main className="partner-main user-workspace-main">
          <section className="workspace-hero">
            <div>
              <p className="workspace-eyebrow">User Workspace</p>
              <h1>Config Booth Version</h1>
              <p>Customize your booth experience for {furnitureExpoMock.name}. Set brand colors, banners, featured products, YouTube video, and preview everything before saving.</p>
            </div>
            <div className="workspace-hero-actions">
              <button className="workspace-secondary-button" onClick={() => window.alert('Mock action: preview opens the live 3D booth.')}>Preview Booth</button>
              <button className="workspace-primary-button" onClick={onSave}>Save Customization</button>
            </div>
          </section>

          <section className="workspace-layout">
            <aside className="booth-config-panel">
              <div className="booth-version-card">
                <span>Current version</span>
                <strong>Version 1.2</strong>
                <p>Unsaved changes: color, banner, and product display order.</p>
              </div>

              <div className="config-section color-section">
                <div className="config-heading">
                  <span><WorkspaceIcon type="color" /></span>
                  <div><h2>Brand Colors</h2><p>Primary and secondary colors update the preview immediately.</p></div>
                </div>
                <label>Primary Color<input defaultValue="#0B3A7E" /></label>
                <label>Secondary Color<input defaultValue="#ED6203" /></label>
                <div className="color-swatches"><i style={{ background: '#0B3A7E' }} /><i style={{ background: '#ED6203' }} /><i style={{ background: '#F8FAFC' }} /></div>
              </div>

              <div className="config-section">
                <div className="config-heading">
                  <span><WorkspaceIcon type="image" /></span>
                  <div><h2>Banner Images</h2><p>Upload JPG/PNG banners and crop if aspect ratio does not match.</p></div>
                </div>
                <div className="banner-upload-list">
                  <button><img src={furnitureExpoMock.thumbnailUrl} alt="" /><span>Main booth banner</span><b>Replace</b></button>
                  <button><span className="empty-upload">+</span><span>Side wall banner</span><b>Upload</b></button>
                </div>
              </div>

              <div className="config-section">
                <div className="config-heading">
                  <span><WorkspaceIcon type="product" /></span>
                  <div><h2>Featured Products</h2><p>Selected catalog products show as 2D frames inside the booth.</p></div>
                </div>
                <button className="select-product-button" onClick={() => setProductSelectorOpen(true)}>Select Product</button>
                <div className="featured-product-list">
                  {selectedProducts.map((product) => (
                    <article key={product.name}>
                      <img src={product.image} alt="" />
                      <div><strong>{product.name}</strong><small>{product.price}</small></div>
                      <span>✓</span>
                    </article>
                  ))}
                  {!selectedProducts.length && <div className="selected-product-empty">No product selected. Click Select Product to add product frames to this booth.</div>}
                </div>
              </div>

              <div className="config-section">
                <div className="config-heading">
                  <span><WorkspaceIcon type="video" /></span>
                  <div><h2>Video</h2><p>Only YouTube watch, youtu.be, and shorts links are accepted.</p></div>
                </div>
                <label>YouTube URL<input defaultValue="https://www.youtube.com/watch?v=arobid-demo" /></label>
              </div>

              <div className="config-actions">
                <button className="workspace-secondary-button" onClick={() => window.alert('This will remove colors, logo, products, images. This cannot be undone. Continue?')}>Reset to Default</button>
                <button className="workspace-primary-button" onClick={onSave}>Save Customization</button>
              </div>
            </aside>

            <section className="booth-preview-panel">
              <div className="preview-toolbar">
                <div>
                  <h2>3D Booth Preview</h2>
                  <p>Live preview combines all active customization modules.</p>
                </div>
                <span>Live Preview</span>
              </div>

              <div className="booth-stage">
                <div className="booth-wall back-wall">
                  <img src={furnitureExpoMock.thumbnailUrl} alt="" />
                  <strong>AN CUONG</strong>
                </div>
                <div className="booth-wall left-wall" />
                <div className="booth-wall right-wall">
                  <div className="video-frame">YouTube Video</div>
                </div>
                <div className="product-frame-row">
                  {selectedProducts.map((product) => (
                    <div key={product.name}><img src={product.image} alt="" /><span>{product.name}</span></div>
                  ))}
                </div>
                <div className="booth-floor"><span>Furniture Expo Booth</span></div>
              </div>

              <div className="preview-info-grid">
                <div><strong>Booth tier</strong><span>Premium</span></div>
                <div><strong>Featured products</strong><span>{selectedProducts.length} selected</span></div>
                <div><strong>Banner slots</strong><span>1 / 2 filled</span></div>
                <div><strong>Save state</strong><span>Unsaved changes</span></div>
              </div>

            </section>
          </section>
        </main>
      </section>
      {productSelectorOpen && <ProductSelectorModal products={productCatalog} selectedProductNames={selectedProductNames} onToggleProduct={toggleProduct} onClose={() => setProductSelectorOpen(false)} />}
    </div>
  )
}

function ProductSelectorModal({ products, selectedProductNames, onToggleProduct, onClose }: { products: Array<{ name: string; category: string; price: string; image: string; source: string }>; selectedProductNames: string[]; onToggleProduct: (productName: string) => void; onClose: () => void }) {
  return (
    <div className="template-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="product-selector-modal" role="dialog" aria-modal="true" aria-label="Select Product" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div>
            <p>PRODUCT CATALOG</p>
            <h2>Select Product</h2>
            <span>Products uploaded previously from AI Onboarding for An Cuong.</span>
          </div>
          <button onClick={onClose} aria-label="Close">×</button>
        </header>
        <div className="product-selector-toolbar">
          <label>⌕<input placeholder="Search product name..." /></label>
          <select defaultValue="All Categories"><option>All Categories</option><option>Furniture Materials</option><option>Kitchen Furniture</option><option>Interior Surface</option></select>
          <span>{selectedProductNames.length} selected</span>
        </div>
        <div className="product-selector-list">
          {products.map((product) => {
            const selected = selectedProductNames.includes(product.name)
            return (
              <button key={product.name} className={`catalog-product-row ${selected ? 'selected' : ''}`} onClick={() => onToggleProduct(product.name)}>
                <span className="catalog-check">{selected ? '✓' : ''}</span>
                <img src={product.image} alt="" />
                <div>
                  <strong>{product.name}</strong>
                  <small>{product.category} · {product.source}</small>
                </div>
                <em>{product.price}</em>
              </button>
            )
          })}
        </div>
        <footer>
          <button onClick={onClose}>Cancel</button>
          <button className="workspace-primary-button" onClick={onClose}>Apply Selection</button>
        </footer>
      </section>
    </div>
  )
}

function UserWorkspaceExpoDashboard({ onLogoClick, onOpen }: { onLogoClick: () => void; onOpen: () => void }) {
  const totalBooths = furnitureExpoMock.halls.reduce((sum, hall) => sum + hall.boothSlots.basic + hall.boothSlots.professional + hall.boothSlots.premium, 0)

  return (
    <div className="partner-app user-workspace-app">
      <UserWorkspaceSidebar onLogoClick={onLogoClick} />
      <section className="partner-content">
        <header className="partner-topbar user-workspace-topbar">
          <span>□</span>
          <div className="partner-crumb"><span>User Workspace</span><b>›</b><span>Expo Management</span><b>›</b><strong>Expo Dashboard</strong></div>
          <div className="workspace-company">Cong ty Co phan Go An Cuong</div>
          <button className="workspace-language">EN - USD</button>
          <span className="partner-notification">◇<i>1</i></span>
        </header>

        <main className="partner-main user-workspace-main">
          <section className="workspace-hero">
            <div>
              <p className="workspace-eyebrow">Joined Expo</p>
              <h1>Expo Dashboard</h1>
              <p>View the expos your company has joined. Click an expo card to open detailed KPI and booth actions.</p>
            </div>
          </section>

          <section className="joined-expo-list">
            <article className="joined-expo-card" onClick={onOpen} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && onOpen()}>
              <img src={furnitureExpoMock.thumbnailUrl} alt={furnitureExpoMock.name} />
              <div>
                <div className="joined-expo-status-row"><span className="upcoming">Upcoming</span><span className="live">Live</span></div>
                <h2>{furnitureExpoMock.name}</h2>
                <p>{furnitureExpoMock.description}</p>
                <ul>
                  <li><CalendarIcon /> 12 Oct 2026, 09:00 – 16 Oct 2026, 18:00</li>
                  <li><BoothIcon /> Premium Booth · Hall B · Booth 18</li>
                  <li>{furnitureExpoMock.category} · {totalBooths} total booths</li>
                </ul>
              </div>
            </article>
          </section>
        </main>
      </section>
    </div>
  )
}

function UserWorkspaceExpoDetail({ onLogoClick, onBack }: { onLogoClick: () => void; onBack: () => void }) {
  const [visitorInviteOpen, setVisitorInviteOpen] = useState(false)
  const goTo3DExpo = () => window.open(furnitureExpoMock.templateViewerUrl, '_blank', 'noopener,noreferrer')
  const totalBooths = furnitureExpoMock.halls.reduce((sum, hall) => sum + hall.boothSlots.basic + hall.boothSlots.professional + hall.boothSlots.premium, 0)

  return (
    <div className="partner-app user-workspace-app">
      <UserWorkspaceSidebar onLogoClick={onLogoClick} />
      <section className="partner-content">
        <header className="partner-topbar user-workspace-topbar">
          <span>□</span>
          <div className="partner-crumb"><span>User Workspace</span><b>›</b><span>Expo Dashboard</span><b>›</b><strong>{furnitureExpoMock.name}</strong></div>
          <div className="workspace-company">Cong ty Co phan Go An Cuong</div>
          <button className="workspace-language">EN - USD</button>
          <span className="partner-notification">◇<i>1</i></span>
        </header>

        <main className="partner-main user-workspace-main">
          <section className="workspace-hero">
            <div>
              <p className="workspace-eyebrow">Expo Detail</p>
              <h1>{furnitureExpoMock.name}</h1>
              <p>Track buyer interactions, RFQ activity, and direct access to the live 3D exhibition space.</p>
            </div>
            <div className="workspace-hero-actions">
              <button className="workspace-secondary-button" onClick={onBack}>Back to Dashboard</button>
              <button className="workspace-primary-button" onClick={() => setVisitorInviteOpen(true)}>Invite Visitor</button>
              <button className="workspace-primary-button" onClick={goTo3DExpo}>Go To 3D Expo</button>
            </div>
          </section>

          <section className="workspace-expo-detail">
            <div className="expo-detail-banner">
              <img src={furnitureExpoMock.thumbnailUrl} alt={furnitureExpoMock.name} />
              <div className="expo-detail-overlay">
                <div className="joined-expo-status-row"><span className="upcoming">Upcoming</span><span className="live">Live</span></div>
                <h2>{furnitureExpoMock.name}</h2>
                <p>{furnitureExpoMock.description}</p>
              </div>
            </div>

            <div className="expo-detail-grid">
              <section className="expo-detail-panel expo-detail-main-panel">
                <div className="expo-detail-section-title">
                  <span>EXPO INFORMATION</span>
                  <h3>Joined Expo Overview</h3>
                </div>
                <div className="expo-info-list">
                  <div><CalendarIcon /><span>Event Time</span><strong>12 Oct 2026, 09:00 – 16 Oct 2026, 18:00</strong></div>
                  <div><BoothIcon /><span>Assigned Booth</span><strong>Premium Booth · Hall B · Booth 18</strong></div>
                  <div><BoothIcon /><span>Category</span><strong>{furnitureExpoMock.category}</strong></div>
                  <div><BoothIcon /><span>Total Booth Inventory</span><strong>{totalBooths} booths</strong></div>
                </div>
              </section>

              <aside className="expo-detail-panel expo-action-panel">
                <div className="expo-detail-section-title">
                  <span>QUICK ACTIONS</span>
                  <h3>Expo Operation</h3>
                </div>
                <button className="workspace-primary-button" onClick={() => setVisitorInviteOpen(true)}>Invite Visitor</button>
                <button className="go-3d-expo-button" onClick={goTo3DExpo}>Go To 3D Expo</button>
              </aside>

              <section className="expo-detail-panel expo-kpi-detail-panel">
                <div className="expo-detail-section-title">
                  <span>LIVE KPI</span>
                  <h3>Buyer Engagement</h3>
                  <p>Your booth is published and ready for buyer engagement.</p>
                </div>
                <div className="expo-kpi-grid">
                  <button onClick={() => window.alert('RFQ detail: 8 RFQs received, 3 pending response, 5 answered.')}>
                    <strong>8</strong><span>RFQ</span><small>3 pending response</small>
                    <em>Go to RFQ Center</em>
                  </button>
                  <button onClick={() => window.alert('Chat detail: 14 buyer chats, 4 unread, average response time 12 min.')}>
                    <strong>14</strong><span>Chats</span><small>4 unread messages</small>
                    <em>Go to Deal Room (Chat)</em>
                  </button>
                </div>
              </section>
            </div>
          </section>
        </main>
      </section>
      {visitorInviteOpen && <InviteVisitorModal onClose={() => setVisitorInviteOpen(false)} />}
    </div>
  )
}

function InviteVisitorModal({ onClose }: { onClose: () => void }) {
  const visitorExpoLink = `${window.location.origin}/tradexpo/select-booth-tier`
  const [externalEmails, setExternalEmails] = useState(['buyer@homedesign.vn', 'visitor@interiorstudio.com', 'sourcing@retailgroup.com'])
  const [emailDraft, setEmailDraft] = useState('')
  const [copied, setCopied] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [sentMessage, setSentMessage] = useState('')
  const copyInvitationLink = () => {
    navigator.clipboard?.writeText(visitorExpoLink)
    setCopied(true)
  }
  const addEmailText = (text: string) => {
    const nextEmails = text.split(/[\s,;]+/).map((email) => email.trim()).filter(Boolean)
    if (!nextEmails.length) return
    setExternalEmails((current) => [...current, ...nextEmails.filter((email) => !current.includes(email))])
    setEmailDraft('')
  }

  return (
    <div className="template-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="invite-modal" role="dialog" aria-modal="true" aria-label="Invite Visitor" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div className="invite-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" /></svg>
          </div>
          <div>
            <h2>Invite Visitor</h2>
            <p>Invite external visitors by email</p>
          </div>
          <button onClick={onClose} aria-label="Close">×</button>
        </header>

        <div className="invite-body">
          <div className="invite-switch">
            <button className="active">External</button>
          </div>

          <div className="external-invite-panel">
            <label>Email recipients</label>
            <div className="email-tag-input">
              {externalEmails.map((email) => <span key={email}>{email}<button onClick={() => setExternalEmails(externalEmails.filter((item) => item !== email))}>×</button></span>)}
              <input value={emailDraft} onChange={(event) => setEmailDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ',') { event.preventDefault(); addEmailText(emailDraft) } }} onPaste={(event) => { event.preventDefault(); addEmailText(event.clipboardData.getData('text')) }} placeholder="Paste visitor emails or type, then press Enter..." />
            </div>
            <p>External visitors will receive an invitation email with the expo detail link.</p>
            {previewOpen && (
              <div className="email-preview">
                <strong>Invitation Email Preview</strong>
                <p className="email-subject">Subject: Invitation to visit {furnitureExpoMock.name}</p>
                <div className="email-preview-card">
                  <h3>You're invited to visit {furnitureExpoMock.name}</h3>
                  <p>Hello, you are invited to explore Vietnam Furniture Expo 2026. Click the button below to view expo details, exhibitors, products, and live visitor engagement options.</p>
                  <button onClick={() => { window.location.href = visitorExpoLink }}>Join</button>
                </div>
                <p className="email-note">Note: Email template will be modified by Arobid based on Partner requirement.</p>
              </div>
            )}
            {sentMessage && <p className="send-confirmation">{sentMessage}</p>}
          </div>
        </div>

        <footer>
          <button className="copy-link" onClick={copyInvitationLink}>{copied ? '✓ Link Copied' : '🔗 Copy Invitation Link'}</button>
          <button onClick={() => setPreviewOpen(!previewOpen)}>{previewOpen ? 'Hide Email Preview' : 'Preview Invitation Email'}</button>
          <button className="batch-send-button" onClick={() => setSentMessage(`Mock sent: ${externalEmails.length} visitor invitation emails queued.`)}>Batch Send {externalEmails.length}</button>
          <button onClick={onClose}>Cancel</button>
        </footer>
      </section>
    </div>
  )
}

function UserWorkspaceSidebar({ onLogoClick }: { onLogoClick: () => void }) {
  return (
    <aside className="partner-sidebar user-workspace-sidebar">
      <button className="partner-brand logo-button" onClick={onLogoClick}><img className="arobid-logo" src="/arobid-logo-white.svg" alt="arobid.com" /></button>
      <div className="portal-label">User Workspace</div>
      <nav className="partner-nav">
        <div className="partner-nav-item"><span>▦</span>Dashboard</div>
        <PartnerNavGroup icon="◈" label="Seller Profile" items={['Company Profile', 'Business License', 'Verification']} />
        <PartnerNavGroup icon="▤" label="Product Management" items={['Goods Product', 'Service Product']} />
        <PartnerNavGroup icon="◎" label="Expo Management" items={['Expo Dashboard', 'Booth Config', 'Invitations']} activeItem="Booth Config" />
        <PartnerNavGroup icon="○" label="RFQs & Quotation" items={['RFQ Pool', 'Quotations', 'Deal Room']} />
        <div className="partner-nav-item"><span>◇</span>Notification</div>
      </nav>
      <div className="partner-profile">
        <span>AC</span>
        <div><strong>An Cuong Admin</strong><small>exhibitor@ancuong.com</small></div>
        <b>›</b>
      </div>
    </aside>
  )
}

function WorkspaceIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    color: <><circle cx="12" cy="12" r="8" /><path d="M12 4a8 8 0 0 1 0 16c2.5-2.4 2.5-13.6 0-16Z" /></>,
    image: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 16 5-5 4 4 2-2 7 6" /><circle cx="15.5" cy="9.5" r="1.5" /></>,
    product: <><path d="m3 8 9-5 9 5-9 5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></>,
    promotion: <><path d="M4 6h16v12H4z" /><path d="M8 10h8M8 14h5" /><path d="m16 18 3 3v-3" /></>,
    video: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="m10 9 5 3-5 3Z" /></>,
    preview: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="3" /></>,
    reset: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v6h6" /></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8M7 3v5h8" /></>,
    account: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.8-4.4 3.5-7 8-7s7.2 2.6 8 7" /></>,
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true">{icons[type]}</svg>
}

function FormField({ label, required, value, select, textarea }: { label: string; required?: boolean; value: string; select?: boolean; textarea?: boolean }) {
  const options = label === 'Timezone' ? ['Asia/Bangkok (+07:00)', 'Asia/Ho_Chi_Minh (+07:00)', 'Asia/Singapore (+08:00)'] : label === 'Category (Level 2)' ? ['Select categories', 'Furnitures', 'Home & Garden', 'Industrial Components', 'Food & Beverage', 'Business Services'] : label.includes('Owner') ? ['Search owner email...', ...mockPartnerEmails] : ['Select a template', 'Standard Expo Template', 'Premium Expo Template']
  return <label className={`form-field ${textarea ? 'textarea-field' : ''}`}><span>{label}{required && <b> *</b>}</span>{textarea ? <textarea defaultValue={value} /> : select ? <select defaultValue={value}>{options.map((option) => <option key={option}>{option}</option>)}</select> : <input defaultValue={value} />}</label>
}

function DateTimeField({ label, date, time }: { label: string; date: string; time: string }) {
  return <div className="date-time-field"><span className="form-label">{label}<b> *</b></span><div><input type="date" defaultValue={date} /><input type="time" defaultValue={time} /></div></div>
}

function ExhibitorInvitationEmail({ onLogoClick, onJoin }: { onLogoClick: () => void; onJoin: () => void }) {
  return <div className="exhibitor-email-page"><header><button className="role-brand logo-button" onClick={onLogoClick}><img className="arobid-logo" src="/arobid-logo.svg" alt="arobid.com" /><small>Exhibitor Role</small></button><span>Invitation Email</span></header><main><section className="email-shell"><div className="mail-meta"><span>From: Tenant Partner Admin &lt;{furnitureExpoMock.ownerEmail}&gt;</span><span>To: exhibitor@furniturebrand.com</span><span>Subject: Invitation to join {furnitureExpoMock.name}</span></div><article className="received-email"><img src={furnitureExpoMock.thumbnailUrl} alt="" /><div className="received-email-body"><p className="email-kicker">You are invited</p><h1>Join {furnitureExpoMock.name}</h1><p>Hello, Tenant Partner Admin invited your company to become an exhibitor at {furnitureExpoMock.name}. Complete the onboarding process to prepare your booth, products, and buyer engagement before the expo starts.</p><div className="email-info-grid"><div><b>Expo date</b><span>12 Oct 2026, 09:00 – 16 Oct 2026, 18:00</span></div><div><b>Category</b><span>{furnitureExpoMock.category}</span></div><div><b>Expo owner</b><span>{furnitureExpoMock.ownerEmail}</span></div></div><button onClick={onJoin}>Join</button><p className="email-note">Note: Email template will be modified by Arobid based on Partner requirement.</p></div></article></section></main></div>
}

function VisitorInvitationEmail({ onLogoClick, onJoin }: { onLogoClick: () => void; onJoin: () => void }) {
  return <div className="exhibitor-email-page"><header><button className="role-brand logo-button" onClick={onLogoClick}><img className="arobid-logo" src="/arobid-logo.svg" alt="arobid.com" /><small>Visitor Role</small></button><span>Visitor Invitation Email</span></header><main><section className="email-shell"><div className="mail-meta"><span>From: Tenant Partner Admin &lt;{furnitureExpoMock.ownerEmail}&gt;</span><span>To: visitor@homedesign.vn</span><span>Subject: Invitation to visit {furnitureExpoMock.name}</span></div><article className="received-email"><img src={furnitureExpoMock.thumbnailUrl} alt="" /><div className="received-email-body"><p className="email-kicker">You are invited</p><h1>Visit {furnitureExpoMock.name}</h1><p>Hello, Tenant Partner Admin invited you to explore {furnitureExpoMock.name}. Discover exhibitors, featured furniture products, and visit the 3D expo space when the event opens.</p><div className="email-info-grid"><div><b>Expo date</b><span>12 Oct 2026, 09:00 – 16 Oct 2026, 18:00</span></div><div><b>Category</b><span>{furnitureExpoMock.category}</span></div><div><b>Visitor access</b><span>Expo detail, exhibitor list, and 3D expo lobby</span></div></div><button onClick={onJoin}>Join</button><p className="email-note">Note: Email template will be modified by Arobid based on Partner requirement.</p></div></article></section></main></div>
}

function TradeXpoSelectBoothTier({ onLogoClick, onBookNow, autoScroll = true }: { onLogoClick: () => void; onBookNow: () => void; autoScroll?: boolean }) {
  const exhibitors = ['VICONS Materials', 'An Cuong Wood', 'Hoa Binh Construction', 'Viet Steel', 'Modern M&E', 'Green Glass', 'Smart Home VN', 'Bamboo Surface']
  const productImages = ['/tradexpo-product-1.png', '/tradexpo-product-2.png', '/tradexpo-product-3.png', '/tradexpo-product-4.png']
  const categories = [
    ['Surface & Interior Finishing', '/tradexpo-category-1.png'],
    ['Structural & Raw Materials', '/tradexpo-category-2.png'],
    ['Roofing & Ceiling Systems', '/tradexpo-category-3.png'],
    ['Sanitary Ware & Plumbing', '/tradexpo-category-4.png'],
    ['HVAC, Lifts & Building MEP', '/tradexpo-category-5.png'],
    ['Doors, Windows & Glass Systems', '/tradexpo-category-6.png'],
  ]
  const values = [
    ['/tradexpo-value-buyers.svg', 'Buyers (Visitors)', 'Direct access to verified supply sources from numerous reputable manufacturers.', 'Explore and evaluate products intuitively through advanced 3D/VR technology.', 'Connect directly and facilitate trade via integrated video conferencing tools.'],
    ['/tradexpo-value-sellers.svg', 'Sellers (Exhibitors)', 'Establish a professional digital presence with world-class virtual booths.', 'Engage with a vast network of potential global buyers and sourcing specialists.', 'Maximize cost-efficiency and operational agility compared to traditional models.'],
    ['/tradexpo-value-partners.svg', 'Partners', 'Enhance brand visibility among high-profile industry audiences and strategic leads.', 'Gain exclusive partnership benefits and high-level networking opportunities.', 'Access post-event data analytics and in-depth market intelligence reports.'],
  ]
  const boothBenefits = ['VIP Floor Area', '10 Display Products', '5 Advertising Banners', '4 Standees', 'Brand Placement: Full Media Suite', 'GoLive: Video, Chat & Webinar', 'Product Listings: Unlimited', 'Priority Featured Placement', 'Dedicated Account Manager']

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    if (!autoScroll) return undefined

    const startTimer = window.setTimeout(() => {
      const target = document.getElementById('tradexpo-3d-booths')
      if (!target) return

      const startY = window.scrollY
      const targetY = Math.max(target.getBoundingClientRect().top + window.scrollY - 84, 0)
      const distance = targetY - startY
      const duration = 5200
      const startedAt = performance.now()

      const easeInOutCubic = (progress: number) => (
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2
      )

      const animateScroll = (now: number) => {
        const elapsed = now - startedAt
        const progress = Math.min(elapsed / duration, 1)
        window.scrollTo(0, startY + distance * easeInOutCubic(progress))
        if (progress < 1) window.requestAnimationFrame(animateScroll)
      }

      window.requestAnimationFrame(animateScroll)
    }, 3000)

    return () => window.clearTimeout(startTimer)
  }, [autoScroll])

  return (
    <div className="tradexpo-page">
      <TradeXpoHeader onLogoClick={onLogoClick} />

      <main>
        <div className="tradexpo-breadcrumb"><HomeIcon /> <span>›</span> <strong>Expo Detail</strong></div>

        <section className="tradexpo-hero">
          <div className="tradexpo-hero-inner">
            <span className="tradexpo-badge">Global Strategic Network</span>
            <h1>Vietnam International Furniture Manufacturing &amp; Wood Expo (VIFMW) #1</h1>
            <div className="tradexpo-hero-buttons">
              <button onClick={() => window.open(furnitureExpoMock.templateViewerUrl, '_blank', 'noopener,noreferrer')}><VideoCircleIcon /> Virtual Lobby</button>
              <button className="hero-secondary">Join as Exhibitor</button>
            </div>
            <div className="tradexpo-stats">
              <div><strong>320+</strong><span>Exhibitors</span></div>
              <div><strong>25K</strong><span>Visitors</span></div>
              <div><strong>1000+</strong><span>Products</span></div>
              <div><strong>80</strong><span>RFQs</span></div>
            </div>
            <aside className="tradexpo-countdown">
              <div><span className="tradexpo-live-pill">Live</span> Event ends in</div>
              <section><b>12<small>Days</small></b><i>:</i><b>03<small>Hours</small></b><i>:</i><b>24<small>Min</small></b><i>:</i><b>00<small>Sec</small></b></section>
              <footer><p><span>Start</span>04/15/2026</p><em>→</em><p><span>End</span>04/17/2026</p></footer>
            </aside>
          </div>
        </section>

        <section className="tradexpo-about tradexpo-section">
          <h2>About VICONS</h2>
          <div>
            <p>At the 1st Vietnam International Construction &amp; Building Materials Expo, businesses can demonstrate large-scale production capacity and compliance with rigorous technical standards such as ISO 9001, CE, ASTM, JIS, LEED, and BREEAM. Through interactive 3D/VR models, suppliers can showcase Structural Steel, Raw Materials, Finishing Materials, and modern M&amp;E systems.</p>
            <button>View more<ChevronDownIcon /></button>
          </div>
        </section>

        <section className="tradexpo-sponsors">
          <div><span>Get sponsored by companies such as:</span><strong>Google</strong><strong>Microsoft</strong><strong>Dropbox</strong><strong>OpenAI</strong><strong>Claude</strong><strong>HubSpot</strong></div>
        </section>

        <section className="tradexpo-exhibitors">
          <div className="tradexpo-section-title">
            <h2>Exhibitors</h2>
            <div><input aria-label="Search exhibitor" placeholder="Search by exhibitor name..." /><button>All category<ChevronDownIcon /></button><button>Join as Exhibitor</button></div>
          </div>
          <div className="tradexpo-exhibitor-grid">
            {exhibitors.map((name, index) => (
              <article key={name} className="tradexpo-exhibitor-card">
                <div className="exhibitor-card-top">
                  <img src="/tradexpo-company-logo.png" alt="" />
                  <div>
                    <h3>This is company name</h3>
                  </div>
                  <button aria-label={`Save ${name}`}>♥</button>
                </div>
                <div className="exhibitor-meta-row">
                  <span className="flag">🇻🇳 Vietnam</span><i>·</i><span className="verified">VERIFIED</span><i>·</i><span className="membership pioneer">🚀 Pioneer</span><i>·</i><span className="membership diamond">💎 Diamond</span><i>·</i><span>⭐ 5.0</span><i>·</i><span>20 years</span>
                </div>
                <div className="exhibitor-trust-row">
                  <span className="sb">S&amp;P Global Ratings</span><span className="aaa">AAA</span><i>·</i><span className="duns">D-U-N-S® <b>123456789</b></span>
                </div>
                <div className="exhibitor-tags"><span>ODM</span><span>OEM</span><span>ISO 9001:2015</span><span>OBM</span><span>+3</span></div>
                <div className="exhibitor-products">
                  <p>Featured products <a>View More ›</a></p>
                  <div>{productImages.map((image) => <img key={`${index}-${image}`} src={image} alt="" />)}</div>
                </div>
                <footer><button><ChatIcon /> Chat Now</button><button>Send RFQ</button></footer>
              </article>
            ))}
          </div>
          <button className="tradexpo-loadmore">Load more</button>
        </section>

        <section className="tradexpo-attend">
          <h2>Who Should <span>Attend?</span></h2>
          <div>
            <article><em>01</em><div className="attend-copy"><h3>The Buyers</h3><p>Real estate developers, main contractors, and architects seeking high-performance materials and infrastructure solutions.</p><footer><span>Developers</span><span>Contractors</span><span>Architects</span></footer></div></article>
            <article><em>02</em><div className="attend-copy"><h3>The Suppliers</h3><p>Material manufacturers and tech providers digitizing their portfolios to reach 12,000+ high-intent buyers globally.</p><footer><span>Manufacturers</span><span>Exporters</span><span>Materials</span></footer></div></article>
            <article><em>03</em><div className="attend-copy"><h3>The Partners</h3><p>Trade associations, logistics, and Green Building councils facilitate seamless global construction supply chains.</p><footer><span>Associations</span><span>Logistics</span><span>Greenbuilding</span></footer></div></article>
          </div>
        </section>

        <section className="tradexpo-categories">
          <h2>Exhibited Categories</h2>
          <p>Navigating the complete spectrum of construction materials and architectural solutions.</p>
          <div>{categories.map(([category, image]) => <article key={category}><img src={image} alt="" /><span>{category}</span></article>)}</div>
        </section>

        <section className="tradexpo-values">
          <h2>Exclusive Values for Each Participant</h2>
          <p>Specialized digital solutions to maximize trade efficiency and technical connectivity for all participants.</p>
          <div>{values.map(([icon, title, ...items], index) => <article key={title} className={`tradexpo-value-${index}`}><span><img src={icon} alt="" /></span><h3>{title}</h3><ul>{items.map((item) => <li key={item}>✓ {item}</li>)}</ul></article>)}</div>
        </section>

        <section className="tradexpo-booths" id="tradexpo-3d-booths">
          <h2>Type of 3D Booths</h2>
          <p>Choose a professional exhibition space tailored to your business scale.</p>
          <div className="tradexpo-tabs"><button>Basic</button><button>Professional</button><button className="active">Premium</button></div>
          <div className="tradexpo-booth-content">
            <div>
              <h3>Premium Booth</h3>
              <p>Ultimate exhibition experience with maximum visibility and advanced features for enterprise-level presence.</p>
              <strong>Contact for Pricing</strong>
              <ul>{boothBenefits.map((benefit) => <li key={benefit}>✓ {benefit}</li>)}</ul>
              <div className="tradexpo-booth-actions"><button>Explore Exhibitions</button><button onClick={onBookNow}>Book Now</button></div>
            </div>
            <figure><h4>Premium</h4><img src="/tradexpo-premium-booth.png" alt="Premium 3D booth" /><span>⌗</span></figure>
          </div>
          <div className="tradexpo-road-banner"><h3>Your road to big deals starts at the 2026 Expos.</h3><button>Register Booth Lite</button></div>
        </section>
      </main>

      <TradeXpoFooter />
    </div>
  )
}

function TradeXpoHeader({ onLogoClick }: { onLogoClick: () => void }) {
  return (
    <header className="tradexpo-header">
      <button className="tradexpo-logo" onClick={onLogoClick} aria-label="Back to role selection">
        <img src="/arobid-logo.svg" alt="arobid.com" />
        <small>TradeXpo</small>
      </button>
      <nav>
        <a>Virtual Shows</a><a>Pricing</a><a>Ecosystem</a>
      </nav>
      <div className="tradexpo-header-actions">
        <button className="tradexpo-marketplace-button" type="button" aria-label="B2B Marketplace">
          <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M3.25 7.15h11.5M4 7.15l.75-3.4h8.5l.75 3.4M5 7.15v7.1h8v-7.1M7.1 14.25v-3.4h3.8v3.4" /></svg>
          <span>B2B Marketplace</span>
        </button>
        <button className="tradexpo-language-button" type="button" aria-label="Language and currency">
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.25" /><path d="M2.75 10h14.5M10 2.75c2 2.04 3 4.45 3 7.25s-1 5.21-3 7.25M10 2.75c-2 2.04-3 4.45-3 7.25s1 5.21 3 7.25" /></svg>
          <span>VI - VND</span><ChevronDownIcon />
        </button>
        <button className="tradexpo-account" type="button" aria-label="Account">
          <img src="/tradexpo-avatar.png" alt="" /><span>Khải Nguyễn</span><ChevronDownIcon />
        </button>
        <button className="tradexpo-noti" type="button" aria-label="Notifications">
          <NotificationBellIcon />
        </button>
      </div>
    </header>
  )
}

function ChevronDownIcon() {
  return (
    <svg className="tradexpo-caret-icon" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9.49728 0.747275L5.12227 5.12227C5.08164 5.16295 5.03339 5.19522 4.98028 5.21724C4.92717 5.23926 4.87024 5.25059 4.81274 5.25059C4.75525 5.25059 4.69832 5.23926 4.64521 5.21724C4.5921 5.19522 4.54384 5.16295 4.50321 5.12227L0.128212 0.747275C0.0461192 0.665182 0 0.55384 0 0.437743C0 0.321647 0.0461192 0.210305 0.128212 0.128212C0.210305 0.046119 0.321647 0 0.437743 0C0.55384 0 0.665182 0.046119 0.747275 0.128212L4.81274 4.19423L8.87821 0.128212C8.91886 0.0875636 8.96712 0.0553197 9.02023 0.033321C9.07334 0.0113224 9.13026 0 9.18774 0C9.24523 0 9.30215 0.0113224 9.35526 0.033321C9.40837 0.0553197 9.45663 0.0875636 9.49728 0.128212C9.53792 0.16886 9.57017 0.217117 9.59216 0.270226C9.61416 0.323336 9.62549 0.380258 9.62549 0.437743C9.62549 0.495228 9.61416 0.552151 9.59216 0.60526C9.57017 0.65837 9.53792 0.706626 9.49728 0.747275Z" fill="#6B7280" />
    </svg>
  )
}

function NotificationBellIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M19 4.5C29.2173 4.5 37.5 12.7827 37.5 23C37.5 33.2173 29.2173 41.5 19 41.5C8.78273 41.5 0.5 33.2173 0.5 23C0.5 12.7827 8.78273 4.5 19 4.5Z" fill="white" />
      <path d="M19 4.5C29.2173 4.5 37.5 12.7827 37.5 23C37.5 33.2173 29.2173 41.5 19 41.5C8.78273 41.5 0.5 33.2173 0.5 23C0.5 12.7827 8.78273 4.5 19 4.5Z" stroke="#E5E7EB" />
      <path d="M25.5945 26.3708C25.2043 25.6986 24.6242 23.7966 24.6242 21.3125C24.6242 19.8207 24.0316 18.3899 22.9767 17.335C21.9218 16.2801 20.491 15.6875 18.9992 15.6875C17.5073 15.6875 16.0766 16.2801 15.0217 17.335C13.9668 18.3899 13.3742 19.8207 13.3742 21.3125C13.3742 23.7973 12.7934 25.6986 12.4032 26.3708C12.3035 26.5417 12.2507 26.7358 12.25 26.9336C12.2493 27.1315 12.3008 27.326 12.3993 27.4975C12.4978 27.6691 12.6398 27.8117 12.8109 27.9109C12.9821 28.0101 13.1764 28.0624 13.3742 28.0625H16.2436C16.3734 28.6975 16.7185 29.2683 17.2207 29.6781C17.7228 30.088 18.351 30.3119 18.9992 30.3119C19.6473 30.3119 20.2756 30.088 20.7777 29.6781C21.2798 29.2683 21.625 28.6975 21.7547 28.0625H24.6242C24.8219 28.0622 25.0161 28.0098 25.1872 27.9106C25.3583 27.8114 25.5001 27.6688 25.5985 27.4972C25.6969 27.3257 25.7484 27.1312 25.7477 26.9335C25.747 26.7357 25.6941 26.5416 25.5945 26.3708ZM18.9992 29.1875C18.6503 29.1874 18.31 29.0792 18.0252 28.8777C17.7404 28.6762 17.525 28.3914 17.4087 28.0625H20.5897C20.4734 28.3914 20.258 28.6762 19.9732 28.8777C19.6883 29.0792 19.3481 29.1874 18.9992 29.1875ZM13.3742 26.9375C13.9156 26.0066 14.4992 23.8494 14.4992 21.3125C14.4992 20.119 14.9733 18.9744 15.8172 18.1305C16.6611 17.2866 17.8057 16.8125 18.9992 16.8125C20.1927 16.8125 21.3373 17.2866 22.1812 18.1305C23.0251 18.9744 23.4992 20.119 23.4992 21.3125C23.4992 23.8473 24.0814 26.0045 24.6242 26.9375H13.3742Z" fill="#6B7280" />
      <path d="M28 0.5H34C38.1421 0.5 41.5 3.85786 41.5 8C41.5 12.1421 38.1421 15.5 34 15.5H28C23.8579 15.5 20.5 12.1421 20.5 8C20.5 3.85786 23.8579 0.5 28 0.5Z" fill="#DC2626" />
      <path d="M28 0.5H34C38.1421 0.5 41.5 3.85786 41.5 8C41.5 12.1421 38.1421 15.5 34 15.5H28C23.8579 15.5 20.5 12.1421 20.5 8C20.5 3.85786 23.8579 0.5 28 0.5Z" stroke="white" />
      <path d="M29.4082 4.72461V12H28.3242V5.82812H28.2754L26.5469 6.96582V5.91113L28.3535 4.72461H29.4082ZM30.4824 12V11.209L32.9434 8.65039C33.2038 8.37695 33.4186 8.13607 33.5879 7.92773C33.7604 7.71615 33.889 7.51595 33.9736 7.32715C34.0615 7.13835 34.1055 6.93815 34.1055 6.72656C34.1055 6.48242 34.0485 6.27246 33.9346 6.09668C33.8206 5.9209 33.666 5.78581 33.4707 5.69141C33.2754 5.59701 33.054 5.5498 32.8066 5.5498C32.5462 5.5498 32.32 5.60352 32.1279 5.71094C31.9359 5.8151 31.7861 5.96484 31.6787 6.16016C31.5745 6.35221 31.5225 6.57845 31.5225 6.83887H30.4775C30.4775 6.39616 30.5785 6.00879 30.7803 5.67676C30.9854 5.34473 31.2653 5.08757 31.6201 4.90527C31.9782 4.71973 32.3818 4.62695 32.8311 4.62695C33.29 4.62695 33.6937 4.7181 34.042 4.90039C34.3903 5.08268 34.6621 5.33008 34.8574 5.64258C35.0527 5.95182 35.1504 6.30176 35.1504 6.69238C35.1504 6.96257 35.0999 7.22624 34.999 7.4834C34.9014 7.74056 34.7272 8.02865 34.4766 8.34766C34.2292 8.66341 33.8841 9.04427 33.4414 9.49023L31.9961 11.0039V11.0625H35.2676V12H30.4824Z" fill="white" />
    </svg>
  )
}

function HomeIcon() {
  return <svg className="tx-inline-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 9.25 10 3l7 6.25M5 8.5v8h10v-8M8 16v-4h4v4" /></svg>
}

function VideoCircleIcon() {
  return <svg className="tx-inline-icon" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5" /><path d="m8 7 5 3-5 3V7Z" /></svg>
}

function ChatIcon() {
  return <svg className="tx-inline-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 5.5h12v8H8l-4 3v-11Z" /></svg>
}

function SearchIcon() {
  return <svg className="tx-inline-icon" viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="5.25" /><path d="m13 13 3.5 3.5" /></svg>
}

function MinusCircleIcon() {
  return <svg className="tx-inline-icon" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7" /><path d="M6.5 10h7" /></svg>
}

function BoothIcon() {
  return <svg className="tx-inline-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 5h12v10H4V5Z" /><path d="M7 5v10M13 5v10M4 9h12" /></svg>
}

function CalendarIcon() {
  return <svg className="tx-inline-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 4.5h10a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 15 16.5H5A1.5 1.5 0 0 1 3.5 15V6A1.5 1.5 0 0 1 5 4.5Z" /><path d="M7 3v3M13 3v3M3.5 8h13" /></svg>
}

function TradeXpoFooter() {
  const columns = [
    ['Get to know us', 'About Arobid', 'Newsroom', 'Careers'],
    ['Business Services', 'SmartCapital'],
    ['Source from Arobid', 'Request for Quote', 'Sourcing Knowledge Center'],
    ['Sell on Arobid.com', 'Start Selling on Arobid', 'Seller Central Login', 'Membership Program'],
    ['Get support', 'Help Center', 'Contact us'],
  ]

  return (
    <footer className="tradexpo-footer">
      <div className="tradexpo-footer-divider" />
      <div className="tradexpo-footer-content">
        <div className="tradexpo-footer-columns">
          {columns.map(([title, ...items]) => (
            <section key={title}>
              <h3>{title}</h3>
              {items.map((item) => <p key={item}>{item}</p>)}
            </section>
          ))}
        </div>

        <div className="tradexpo-footer-icons">
          <div className="tradexpo-footer-icon-group">
            <b>Follow us</b>
            <img src="/tradexpo-social-facebook.png" alt="Facebook" />
            <img src="/tradexpo-social-zalo.png" alt="Zalo" />
            <img src="/tradexpo-social-youtube.png" alt="YouTube" />
            <img src="/tradexpo-social-linkedin.png" alt="LinkedIn" />
          </div>
          <div className="tradexpo-footer-icon-group">
            <b>Certificated by</b>
            <img className="tradexpo-certified" src="/tradexpo-certified.png" alt="Registered with Ministry of Industry and Trade" />
          </div>
          <div className="tradexpo-footer-icon-group">
            <b>Payment</b>
            <span className="tradexpo-payment">
              <img src="/tradexpo-payment-vnpay-left.svg" alt="" />
              <img src="/tradexpo-payment-vnpay-right.svg" alt="VNPAY" />
            </span>
          </div>
        </div>

        <div className="tradexpo-footer-divider" />
        <p className="tradexpo-footer-legal">
          B2B Marketplace | TradeXpo | Goods for Good | AroUni<br />
          Policies and rules: Policy | Legal notice | Terms &amp; conditions | Categories Sitemap<br />
          © 2026 • Arobid Technology Joint Stock Company - Certificate number: 0318608079 - Address: 2nd floor, 799 Nguyen Van Linh, Tan My Ward, Ho Chi Minh City, Vietnam - Email: support@arobid.com
        </p>
      </div>
    </footer>
  )
}

function TradeXpoQuickSignUp({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [name, setName] = useState('Khải Duy')
  const [email, setEmail] = useState('khainguyend@arobid.com')

  return (
    <div className="quick-signup-overlay" role="dialog" aria-modal="true">
      <div className="quick-signup-main">
        <section className="quick-signup-card" aria-label="Quick sign up">
          <header>
            <div>
              <h1>Quick Sign Up</h1>
              <p>Join Arobid to connect, streamline, and grow.</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close quick signup"><img src="/quick-signup-close.svg" alt="" /></button>
          </header>
          <form onSubmit={(event) => { event.preventDefault(); onSubmit() }}>
            <label>
              <strong>Name <b>*</b></strong>
              <span><img src="/quick-signup-person.svg" alt="" /><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" required /></span>
            </label>
            <label>
              <strong>Email Address <b>*</b></strong>
              <span><img src="/quick-signup-mail.svg" alt="" /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" required /></span>
            </label>
            <button type="submit">Quick Sign Up</button>
            <p>Already have an Arobid account? <button type="button" onClick={() => window.alert('Mock action: sign in.')}>Sign in</button></p>
          </form>
        </section>
      </div>
    </div>
  )
}

function TradeXpoPaymentSuccess({ onLogoClick, onBackToExpo, onCustomizeBooth }: { onLogoClick: () => void; onBackToExpo: () => void; onCustomizeBooth: () => void }) {
  return (
    <div className="tradexpo-payment-page">
      <TradeXpoHeader onLogoClick={onLogoClick} />

      <main className="payment-success-main">
        <section className="payment-success-shell">
          <div className="payment-success-hero">
            <div className="payment-success-icon"><img src="/tradexpo-checkmark-starburst.svg" alt="" /></div>
            <h1>Booking Confirmed!</h1>
            <p>Your booth has been successfully reserved.</p>
          </div>

          <article className="booking-confirmation-card">
            <div className="booking-id-row">
              <h2><span>ID</span> #BOOTH02112004</h2>
              <p>Date: 05/20/2026</p>
            </div>

            <div className="booking-detail-card">
              <div className="booking-expo-row">
                <img src="/tradexpo-payment-success-thumb.png" alt="Selected booth" />
                <div>
                  <span className="booking-tier-badge"><img src="/tradexpo-flash-sparkle.svg" alt="" />Professional</span>
                  <h3>Vietnam International Furniture Manufacturing &amp; Wood Expo (VIFMW) #1</h3>
                </div>
              </div>

              <div className="booking-meta-grid">
                <div><small>START DATE</small><b>05/25/2026</b></div>
                <div><small>END DATE</small><b>05/27/2026</b></div>
                <div><small>HALL</small><b>B</b></div>
                <div><small>BOOTH</small><b>18</b></div>
              </div>

              <div className="booking-price-box">
                <p><span>Booth Price</span><b>VND 35.000.000</b></p>
                <p className="discount"><span>Discount (20%)</span><b>- VND 7.000.000</b></p>
                <strong><span>Total Paid</span><b>VND 28.000.000</b></strong>
              </div>
            </div>

            <div className="booking-email-note">
              <img src="/tradexpo-mail.svg" alt="" />
              <p>A confirmation email will send to <b>nadirconstruction@company.com</b></p>
            </div>
          </article>

          <div className="payment-success-actions">
            <button onClick={onBackToExpo}>Back to Expo</button>
            <button onClick={onCustomizeBooth}>Customize Your Booth</button>
          </div>
        </section>
      </main>

      <TradeXpoFooter />
    </div>
  )
}

function TradeXpoSelectPosition({ onLogoClick, onBack, onPaymentSuccess }: { onLogoClick: () => void; onBack: () => void; onPaymentSuccess: () => void }) {
  const [selected, setSelected] = useState(false)
  const [hall, setHall] = useState('B')
  const [voucher, setVoucher] = useState('')
  const [voucherError, setVoucherError] = useState(false)
  const [tradeCreditEnabled, setTradeCreditEnabled] = useState(false)
  const [benefitsOpen, setBenefitsOpen] = useState(false)
  const [quickSignupOpen, setQuickSignupOpen] = useState(false)
  const boothBenefits = ['300% Standard Floor Area', '16 Display Products', '25 Advertising Banners', '1 Video Screens (20s)', '2 Standees', 'Brand Placement: 3D', 'GoLive: Video & Chat', 'Product Listing: 50']

  const applyVoucher = () => setVoucherError(Boolean(voucher.trim()))

  return (
    <div className="tradexpo-position-page">
      <TradeXpoHeader onLogoClick={onLogoClick} />

      <main className="booth-select-main">
        <div className="booth-breadcrumb"><button onClick={onBack} aria-label="Back to expo detail"><HomeIcon /></button><span>›</span><button onClick={onBack}>Expo Detail</button><span>›</span><strong>Booth Selection</strong></div>

        <section className="booth-select-content">
          <div className={`booth-map-card ${selected ? 'is-selected' : ''}`} onClick={() => setSelected(true)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelected(true) }} aria-label="Select a booth from the map">
            <div className="booth-zoom"><button aria-label="Zoom in"><SearchIcon /></button><button aria-label="Zoom out"><MinusCircleIcon /></button></div>
            <img src={selected ? '/tradexpo-booth-map-selected.png' : '/tradexpo-booth-map-unselected.png'} alt="3D booth map" />
            <div className="booth-hall-tabs">
              {['A', 'B', 'C', 'D'].map((name) => <button key={name} className={hall === name ? 'active' : ''} onClick={() => setHall(name)}>Hall {name}</button>)}
            </div>
          </div>

          <aside className={`booth-order-card ${selected ? 'selected' : ''}`}>
            <h1>Order Summary</h1>
            {!selected ? (
              <div className="empty-booth">
                <span><BoothIcon /></span>
                <h2>No Booth Selected</h2>
                <p>Select an available booth on the map to see details and pricing</p>
              </div>
            ) : (
              <>
                <div className="selected-expo-row">
                  <img src="/tradexpo-summary-thumb.png" alt="" />
                  <div>
                    <span>⚡ Professional</span>
                    <h2>Vietnam International Furniture Manufacturing &amp; Wood Expo (VIFMW) #1</h2>
                    <p><CalendarIcon /> 05/25/2026 - 05/27/2026</p>
                  </div>
                </div>
                <div className="booth-meta">
                  <div><small>HALL</small><b>{hall}</b></div>
                  <div><small>BOOTH</small><b>18</b></div>
                  <button onClick={() => setBenefitsOpen(true)}>Booth benefits</button>
                </div>
                <div className="voucher-block">
                  <label>E-voucher</label>
                  <div><input value={voucher} onChange={(event) => { setVoucher(event.target.value); setVoucherError(false) }} placeholder="Enter voucher code" /><button onClick={applyVoucher}>Apply</button></div>
                  {voucherError && <p>This voucher cannot be used for this item</p>}
                </div>
                <div className="tradecredit-row">
                  <span>₮</span>
                  <div><b>VND 150 Off</b><small>Applied with your 3 TradeCredit</small></div>
                  <button className={tradeCreditEnabled ? 'on' : ''} onClick={() => setTradeCreditEnabled((value) => !value)} aria-label="Toggle TradeCredit"><i /></button>
                </div>
                <div className="price-box">
                  <p><span>Booth Price</span><b>VND 35.000.000</b></p>
                  <p><span>Discount</span><b>{tradeCreditEnabled ? 'VND 150' : '-'}</b></p>
                  <p><span>Total Amount</span><strong>{tradeCreditEnabled ? 'VND 34.999.850' : 'VND 35.000.000'}</strong></p>
                </div>
                <button className="payment-button" onClick={() => setQuickSignupOpen(true)}>Proceed to Payment</button>
                <p className="terms-line">By clicking, I read &amp; accept with <u>Terms and Conditions</u></p>
              </>
            )}
          </aside>
        </section>
      </main>

      <TradeXpoFooter />

      {benefitsOpen && (
        <div className="booth-benefits-overlay" role="dialog" aria-modal="true">
          <section className="booth-benefits-modal">
            <header><h2>Virtual Booth Solutions</h2><button onClick={() => setBenefitsOpen(false)} aria-label="Close">×</button></header>
            <div className="benefit-modal-body">
              <figure><img src="/tradexpo-summary-thumb.png" alt="" /><span>3D</span></figure>
              <h3>Premium</h3>
              <p>The ultimate choice for industry leaders aiming to become the exhibition's centerpiece while asserting global prestige.</p>
              <strong>VND 35.000.000</strong>
              <ul>{boothBenefits.map((benefit) => <li key={benefit}>✓ {benefit}</li>)}</ul>
            </div>
          </section>
        </div>
      )}
      {quickSignupOpen && (
        <TradeXpoQuickSignUp onClose={() => setQuickSignupOpen(false)} onSubmit={onPaymentSuccess} />
      )}
    </div>
  )
}

function ExhibitorLoginReference({ onLogoClick, onCreateAccount }: { onLogoClick: () => void; onCreateAccount: () => void }) {
  const benefits = ['Global Market Access', 'Verified & Trusted Network', 'Intelligent AI Matching', 'Secure Trade Assurance', 'Instant Digital Onboarding', '24/7 Virtual TradeXpos']

  return (
    <div className="login-reference-page">
      <header className="login-reference-topbar">
        <button className="login-reference-brand" onClick={onLogoClick} aria-label="Back to role selection">
          <img className="arobid-logo" src="/arobid-logo.svg" alt="arobid.com" />
        </button>
        <div className="login-reference-title">Create Account</div>
      </header>

      <main className="login-reference-hero">
        <section className="login-reference-copy">
          <h1>Go global with 50,000+ trusted partners</h1>
          <p>Buyers secure competitive pricing and trusted partners through AI-backed sourcing while suppliers scale their global footprint and reach millions of qualified leads through automated AI tools.</p>
          <ul>
            {benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
          </ul>
        </section>

        <section className="login-card" aria-label="Create Arobid account form">
          <h2>Create Your <span>Arobid Account</span></h2>
          <p>Begin your efficient B2B journey. Join Arobid to connect, streamline, and grow.</p>
          <div className="login-divider" />

          <div className="login-form-grid">
            <label>First Name (*)<input defaultValue="Khải" /></label>
            <label>Last Name<input defaultValue="Duy" /></label>
          </div>
          <label>Email Address (*)<input defaultValue="khainguyend@arobid.com" /></label>
          <label>Password (*)<div className="password-field"><input type="password" defaultValue="Bowker@202211" /><button type="button" aria-label="Show password"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="3" /></svg></button></div></label>
          <div className="password-strength"><span /><span /><span /><i>ⓘ</i></div>
          <label>Confirm Password (*)<div className="password-field"><input type="password" placeholder="Re-enter your password" /><button type="button" aria-label="Show confirm password"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="3" /></svg></button></div></label>

          <p className="login-agreement">By signing up, I agree to Arobid's <a>Terms of Service</a> and <a>Privacy Policy</a>.</p>
          <button className="login-create-button" type="button" onClick={onCreateAccount}>Create Arobid Account</button>
          <p className="login-signin">Already have an Arobid account? <a>Sign In</a></p>
        </section>
      </main>
    </div>
  )
}

function ExhibitorAiOnboardingEntry({ onLogoClick, onStartScan }: { onLogoClick: () => void; onStartScan: () => void }) {
  const [expandedOption, setExpandedOption] = useState<string | null>(null)
  const [businessWebsite, setBusinessWebsite] = useState('https://ancuong.com/')
  const [isScanning, setIsScanning] = useState(false)
  const startAiScan = () => {
    setIsScanning(true)
    window.setTimeout(() => onStartScan(), 2000)
  }
  const options = [
    {
      title: 'AroAI Onboarding',
      description: 'Instantly sync and populate your profile by leveraging AI to crawl your existing company website.',
      badge: 'Recommended',
      tone: 'orange',
      icon: <><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /><path d="M20 2v4M22 4h-4" /><circle cx="4" cy="20" r="2" /></>,
    },
    {
      title: 'AI Business License Analysis',
      description: 'Build immediate credibility by automatically extracting verified data from your official Business License.',
      badge: 'Highest Trust',
      tone: 'blue',
      icon: <><path d="M16.247 7.761a6 6 0 0 1 0 8.478" /><path d="M19.075 4.933a10 10 0 0 1 0 14.134" /><path d="M4.925 19.067a10 10 0 0 1 0-14.134" /><path d="M7.753 16.239a6 6 0 0 1 0-8.478" /><circle cx="12" cy="12" r="2" /></>,
    },
    {
      title: 'Manual Entry',
      description: 'Manually enter your business information to build your profile at your own pace.',
      badge: 'Detailed Control',
      tone: 'soft-blue',
      icon: <><path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" /><path d="m7 16.5-4.74-2.85M7 16.5l5-3M7 16.5v5.17" /><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" /><path d="m17 16.5-5-3M17 16.5l4.74-2.85M17 16.5v5.17" /><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" /><path d="M12 8 7.26 5.15M12 8l4.74-2.85M12 13.5V8" /></>,
    },
  ]

  return (
    <div className="ai-onboarding-page">
      <header className="ai-onboarding-topbar">
        <button className="ai-onboarding-brand" onClick={onLogoClick} aria-label="Back to role selection">
          <img src="/arobid-logo.svg" alt="arobid.com" />
        </button>
        <h1>Onboarding</h1>
        <button className="ai-language-button" onClick={() => window.alert('Mock action: language/currency selector.')}>
          <span>◉</span> EN - VND <b>⌄</b>
        </button>
      </header>

      <main className="ai-onboarding-hero">
        <section className="ai-onboarding-copy">
          <h2>Complete Your Seller Profile: Fast, Secure, and Efficient</h2>
          <p>Choose the method that best suits your business to quickly get verified and unlock global trade opportunities on Arobid's trusted digital infrastructure.</p>
          <ul>
            <li><span>◷</span> Industry-leading security protocols ensure your data is safe.</li>
            <li><span>✓</span> Average completion time: 2 minutes.</li>
          </ul>
        </section>

        <section className="activation-panel">
          <div className="activation-heading">
            <h2>Choose How You'd Like to <span>Activate Your Profile</span></h2>
            <p>Select the method below that best fits your needs to quickly activate your seller profile and begin trading.</p>
          </div>
          <div className="activation-options">
            {options.map((option) => (
              <article key={option.title} className={`activation-option-card ${option.tone} ${expandedOption === option.title ? 'expanded' : ''}`}>
                <button className="activation-option" onClick={() => option.title === 'AroAI Onboarding' ? setExpandedOption(expandedOption === option.title ? null : option.title) : window.alert(`Mock action: selected ${option.title}.`)}>
                  <span className="activation-icon"><svg viewBox="0 0 24 24" aria-hidden="true">{option.icon}</svg></span>
                  <span className="activation-copy"><strong>{option.title}</strong><small>{option.description}</small></span>
                  <em>{option.badge}</em>
                </button>
                {option.title === 'AroAI Onboarding' && expandedOption === option.title && (
                  <form className="aroai-url-form" onSubmit={(event) => { event.preventDefault(); startAiScan() }}>
                    <label>Business Website <b>*</b><input value={businessWebsite} onChange={(event) => setBusinessWebsite(event.target.value)} placeholder="https://..." required /></label>
                    <button type="submit" disabled={isScanning}>{isScanning ? 'AI Extracting...' : 'Start Scan & Create Profile'} <span>→</span></button>
                    <p>Don’t have a website? <button type="button" onClick={() => window.alert('Mock action: switch to Manual Entry.')}>Register manually</button></p>
                  </form>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
      {isScanning && (
        <div className="ai-scan-overlay" role="status" aria-live="polite">
          <div className="ai-scan-card">
            <div className="ai-scan-spinner" />
            <h2>AI extracting company profile</h2>
            <p>Scanning {businessWebsite} and preparing your business information...</p>
          </div>
        </div>
      )}
    </div>
  )
}

function ExhibitorGeneralInfoPage({ onLogoClick, onBack, onSubmit }: { onLogoClick: () => void; onBack: () => void; onSubmit: () => void }) {
  // Open the public profile in a new tab WITHOUT switching to it. Simulating a
  // Ctrl/Cmd+click on a real anchor is the most reliable cross-browser way to
  // get a background tab (plain window.open foregrounds the new tab).
  const previewProfileInBackground = () => {
    const a = document.createElement('a')
    a.href = 'https://arobid.com/en/supplier/019e4e0b-ba2d-77dc-8689-2fed495ef9a4'
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.dispatchEvent(new MouseEvent('click', { ctrlKey: true, metaKey: true, bubbles: true, cancelable: true }))
  }
  return (
    <div className="general-info-page">
      <header className="general-info-topbar">
        <button className="general-info-brand" onClick={onLogoClick} aria-label="Back to role selection"><img src="/arobid-logo.svg" alt="arobid.com" /></button>
        <h1>Create Account</h1>
        <button className="general-language-button" onClick={() => window.alert('Mock action: language/currency selector.')}><span>★</span> EN - USD</button>
      </header>
      <main className="general-info-main">
        <button className="return-link" onClick={onBack}>← Return to Supplier Request</button>
        <form className="general-info-form" onSubmit={(event) => { event.preventDefault(); onSubmit() }}>
          <h2>General Info</h2>
          <label className="full">Business Name <b>*</b><input defaultValue="Công ty Cổ phần Gỗ An Cường" /></label>
          <div className="general-info-grid">
            <label>Business Type <b>*</b><select defaultValue="Distributor and Manufacturer"><option>Distributor and Manufacturer</option><option>Manufacturer</option><option>Distributor</option><option>Exporter</option></select></label>
            <label>Country <b>*</b><select defaultValue="Viet Nam"><option>Viet Nam</option><option>Singapore</option><option>Thailand</option><option>United States</option></select></label>
            <label>TaxID <b>*</b><input placeholder="Enter your TaxID" /></label>
            <label>Phone Number <b>*</b><input placeholder="Enter your phone number" /></label>
          </div>
          <label className="full">Address <b>*</b><input defaultValue="Thửa Đất 681, Tờ Bản Đồ 05, Đường ĐT 747B, Khu Phố Phước Hải, Phường Tân Khánh, Thành Phố Hồ Chí Minh, Việt Nam" /></label>
          <div className="general-submit-row"><button type="button" className="preview-profile-button" onClick={previewProfileInBackground}>Preview Profile</button><button type="submit">Submit <span>→</span></button></div>
        </form>
      </main>
    </div>
  )
}

function AdminNavIcon({ item }: { item: string }) {
  const paths: Record<string, React.ReactNode> = {
    Dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
    Users: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20c.5-3.1 2.4-5 5.5-5s5 1.9 5.5 5" /><path d="M16 7.5a2.5 2.5 0 0 1 0 5" /><path d="M17.5 15.5c1.7.7 2.6 2.1 3 4" /></>,
    Companies: <><path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16" /><path d="M15 9h3a2 2 0 0 1 2 2v10" /><path d="M8 7h2M8 11h2M8 15h2M17 15h.01" /></>,
    Expos: <><path d="M4 20V9l8-6 8 6v11" /><path d="M3 20h18M8 20v-5h8v5M12 3v6" /></>,
    Categories: <><path d="M4 7.5 12 3l8 4.5-8 4.5z" /><path d="M4 12.5 12 17l8-4.5M4 17 12 21l8-4" /></>,
    Packages: <><path d="m3 8 9-5 9 5-9 5z" /><path d="M3 8v8l9 5 9-5V8M12 13v8" /></>,
    Orders: <><path d="M6 3h12l2 4v14H4V7z" /><path d="M4 7h16M9 12h6M9 16h4" /></>,
  }
  return <svg className="admin-nav-icon" viewBox="0 0 24 24" aria-hidden="true">{paths[item]}</svg>
}

type DemoJourneyStep = {
  actor: string
  action: string
  screen: string
  script: string
  path: string
  cta?: string
  prep?: string[]
  focus?: string
}

const eid = furnitureExpoMock.id
// Script content strictly follows "Arobid - TradeXpo Sell Kit - Offline Word.docx".
const demoScriptSteps: DemoJourneyStep[] = [
    { actor: 'Seller / Demo Presenter', action: 'Click Run Demo Journey', screen: 'Role Selection', path: '/', script: 'Đây là trang điều hướng chính của Salekit. Người xem có thể chạy toàn bộ demo journey từ đầu, hoặc mở từng role để xem từng màn hình riêng biệt.' },
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
    { actor: 'Exhibitor', action: 'Click Submit', screen: 'General Info → Login', path: '/exhibitor/general-info', cta: 'Submit', script: 'Sau khi submit General Info, hệ thống quay lại login theo flow demo hiện tại.' },
    { actor: 'Exhibitor', action: 'Mở Create Account', screen: '/exhibitor/login', path: '/exhibitor/login', script: 'Đây là màn hình tạo tài khoản Arobid cho Exhibitor. Form đã được prefill để demo nhanh.' },
    { actor: 'Exhibitor', action: 'Click Create Arobid Account', screen: '/user/workspace', path: '/exhibitor/login', cta: 'Create Arobid Account', script: 'Chỉ từ màn hình login này, user mới đi thẳng vào Booth Config Workspace. Đây là flow riêng sau khi Exhibitor tạo tài khoản.' },
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

function DemoJourney({ onExit }: { onExit: () => void }) {
  const steps = demoScriptSteps
  const total = steps.length
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<'intro' | 'highlight' | 'script' | 'action'>('intro')
  const [runKey, setRunKey] = useState(0)
  const [typed, setTyped] = useState('')
  const [skipOpen, setSkipOpen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const step = steps[index]
  const typingDone = typed.length >= step.script.length

  // Find the real clickable control named by some text (a button/tab/card label).
  // We pick the SMALLEST clickable element whose text (or aria-label) contains the
  // needle, so we hit the actual button, never a big section. Inputs are skipped.
  // maxAreaFactor caps element size — small for highlighting (don't glow a whole
  // map), relaxed for clicking (the booth map IS the clickable target).
  const findClickableByText = (doc: Document, text: string | undefined, maxAreaFactor = 0.34): HTMLElement | null => {
    if (!text) return null
    const iframe = iframeRef.current
    const vw = iframe?.clientWidth || doc.documentElement.clientWidth
    const vh = iframe?.clientHeight || doc.documentElement.clientHeight
    const needle = text.toLowerCase()
    const nodes = Array.from(doc.querySelectorAll('button, a[href], [role="button"], summary, [class*="card"], [class*="Card"]')) as HTMLElement[]
    let bestCtrl: HTMLElement | null = null
    let bestCtrlArea = Infinity
    let bestAny: HTMLElement | null = null
    let bestAnyArea = Infinity
    for (const el of nodes) {
      if (el.matches('input, textarea, select, label')) continue
      const label = ((el.textContent || '') + ' ' + (el.getAttribute('aria-label') || '')).replace(/\s+/g, ' ').trim().toLowerCase()
      if (!label.includes(needle)) continue
      const r = el.getBoundingClientRect()
      if (r.width < 4 || r.height < 4) continue
      const area = r.width * r.height
      if (area > maxAreaFactor * vw * vh) continue
      // Prefer a genuine control (button/link); fall back to a card container only
      // when nothing actionable matches — a card <article> is not clickable.
      if (el.matches('button, a[href], [role="button"], summary')) {
        if (area < bestCtrlArea) { bestCtrl = el; bestCtrlArea = area }
      }
      if (area < bestAnyArea) { bestAny = el; bestAnyArea = area }
    }
    return bestCtrl || bestAny
  }
  const findCtaElement = (doc: Document): HTMLElement | null => findClickableByText(doc, step.cta, 0.34)

  // Find a non-clickable "filled / selected" component named by the script (a
  // form field, banner image, hall card, email input, etc.). Picks the SMALLEST
  // matching element so we glow just the field/component, never a whole section.
  // The selector only contains field/component-level nodes (no section/article/
  // form wrappers), and bare text spans aren't selectable, so the smallest match
  // is the field wrapper itself, not an inner label span.
  const findFocusElement = (doc: Document): HTMLElement | null => {
    if (!step.focus) return null
    const iframe = iframeRef.current
    const vw = iframe?.clientWidth || doc.documentElement.clientWidth
    const vh = iframe?.clientHeight || doc.documentElement.clientHeight
    const needle = step.focus.toLowerCase()
    const sel = 'label.form-field, input, textarea, select, img, [class*="card"], [class*="upload"], [class*="thumbnail"], [class*="hall"], [class*="banner"], [class*="tier"], [class*="featured"], [class*="email"], [class*="supplier"]'
    const nodes = Array.from(doc.querySelectorAll(sel)) as HTMLElement[]
    let best: HTMLElement | null = null
    let bestArea = Infinity
    for (const el of nodes) {
      const v = (el as HTMLInputElement).value || ''
      const label = ((el.textContent || '') + ' ' + (el.getAttribute('aria-label') || '') + ' ' + (el.getAttribute('alt') || '') + ' ' + (el.getAttribute('placeholder') || '') + ' ' + v).replace(/\s+/g, ' ').trim().toLowerCase()
      if (!label.includes(needle)) continue
      const r = el.getBoundingClientRect()
      if (r.width < 6 || r.height < 6) continue
      const area = r.width * r.height
      // Cap at ~22% of the viewport: a single field/component is never bigger,
      // so big layout containers that happen to contain the text are skipped.
      if (area > 0.22 * vw * vh) continue
      if (area < bestArea) { best = el; bestArea = area }
    }
    return best
  }

  // Scroll a highlighted element into view inside the cloned screen if it is off
  // screen, so the mentioned component is always visible.
  const scrollIntoViewIfNeeded = (el: HTMLElement, win: Window) => {
    const r = el.getBoundingClientRect()
    if (r.top < 64 || r.bottom > win.innerHeight - 64) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }

  // Animate the REAL component inside the cloned screen (no overlay boxes).
  // Read-only: we add a temporary highlight class to the actual clickable element,
  // then remove it again — the page itself is never permanently modified.
  const paintHighlights = () => {
    const iframe = iframeRef.current
    const doc = iframe?.contentDocument
    const win = iframe?.contentWindow
    if (!iframe || !doc || !win || !doc.body) return
    {
      let s = doc.getElementById('gtour-live-style') as HTMLStyleElement | null
      if (!s) {
        s = doc.createElement('style')
        s.id = 'gtour-live-style'
        doc.head.appendChild(s)
      }
      s.textContent = `
        .gtour-live-on {
          position: relative !important;
          z-index: 2147483646 !important;
          animation: gtourLivePulse 1.4s ease-in-out infinite !important;
        }
        /* No !important inside @keyframes — the spec ignores it, and that would
           also block the cascade. Animated values here override the page's normal
           styles on their own. Lightened: thinner outline, softer shadow, no scale. */
        @keyframes gtourLivePulse {
          0%, 100% {
            outline: 2px solid rgba(255,91,0,.85);
            outline-offset: 2px;
            box-shadow: 0 0 0 2px rgba(255,91,0,.26), 0 0 12px 3px rgba(255,122,26,.42);
          }
          50% {
            outline: 2px solid rgba(255,174,74,.9);
            outline-offset: 5px;
            box-shadow: 0 0 0 5px rgba(255,91,0,.14), 0 0 22px 7px rgba(255,122,26,.5);
          }
        }
      `
    }
    doc.querySelectorAll('.gtour-live-on').forEach((el) => el.classList.remove('gtour-live-on'))
    // Glow starts right after the popup is closed (highlight) and stays through the
    // script. No glow during the intro popup; the action phase clears it.
    if (phase !== 'highlight' && phase !== 'script') return
    // The glow class forces position:relative + a high z-index on its target. For
    // an absolutely/fixed-positioned element (e.g. a background <img> that fills
    // its container, like the thumbnail/banner preview) that drops it out of its
    // overlay flow, blows up its size and buries the sibling text. Redirect the
    // glow to the nearest non-absolute ancestor so the whole component lights up
    // with its layout intact.
    const safeTarget = (el: HTMLElement | null): HTMLElement | null => {
      let cur: HTMLElement | null = el
      while (cur && cur !== doc.body) {
        const pos = win.getComputedStyle(cur).position
        if (pos !== 'absolute' && pos !== 'fixed') return cur
        cur = cur.parentElement
      }
      return el
    }
    const cta = safeTarget(findCtaElement(doc))
    const focus = safeTarget(findFocusElement(doc))
    if (cta) cta.classList.add('gtour-live-on')
    if (focus && focus !== cta) focus.classList.add('gtour-live-on')
    // Auto-scroll the mentioned component into view (focus first, else the CTA).
    const primary = focus || cta
    if (primary && phase === 'highlight') scrollIntoViewIfNeeded(primary, win)
  }

  // Restart the cinematic sequence whenever the step (or a replay) changes. We
  // open straight on the highlight reveal (no separate intro popup) — the role /
  // step badge and the narration both live in the script dock now.
  useEffect(() => {
    setPhase('highlight')
    setTyped('')
  }, [index, runKey])

  // A short glow-reveal, then the script dock slides up and starts narrating.
  useEffect(() => {
    if (phase === 'highlight') {
      const t = window.setTimeout(() => setPhase('script'), 1300)
      return () => window.clearTimeout(t)
    }
  }, [phase, index, runKey])

  // Typewriter effect for the explanation script (game-style text reveal).
  useEffect(() => {
    if (phase === 'action') { setTyped(step.script); return }
    if (phase !== 'script') { setTyped(''); return }
    let count = 0
    const id = window.setInterval(() => {
      count += 1
      setTyped(step.script.slice(0, count))
      if (count >= step.script.length) window.clearInterval(id)
    }, 18)
    return () => window.clearInterval(id)
  }, [phase, index, runKey, step.script])

  // Repaint the in-place highlights whenever the phase/step changes.
  useEffect(() => {
    const t = window.setTimeout(paintHighlights, 120)
    return () => window.clearTimeout(t)
  }, [phase, index, runKey])

  // Setup clicks: when a step lives inside a modal / later state (e.g. the Invite
  // modal sub-steps), click the prerequisite controls inside the cloned screen to
  // bring it into the right state, then re-highlight. The cloned screen keeps its
  // state across same-route steps, and the openers are idempotent (set-open), so
  // re-running this is safe.
  useEffect(() => {
    if (phase !== 'highlight' || !step.prep || !step.prep.length) return
    const doc = iframeRef.current?.contentDocument
    if (!doc) return
    const labels = step.prep
    let cancelled = false
    let i = 0
    const runNext = () => {
      if (cancelled) return
      // Stop once the step's own CTA is already reachable, so we never re-click an
      // opener/tab that would toggle the state back closed.
      if (step.cta && findClickableByText(doc, step.cta, 0.95)) { paintHighlights(); return }
      if (i >= labels.length) { paintHighlights(); return }
      findClickableByText(doc, labels[i], 0.95)?.click()
      i += 1
      window.setTimeout(runNext, 340)
    }
    const start = window.setTimeout(runNext, 80)
    return () => { cancelled = true; window.clearTimeout(start) }
  }, [phase, index, runKey])

  // Close standalone preview popups (e.g. the 3D template modal) when leaving a
  // step so they don't linger over the next step. Modal sub-step flows reopen
  // their own modal via prep, so this is safe for them.
  const closeTransientModals = () => {
    const doc = iframeRef.current?.contentDocument
    if (!doc) return
    doc.querySelectorAll('.template-modal [aria-label="Close"], .template-modal-backdrop [aria-label="Close"]').forEach((btn) => (btn as HTMLElement).click())
  }

  const advance = () => setPhase((current) => current === 'highlight' ? 'script' : current)
  const next = () => { closeTransientModals(); index === total - 1 ? onExit() : setIndex(index + 1) }
  const back = () => { closeTransientModals(); if (index > 0) setIndex(index - 1) }
  const replay = () => { setPhase('highlight'); setTyped(''); setRunKey((k) => k + 1) }
  // Jump straight to a chosen step. The progress bar fills/unfills from the new
  // index and the journey resumes normally from there (the step-reset effect
  // restarts the reveal → script sequence).
  const goTo = (i: number) => { setSkipOpen(false); closeTransientModals(); if (i !== index) setIndex(i); else replay() }

  // Demo the interaction: click the real CTA inside the cloned screen so the
  // modal actually opens / the page actually navigates, then move to the 'action'
  // phase where the result is shown before going to the next step.
  const clickPrimaryCta = () => {
    const doc = iframeRef.current?.contentDocument
    if (!doc) return
    findClickableByText(doc, step.cta, 0.95)?.click()
  }
  const runDemo = () => { clickPrimaryCta(); setPhase('action') }

  // Keyboard controls, game-style. In the script phase, only steps with a CTA
  // run a demo click; the rest just advance to the next step.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); phase === 'script' ? (step.cta ? runDemo() : next()) : phase === 'action' ? next() : advance() }
      else if (e.key === 'ArrowLeft') back()
      else if (e.key === 'r' || e.key === 'R') replay()
      else if (e.key === 'Escape') onExit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="gtour-stage">
      <div className="gtour-topbar">
        <button className="gtour-brand" onClick={onExit}><img src="/arobid-logo-white.svg" alt="arobid.com" /><small>Salekit</small></button>
        <div className="gtour-progress">{steps.map((_, i) => <span key={i} className={i === index ? 'on' : i < index ? 'done' : ''} />)}</div>
        <div className="gtour-count">{index + 1} / {total}</div>
        <button className="gtour-exit" onClick={onExit}>Exit ✕</button>
      </div>

      <div className="gtour-screen">
        <iframe ref={iframeRef} key={step.path} title={step.screen} src={step.path} onLoad={() => window.setTimeout(paintHighlights, 220)} />
        {/* The veil dims/captures the screen during the reveal. Once the script
            has fully typed (or in the action phase) it becomes click-through so
            the user can scroll and read the page underneath. */}
        <div className={`gtour-veil ${phase}${(phase === 'script' && typingDone) || phase === 'action' ? ' through' : ''}`} onClick={phase === 'highlight' ? advance : undefined} />
      </div>

      <div className={`gtour-dock ${phase === 'script' || phase === 'action' ? 'open' : ''}`}>
        <div className="gtour-dock-card">
          <div className="gtour-speaker"><span>{step.actor}</span><b className="gtour-stepno">Step {index + 1} / {total}</b><small>{phase === 'action' ? `${step.screen} — demo` : `${step.screen} — ${step.action}`}</small></div>
          <p className="gtour-line" onClick={() => setTyped(step.script)}>
            {phase === 'action' ? step.script : typed}{phase === 'script' && !typingDone && <i className="gtour-caret" />}
          </p>
          <div className="gtour-controls">
            <button className="back" onClick={back} disabled={index === 0}>◂ Back</button>
            <button className="replay" onClick={replay}>⟳ Replay</button>
            <button className="skipto" onClick={() => setSkipOpen(true)}>↪ Skip to</button>
            {phase === 'script' && step.cta
              ? <button className="next" onClick={runDemo}>Open ▸</button>
              : <button className="next" onClick={next}>{index === total - 1 ? 'Finish ✓' : 'Next ▸'}</button>}
          </div>
        </div>
      </div>

      {skipOpen && <div className="script-overlay" onClick={() => setSkipOpen(false)}>
        <div className="script-panel" onClick={(e) => e.stopPropagation()}>
          <header className="script-panel-head"><div><h2>Skip to a step</h2><p>{total} steps · jump to any point, then continue the journey from there.</p></div><button className="script-close" onClick={() => setSkipOpen(false)} aria-label="Close">✕</button></header>
          <div className="script-table-wrap"><table className="script-table"><colgroup><col className="col-num" /><col className="col-actor" /><col className="col-action" /><col className="col-screen" /><col className="col-script" /><col className="col-dir" /></colgroup><thead><tr><th>#</th><th>Actor</th><th>Action</th><th>Screen</th><th>Script</th><th>Skip to</th></tr></thead><tbody>{steps.map((s, i) => <tr key={i} className={i === index ? 'script-row-current' : ''}><td className="script-num">{String(i + 1).padStart(2, '0')}</td><td className="script-actor">{s.actor}</td><td>{s.action}</td><td className="script-screen">{s.screen}</td><td className="script-text" title={s.script}>{s.script}</td><td className="script-dir">{i === index ? <span className="script-here">Current</span> : <button className="script-go" onClick={() => goTo(i)}>Go ▸</button>}</td></tr>)}</tbody></table></div>
        </div>
      </div>}
    </div>
  )
}

function RoleSelection({ onSelect }: { onSelect: (path: string) => void }) {
  const [expandedRoles, setExpandedRoles] = useState<string[]>([])
  const [scriptOpen, setScriptOpen] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const toggleRole = (role: string) => setExpandedRoles((current) => current.includes(role) ? current.filter((item) => item !== role) : [...current, role])
  const roles = [
    {
      icon: '⌘',
      role: 'Admin',
      description: 'Configure expos, govern participation, and monitor performance.',
      pages: [
        ['Expo Management List', '/admin/expo'],
        ['Create Expo Form', '/admin/expo/create'],
      ],
    },
    {
      icon: '◈',
      role: 'Partner',
      description: 'Launch branded events and manage exhibitors or visitors.',
      pages: [
        ['Expo Config List', '/partner/expos'],
        ['Expo Config Detail', `/partner/expos/${furnitureExpoMock.id}`],
        ['Expo Operation List', '/partner/operation/expos'],
        ['Expo Operation Detail', `/partner/operation/expos/${furnitureExpoMock.id}`],
      ],
    },
    {
      icon: '▦',
      role: 'Exhibitor',
      description: 'Create a booth, publish products, and respond to RFQs.',
      pages: [
        ['Invitation Email', '/exhibitor/invitation'],
        ['Create Account', '/exhibitor/login'],
        ['AI Onboarding', '/exhibitor/ai-onboarding'],
        ['General Info Form', '/exhibitor/general-info'],
        ['Booth Config Workspace', '/user/workspace'],
        ['Joined Expo Dashboard', '/user/workspace/expo-dashboard'],
        ['Joined Expo Detail & KPI', `/user/workspace/expo-dashboard/${furnitureExpoMock.id}`],
      ],
    },
    {
      icon: '◎',
      role: 'Visitor',
      description: 'Discover exhibitors, browse expo content, and enter the 3D expo.',
      pages: [
        ['Visitor Invitation Email', '/visitor/invitation'],
        ['Expo Detail Page', '/tradexpo/expo-detail'],
        ['Select Booth Tier', '/tradexpo/select-booth-tier'],
        ['Select Position & Quick Signup', '/tradexpo/select-position'],
        ['Payment Success', '/tradexpo/payment-success'],
      ],
    },
  ]

  return <div className="role-selection-page"><header className="role-topbar"><button className="role-brand logo-button"><img className="arobid-logo" src="/arobid-logo.svg" alt="arobid.com" /><small>Salekit</small></button><span className="role-tag">Interactive role walkthrough</span></header><main className="role-content"><p className="role-eyebrow">Product demo environment</p><h1>Show every role, clearly.</h1><p className="role-intro">Select a role to expand its demo pages, then jump directly to any built screen with realistic, pre-filled sample data.</p><button className="run-demo-journey-button" onClick={() => onSelect('/demo-journey')}>Run Demo Journey</button><p className="desktop-hint">💻 For the best experience, explore the journey on a desktop browser.</p><section className="role-grid">{roles.map((item) => { const isExpanded = expandedRoles.includes(item.role); return <article key={item.role} className={`role-card ${isExpanded ? 'expanded' : ''}`}><button className="role-card-main" onClick={() => toggleRole(item.role)} aria-expanded={isExpanded}><span className="role-icon">{item.icon}</span><h2>{item.role}</h2><p>{item.description}</p></button>{isExpanded && <div className="role-page-list">{item.pages.map(([label, path]) => <button key={path} onClick={() => onSelect(path)}><strong>{label}</strong></button>)}</div>}</article> })}</section></main>
    <button className="salekit-guide-fab" onClick={() => setGuideOpen(true)}><span className="salekit-guide-fab-icon" aria-hidden="true">i</span><span>Hướng dẫn sử dụng Salekit</span></button>
    {guideOpen && <div className="guide-overlay" onClick={() => setGuideOpen(false)}>
      <div className="guide-card" onClick={(e) => e.stopPropagation()}>
        <button className="guide-close" onClick={() => setGuideOpen(false)} aria-label="Đóng">✕</button>
        <span className="guide-eyebrow">Arobid · TradeXpo Salekit</span>
        <h2>Hướng dẫn sử dụng Salekit</h2>
        <p>Salekit giúp Partner thấy cách Arobid vận hành toàn bộ hành trình Expo theo từng vai trò. Đây là trang điều hướng chính: bạn có thể chạy toàn bộ Demo Journey từ đầu, hoặc mở từng role để xem từng màn hình riêng biệt.</p>
        <p>Mỗi role đại diện cho một nhóm người dùng trong hệ sinh thái Arobid — <strong>Admin, Partner, Exhibitor và Visitor</strong>. Khi chọn một role, hệ thống hiển thị các màn hình tương ứng đã được chuẩn bị sẵn cho demo.</p>
        <div className="guide-flow">
          <span>Admin tạo Expo</span><b>→</b><span>Partner cấu hình & mời tham gia</span><b>→</b><span>Exhibitor onboarding & customize booth</span><b>→</b><span>Visitor nhận lời mời & tham quan Expo</span>
        </div>
        <p className="guide-note">Toàn bộ dữ liệu trong demo là <strong>mock data</strong>, nhưng flow phản ánh đúng journey sản phẩm end-to-end. Mỗi bước tập trung vào một tương tác chính trên màn hình.</p>
        <div className="guide-actions">
          <button className="guide-run" onClick={() => { setGuideOpen(false); onSelect('/demo-journey') }}>Run Demo Journey ▸</button>
        </div>
      </div>
    </div>}
    <button className="script-fab" onClick={() => setScriptOpen(true)} aria-label="Show demo script"><span className="script-fab-icon" aria-hidden="true">▤</span><span>Show Script</span></button>
    {scriptOpen && <div className="script-overlay" onClick={() => setScriptOpen(false)}>
      <div className="script-panel" onClick={(e) => e.stopPropagation()}>
        <header className="script-panel-head"><div><h2>Demo Journey Script</h2><p>{demoScriptSteps.length} steps · jump to any screen the script is talking about.</p></div><button className="script-close" onClick={() => setScriptOpen(false)} aria-label="Close script">✕</button></header>
        <div className="script-table-wrap"><table className="script-table"><colgroup><col className="col-num" /><col className="col-actor" /><col className="col-action" /><col className="col-screen" /><col className="col-script" /><col className="col-dir" /></colgroup><thead><tr><th>#</th><th>Actor</th><th>Action</th><th>Screen</th><th>Script</th><th>Direction</th></tr></thead><tbody>{demoScriptSteps.map((s, i) => <tr key={i}><td className="script-num">{String(i + 1).padStart(2, '0')}</td><td className="script-actor">{s.actor}</td><td>{s.action}</td><td className="script-screen">{s.screen}</td><td className="script-text" title={s.script}>{s.script}</td><td className="script-dir"><button className="script-go" onClick={() => onSelect(s.path)}>Go ▸</button></td></tr>)}</tbody></table></div>
      </div>
    </div>}
    </div>
}
