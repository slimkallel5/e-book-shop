import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import {
  BookOpen,
  Search,
  Settings,
  Store,
  Package,
  Mail,
  Heart,
  ShoppingCart,
  ChevronDown,
  Sparkles,
  Layers,
} from 'lucide-react-native';
import { useLanguage, Language } from '../context/LanguageContext';
import { colors, layout, shadows, typography } from '../theme/tokens';
import { Tooltip } from './ui/Tooltip';

interface HeaderProps {
  cartCount?: number;
  favouritesCount?: number;
  onOpenCart?: () => void;
  onOpenFavourites?: () => void;
  onOpenOrderLookup?: () => void;
  onOpenContact?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isAdminMode?: boolean;
  onToggleAdminMode?: () => void;
  onToggle3DPreview?: () => void;
  is3DPreviewActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount = 0,
  favouritesCount = 0,
  onOpenCart,
  onOpenFavourites,
  onOpenOrderLookup,
  onOpenContact,
  searchQuery = '',
  onSearchChange,
  isAdminMode = false,
  onToggleAdminMode,
  onToggle3DPreview,
  is3DPreviewActive = false,
}) => {
  const { language, setLanguage, isRTL, t } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'ar', label: 'العربية (RTL)', flag: '🇹🇳' },
    { code: 'fr', label: 'Français (LTR)', flag: '🇫🇷' },
    { code: 'en', label: 'English (LTR)', flag: '🇬🇧' },
  ];

  const activeLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <View style={styles.headerWrapper}>
      {/* 3D Glassmorphic Navigation Bar */}
      <View style={[styles.innerHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {/* Brand Logo & Name with 3D Holographic Crest */}
        <View style={[styles.brandContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={styles.logoBadge3D}>
            <View style={styles.logoBadgeInner}>
              <BookOpen size={22} color={colors.primaryDark} strokeWidth={2.4} />
            </View>
            <View style={styles.logoShine} />
          </View>
          <View style={[styles.brandTextCol, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
            <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }]}>
              <Text style={[styles.brandTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('app.name')}
              </Text>
              <Sparkles size={14} color={colors.accent} />
            </View>
            <Text style={[styles.brandSub, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('app.tagline')}
            </Text>
          </View>
        </View>

        {/* 3D Search Field with Glowing Focus Halo */}
        <View style={styles.searchWrapper}>
          <View
            style={[
              styles.searchBox,
              isSearchFocused && styles.searchBoxFocused,
              { flexDirection: isRTL ? 'row-reverse' : 'row' },
            ]}
          >
            <Search
              size={18}
              color={isSearchFocused ? colors.accentLight : 'rgba(255, 255, 255, 0.65)'}
              style={styles.searchIcon}
            />
            <TextInput
              style={[
                styles.searchInput,
                { textAlign: isRTL ? 'right' : 'left', direction: isRTL ? 'rtl' : 'ltr' },
              ]}
              placeholder={t('app.searchPlaceholder')}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={searchQuery}
              onChangeText={onSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </View>
        </View>

        {/* Action Controls & Navigation Modules */}
        <View style={[styles.actionsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {/* 3D Demonstrator Toggle */}
          {onToggle3DPreview && (
            <Tooltip content={is3DPreviewActive ? t('app.storefront') : '3D'}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  is3DPreviewActive ? styles.demonstratorActiveBtn : styles.demonstratorBtn,
                  { flexDirection: isRTL ? 'row-reverse' : 'row' },
                ]}
                onPress={onToggle3DPreview}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="3D Preview"
              >
                <Layers size={16} color={is3DPreviewActive ? colors.primaryDark : colors.accentLight} />
                <Text
                  style={[
                    styles.navBtnLabel,
                    is3DPreviewActive ? { color: colors.primaryDark } : { color: colors.accentLight },
                  ]}
                >
                  {is3DPreviewActive ? (language === 'ar' ? 'المتجر' : 'Store') : '3D'}
                </Text>
              </TouchableOpacity>
            </Tooltip>
          )}

          {/* Admin Toggle */}
          {onToggleAdminMode && (
            <Tooltip content={isAdminMode ? t('app.storefront') : t('app.administrator')}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  isAdminMode ? styles.adminActiveBtn : styles.adminBtn,
                  { flexDirection: isRTL ? 'row-reverse' : 'row' },
                ]}
                onPress={onToggleAdminMode}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={isAdminMode ? t('app.storefront') : t('app.administrator')}
              >
                {isAdminMode ? (
                  <Store size={16} color={colors.textLight} />
                ) : (
                  <Settings size={16} color={colors.textLight} />
                )}
                <Text style={[styles.navBtnLabel, { color: colors.textLight }]}>
                  {isAdminMode ? t('app.storefront') : t('app.administrator')}
                </Text>
              </TouchableOpacity>
            </Tooltip>
          )}

          {/* Order Tracking */}
          {onOpenOrderLookup && (
            <Tooltip content={t('app.lookupOrderTitle')}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={onOpenOrderLookup}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={t('app.lookupOrderTitle')}
              >
                <Package size={18} color={colors.textLight} />
              </TouchableOpacity>
            </Tooltip>
          )}

          {/* Contact Trigger */}
          {onOpenContact && (
            <Tooltip content={t('app.contactUs')}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={onOpenContact}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={t('app.contactUs')}
              >
                <Mail size={18} color={colors.textLight} />
              </TouchableOpacity>
            </Tooltip>
          )}

          {/* Favourites */}
          <Tooltip content={t('app.favourites')}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={onOpenFavourites}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={t('app.favourites')}
            >
              <Heart
                size={18}
                color={favouritesCount > 0 ? colors.error : colors.textLight}
                fill={favouritesCount > 0 ? colors.error : 'transparent'}
              />
              {favouritesCount > 0 && (
                <View style={styles.badgeCount}>
                  <Text style={styles.badgeCountText}>{favouritesCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </Tooltip>

          {/* Glowing 3D Cart Pill */}
          <Tooltip content={t('app.cart')}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.cartBtn3D,
                { flexDirection: isRTL ? 'row-reverse' : 'row' },
              ]}
              onPress={onOpenCart}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={t('app.cart')}
            >
              <ShoppingCart size={18} color={colors.primaryDark} strokeWidth={2.4} />
              <Text style={styles.cartLabelText}>{t('app.cart')}</Text>
              {cartCount > 0 && (
                <View style={styles.cartCountPill}>
                  <Text style={styles.cartCountPillText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </Tooltip>

          {/* Language Selector Dropdown */}
          <View style={styles.langSelectorContainer}>
            <Tooltip content={t('app.language')}>
              <TouchableOpacity
                style={[styles.langBtn, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={() => setLangDropdownOpen(!langDropdownOpen)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={t('app.language')}
              >
                <Text style={styles.langFlag}>{activeLang.flag}</Text>
                <Text style={styles.langCode}>{activeLang.code.toUpperCase()}</Text>
                <ChevronDown size={14} color={colors.textLight} />
              </TouchableOpacity>
            </Tooltip>

            {langDropdownOpen && (
              <View
                style={[
                  styles.dropdownMenu,
                  isRTL ? { left: 0 } : { right: 0 },
                ]}
              >
                {languages.map((item) => (
                  <TouchableOpacity
                    key={item.code}
                    style={[
                      styles.dropdownItem,
                      language === item.code && styles.dropdownItemActive,
                      { flexDirection: isRTL ? 'row-reverse' : 'row' },
                    ]}
                    onPress={() => {
                      setLanguage(item.code);
                      setLangDropdownOpen(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.itemFlag}>{item.flag}</Text>
                    <Text
                      style={[
                        styles.itemLabel,
                        language === item.code && styles.itemLabelActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export const Footer: React.FC = () => {
  const { isRTL, t } = useLanguage();

  return (
    <View style={styles.footerContainer}>
      <View style={[styles.innerFooter, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }]}>
          <Sparkles size={16} color={colors.accentLight} />
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} {t('app.name')}. {t('app.rights')} ({t('app.currency')})
          </Text>
        </View>
        <Text style={styles.footerContact}>{t('app.contactUs')}: support@ebookshop.tn</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: 'rgba(10, 32, 23, 0.88)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 193, 88, 0.35)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    ...shadows.lg,
    zIndex: 100,
  },
  innerHeader: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  brandContainer: {
    alignItems: 'center',
    gap: 12,
  },
  logoBadge3D: {
    width: 44,
    height: 44,
    borderRadius: layout.borderRadius.md,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...shadows.goldGlow,
    borderWidth: 1,
    borderColor: '#fff1a8',
  },
  logoBadgeInner: {
    zIndex: 2,
  },
  logoShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    borderTopLeftRadius: layout.borderRadius.md,
    borderTopRightRadius: layout.borderRadius.md,
  },
  brandTextCol: {
    justifyContent: 'center',
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.3,
  },
  brandSub: {
    color: colors.accentLight,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  searchWrapper: {
    flex: 1,
    minWidth: 260,
    maxWidth: 520,
  },
  searchBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: layout.borderRadius.full,
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.28)',
    ...shadows.sm,
  },
  searchBoxFocused: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: colors.accent,
    ...shadows.goldGlow,
  },
  searchIcon: {
    marginRight: 8,
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.textLight,
    fontSize: typography.fontSize.sm,
    paddingVertical: 4,
  },
  actionsRow: {
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: layout.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demonstratorBtn: {
    backgroundColor: 'rgba(229, 193, 88, 0.15)',
    borderColor: 'rgba(229, 193, 88, 0.4)',
    gap: 6,
  },
  demonstratorActiveBtn: {
    backgroundColor: colors.accent,
    borderColor: colors.accentLight,
    gap: 6,
    ...shadows.goldGlow,
  },
  adminBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    gap: 6,
  },
  adminActiveBtn: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.accent,
    gap: 6,
  },
  navBtnLabel: {
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
  },
  cartBtn3D: {
    backgroundColor: colors.accent,
    borderColor: '#fff1a8',
    paddingHorizontal: 14,
    gap: 8,
    ...shadows.goldGlow,
  },
  cartLabelText: {
    color: colors.primaryDark,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
  },
  cartCountPill: {
    backgroundColor: colors.primaryDark,
    borderRadius: layout.borderRadius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  cartCountPillText: {
    color: colors.accentLight,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  badgeCount: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.error,
    borderRadius: layout.borderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeCountText: {
    color: colors.textLight,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  langSelectorContainer: {
    position: 'relative',
  },
  langBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: layout.borderRadius.md,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.3)',
  },
  langFlag: {
    fontSize: 15,
  },
  langCode: {
    color: colors.textLight,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    marginTop: 8,
    backgroundColor: 'rgba(12, 38, 28, 0.96)',
    borderRadius: layout.borderRadius.md,
    minWidth: 170,
    ...shadows.lg,
    overflow: 'hidden',
    zIndex: 200,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.4)',
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(229, 193, 88, 0.2)',
  },
  itemFlag: {
    fontSize: 16,
  },
  itemLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
  },
  itemLabelActive: {
    fontWeight: typography.fontWeight.bold,
    color: colors.accentLight,
  },
  footerContainer: {
    backgroundColor: 'rgba(7, 24, 17, 0.95)',
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginTop: 48,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 193, 88, 0.25)',
  },
  innerFooter: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: typography.fontSize.sm,
  },
  footerContact: {
    color: colors.accentLight,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
});
