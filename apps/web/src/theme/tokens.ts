export const colors = {
  primary: '#123B2B', // Deep Emerald Green
  primaryLight: '#1B543E',
  primaryDark: '#0A2319',
  secondary: '#8B5A2B', // Natural Oak / Walnut
  secondaryLight: '#A6703B',
  accent: '#C29B38', // Muted Gold
  accentLight: '#E5C158',
  background: '#FAF8F5', // Warm Ivory / Cream
  cardBg: '#FFFFFF',
  shelfBg: '#4A2E18', // Deep wood shelf
  textPrimary: '#1E2923',
  textSecondary: '#5A6B62',
  textMuted: '#8A9A90',
  textLight: '#FFFFFF',
  border: '#E2DDD5',
  borderDark: '#C8C2B7',
  error: '#D32F2F',
  success: '#2E7D32',
  warning: '#ED6C02',
  badgePack: '#7B1FA2', // Purple accent for packs
  badgeDiscount: '#D32F2F',
  badgeNew: '#0288D1',
  shadow: 'rgba(18, 59, 43, 0.08)',
};

export const typography = {
  fontFamilyArabic: 'Noto Sans Arabic, system-ui, -apple-system, sans-serif',
  fontFamilyLatin: 'System, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    hero: 32,
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
  a4AspectRatio: 1.414, // Height / Width ratio (e.g., width x 1.414 = height)
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  maxWidth: 1280,
};

export const shadows = {
  sm: {
    shadowColor: '#123B2B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#123B2B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#123B2B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};
