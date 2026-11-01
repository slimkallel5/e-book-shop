export const colors = {
  // Brand & Palette
  primary: '#123B2B', // Deep Emerald Green
  primaryLight: '#1B543E',
  primaryDark: '#0A2319',
  primaryDeep: '#071A12',
  secondary: '#8B5A2B', // Natural Oak / Walnut
  secondaryLight: '#A6703B',
  secondaryDark: '#5E3B1B',
  accent: '#C29B38', // Muted Antique Gold
  accentLight: '#E5C158',
  accentDark: '#8F6F20',
  accentGlow: 'rgba(229, 193, 88, 0.45)',

  // Library Background & Surfaces
  background: '#0D2118', // Deep Library Night Canvas
  backgroundWarm: '#FAF8F5', // Warm Ivory / Cream
  cardBg: '#FFFFFF',
  cardBgDark: 'rgba(15, 37, 28, 0.88)',
  shelfBg: '#3D2413', // Deep wood shelf tone
  shelfBorder: '#5C381D',

  // Glassmorphic Surfaces
  glassBg: 'rgba(255, 255, 255, 0.85)',
  glassBgDark: 'rgba(18, 59, 43, 0.72)',
  glassBgUltraDark: 'rgba(10, 35, 25, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.28)',
  glassBorderDark: 'rgba(229, 193, 88, 0.25)',
  ambientGlow: 'rgba(194, 155, 56, 0.2)',
  glowEmerald: 'rgba(27, 84, 62, 0.35)',

  // Text
  textPrimary: '#1E2923',
  textSecondary: '#5A6B62',
  textMuted: '#8A9A90',
  textLight: '#FFFFFF',
  textLightSecondary: 'rgba(255, 255, 255, 0.78)',
  textGold: '#E5C158',

  // Borders & Feedback
  border: '#E2DDD5',
  borderDark: '#C8C2B7',
  borderGlass: 'rgba(255, 255, 255, 0.15)',
  error: '#D32F2F',
  success: '#2E7D32',
  warning: '#ED6C02',
  badgePack: '#7B1FA2', // Purple accent for packs
  badgeDiscount: '#D32F2F',
  badgeNew: '#0288D1',
  shadow: 'rgba(18, 59, 43, 0.16)',
};

export const typography = {
  fontFamilyArabic: 'Noto Sans Arabic, "Segoe UI", Tahoma, sans-serif',
  fontFamilyLatin: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    hero: 32,
    display: 40,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};

export const layout = {
  a4AspectRatio: 1.414, // Height / Width ratio (width x 1.414 = height)
  borderRadius: {
    xs: 4,
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  maxWidth: 1280,
  headerHeight: 76,
};

export const shadows = {
  sm: {
    shadowColor: '#071A12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#071A12',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  lg: {
    shadowColor: '#071A12',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  goldGlow: {
    shadowColor: '#E5C158',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
};
