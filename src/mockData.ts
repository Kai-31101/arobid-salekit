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
