import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useLanguage, Language } from '../context/LanguageContext';
import { colors, layout, shadows, typography } from '../theme/tokens';

interface HeaderProps {
  cartCount?: number;
  favouritesCount?: number;
  onOpenCart?: () => void;
  onOpenFavourites?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount = 0,
  favouritesCount = 0,
  onOpenCart,
  onOpenFavourites,
  searchQuery = '',
  onSearchChange,
}) => {
  const { language, setLanguage, isRTL, t } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'ar', label: 'العربية (RTL)', flag: '🇹🇳' },
    { code: 'fr', label: 'Français (LTR)', flag: '🇫🇷' },
    { code: 'en', label: 'English (LTR)', flag: '🇬🇧' },
  ];

  const activeLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <View style={styles.headerContainer}>
      <View style={[styles.innerHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {/* Brand Logo & Name */}
        <View style={[styles.brandContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>📚</Text>
          </View>
          <View style={styles.brandTextCol}>
            <Text style={[styles.brandTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('app.name')}
            </Text>
            <Text style={[styles.brandSub, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('app.tagline')}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={[styles.searchBox, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={[
                styles.searchInput,
                { textAlign: isRTL ? 'right' : 'left', direction: isRTL ? 'rtl' : 'ltr' },
              ]}
              placeholder={t('app.searchPlaceholder')}
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={onSearchChange}
            />
          </View>
        </View>

        {/* Action Controls & Language Selector */}
        <View style={[styles.actionsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {/* Favourites Button */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onOpenFavourites}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>❤️</Text>
            {favouritesCount > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>{favouritesCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Cart Button */}
          <TouchableOpacity
            style={[styles.actionBtn, styles.cartBtn]}
            onPress={onOpenCart}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🛒</Text>
            <Text style={styles.cartLabel}>{t('app.cart')}</Text>
            {cartCount > 0 && (
              <View style={[styles.badgeCount, styles.cartBadge]}>
                <Text style={styles.badgeCountText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Language Selector */}
          <View style={styles.langSelectorContainer}>
            <TouchableOpacity
              style={styles.langBtn}
              onPress={() => setLangDropdownOpen(!langDropdownOpen)}
              activeOpacity={0.8}
            >
              <Text style={styles.langFlag}>{activeLang.flag}</Text>
              <Text style={styles.langCode}>{activeLang.code.toUpperCase()}</Text>
              <Text style={styles.dropdownArrow}>▾</Text>
            </TouchableOpacity>

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
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} {t('app.name')}. {t('app.rights')} ({t('app.currency')})
        </Text>
        <Text style={styles.footerContact}>{t('app.contactUs')}: support@ebookshop.tn</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...shadows.md,
    zIndex: 100,
  },
  innerHeader: {
    maxWidth: layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  brandContainer: {
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: layout.borderRadius.md,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadgeText: {
    fontSize: typography.fontSize.xl,
  },
  brandTextCol: {
    justifyContent: 'center',
  },
  brandTitle: {
    color: colors.textLight,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  brandSub: {
    color: colors.accentLight,
    fontSize: typography.fontSize.xs,
  },
  searchWrapper: {
    flex: 1,
    minWidth: 240,
    maxWidth: 480,
  },
  searchBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: layout.borderRadius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
    marginLeft: 6,
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
    padding: 8,
    borderRadius: layout.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtn: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    backgroundColor: colors.accent,
    gap: 6,
  },
  cartLabel: {
    color: colors.primaryDark,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
  },
  actionIcon: {
    fontSize: 16,
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.error,
    borderRadius: layout.borderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadge: {
    backgroundColor: colors.primary,
    position: 'relative',
    top: 0,
    right: 0,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: layout.borderRadius.md,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  langFlag: {
    fontSize: 14,
  },
  langCode: {
    color: colors.textLight,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  dropdownArrow: {
    color: colors.textLight,
    fontSize: 10,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    marginTop: 6,
    backgroundColor: colors.cardBg,
    borderRadius: layout.borderRadius.md,
    minWidth: 160,
    ...shadows.lg,
    overflow: 'hidden',
    zIndex: 200,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 8,
  },
  dropdownItemActive: {
    backgroundColor: colors.background,
  },
  itemFlag: {
    fontSize: 16,
  },
  itemLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  itemLabelActive: {
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  footerContainer: {
    backgroundColor: colors.primaryDark,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 40,
  },
  innerFooter: {
    maxWidth: layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
  },
  footerContact: {
    color: colors.accent,
    fontSize: typography.fontSize.sm,
  },
});
