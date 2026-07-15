export const furnitureExpoMock = {
  id: 'expo-vietnam-furniture-2026',
  template: 'Standard Expo Template',
  ownerEmail: 'partner-email@domain.com',
  name: 'Vietnam Furniture Expo 2026',
  description: 'Description of the Expo provided from Partner',
  timezone: 'Asia/Bangkok (+07:00)',
  thumbnailUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85',
  thumbnailFileName: 'furniture-expo-banner.jpg',
  templateName: 'Standard Expo 3D Template',
  templatePreviewUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=520&q=85',
  templateViewerUrl: 'https://arobidglobal.shapespark.com/expo-map-template/',
  category: 'Furnitures',
  startDate: '2026-10-12',
  startTime: '09:00',
  endDate: '2026-10-16',
  endTime: '18:00',
  halls: [
    {
      id: 'hall-furniture',
      name: 'Furniture Hall',
      template: 'Standard Expo Template',
      boothSlots: { basic: 150, professional: 40, premium: 10 },
    },
  ],
} as const

export const mockPartnerEmails = [
  'partner-email@domain.com',
  'expo.owner@vietindustry.vn',
  'operations@foodexpo.vn',
] as const

// The Partner's own digital infrastructure (tenant). This is the association whose
// live portal the Portal Initialization flow links out to.
export const partnerTenantMock = {
  name: 'Tay Bac Sai Gon Business Association',
  portalUrl: 'https://arobid.com/partner/en/hdn-taybacsaigon',
  inviteUrl: 'https://arobid.com/partner/en/hdn-taybacsaigon/join',
} as const

// Member + prospect businesses on the Partner's tenant. "Not invited" rows are the
// ones the Partner picks when inviting businesses onto the infrastructure.
export const mockMemberBusinesses = [
  { name: 'Woodcraft Living Co.', email: 'contact@woodcraftliving.vn', industry: 'Furniture', status: 'Not invited' },
  { name: 'Saigon Interior Studio', email: 'hello@saigoninterior.com', industry: 'Interior Design', status: 'Not invited' },
  { name: 'Vietnam Furniture Export', email: 'export@vnfurniture.vn', industry: 'Furniture', status: 'Not invited' },
  { name: 'Home Living Group', email: 'procurement@homeliving.com', industry: 'Home & Garden', status: 'Not invited' },
  { name: 'Automation Hub Vietnam', email: 'sales@automationhub.vn', industry: 'Industrial Components', status: 'Not invited' },
  { name: 'Green Packaging JSC', email: 'info@greenpackaging.vn', industry: 'Packaging', status: 'Not invited' },
  { name: 'Cath Kidston VN', email: 'partner@cathkidston.vn', industry: 'Consumer Goods', status: 'Member' },
  { name: 'Rex Hotel Saigon', email: 'events@rexhotel.vn', industry: 'Business Services', status: 'Member' },
] as const

// Invitation log shown on Partner Site Management → Invitations.
export const mockInvitationLog = [
  { name: 'Cath Kidston VN', email: 'partner@cathkidston.vn', sent: '02/07/2026', status: 'Joined' },
  { name: 'Rex Hotel Saigon', email: 'events@rexhotel.vn', sent: '02/07/2026', status: 'Joined' },
  { name: 'Mekong Timber Co.', email: 'sales@mekongtimber.vn', sent: '28/06/2026', status: 'Opened' },
  { name: 'Da Nang Ceramics', email: 'contact@dnceramics.vn', sent: '28/06/2026', status: 'Sent' },
] as const
