export const colors = {
  primary: '#0F382C', // Modern Deep Emerald
  primaryLight: '#1B543E',
  primaryDark: '#072119',
  secondary: '#5C3A21', // Rich Oak / Leather
  secondaryLight: '#8C5B36',
  accent: '#D4AF37', // Muted Gold Accent
  accentLight: '#F3E5AB',
  background: '#FDFBF7', // Warm Cream / Ivory Paper
  cardBg: '#FFFFFF',
  shelfBg: '#2C1A11', // Deep Walnut Shelf
  pageBg: '#FAF7F0', // Opened book page color
  textPrimary: '#1A2E26',
  textSecondary: '#4A5D55',
  textMuted: '#7A8C84',
  textLight: '#FFFFFF',
  border: '#E8E2D8',
  borderDark: '#D0C8B8',
  error: '#C62828',
  success: '#2E7D32',
  warning: '#EF6C00',
  badgePack: '#6A1B9A', // Purple accent for packs
  badgeDiscount: '#C62828',
  badgeNew: '#1565C0',
  shadow: 'rgba(15, 56, 44, 0.08)',
};

export const typography = {
  fontFamilyArabic: 'Noto Sans Arabic, Cairo, system-ui, -apple-system, sans-serif',
  fontFamilyLatin: 'System, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 26,
    hero: 34,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const layout = {
  a4AspectRatio: 1.414, // Height / Width ratio (A4 portrait format)
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
    full: 9999,
  },
  maxWidth: 1280,
};

export const shadows = {
  sm: {
    shadowColor: '#0F382C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F382C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F382C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
};
