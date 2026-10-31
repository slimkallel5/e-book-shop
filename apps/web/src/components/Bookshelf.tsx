import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import {
  BookOpen,
  Library,
  GraduationCap,
  Compass,
  Gift,
  Newspaper,
  Star,
} from 'lucide-react-native';
import { EDUCATION_LEVELS } from '../mock/data';
import { useLanguage } from '../context/LanguageContext';
import { colors, layout, shadows, typography } from '../theme/tokens';
import { Tooltip } from './ui/Tooltip';

export type NavCategory = 'all' | 'primary' | 'middle' | 'secondary' | 'packs' | 'articles';

interface BookshelfProps {
  selectedCategory: NavCategory;
  onSelectCategory: (category: NavCategory) => void;
  isCompact?: boolean;
}

export const Bookshelf: React.FC<BookshelfProps> = ({
  selectedCategory,
  onSelectCategory,
  isCompact = false,
}) => {
  const { language, isRTL, t } = useLanguage();

  const renderCategoryIcon = (id: NavCategory, isSelected: boolean) => {
    const iconColor = isSelected ? colors.primaryDark : colors.accent;
    switch (id) {
      case 'all':
        return <Library size={18} color={iconColor} />;
      case 'primary':
        return <GraduationCap size={18} color={iconColor} />;
      case 'middle':
        return <Compass size={18} color={iconColor} />;
      case 'secondary':
        return <GraduationCap size={18} color={iconColor} />;
      case 'packs':
        return <Gift size={18} color={iconColor} />;
      case 'articles':
        return <Newspaper size={18} color={iconColor} />;
      default:
        return <BookOpen size={18} color={iconColor} />;
    }
  };

  const navItems: { id: NavCategory; titleKey: string; color: string; subtitleKey?: string }[] = [
    {
      id: 'all',
      titleKey: 'app.allLevels',
      color: colors.primaryDark,
      subtitleKey: 'app.catalogTitle',
    },
    ...EDUCATION_LEVELS.map((level) => ({
      id: level.id as NavCategory,
      titleKey: level.title[language] || level.title.ar,
      color: level.spineColor,
      subtitleKey: level.subTitle[language] || level.subTitle.ar,
    })),
    {
      id: 'packs',
      titleKey: 'app.featuredPacks',
      color: colors.badgePack,
      subtitleKey: 'app.packBadge',
    },
    {
      id: 'articles',
      titleKey: 'app.articlesGalleryTitle',
      color: colors.secondary,
      subtitleKey: 'app.articlesGallerySub',
    },
  ];

  return (
    <View style={[styles.shelfContainer, isCompact && styles.shelfContainerCompact]}>
      {/* Menu Header Bar */}
      <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.headerIconContainer}>
          <BookOpen size={18} color={colors.accent} />
        </View>
        <Text style={[styles.shelfTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('app.shelfOverview')}
        </Text>
      </View>

      {/* Navigation Menu List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.spinesListContent}
      >
        {navItems.map((item) => {
          const isSelected = selectedCategory === item.id;
          const displayTitle = item.titleKey.startsWith('app.') ? t(item.titleKey) : item.titleKey;
          const displaySub = item.subtitleKey && item.subtitleKey.startsWith('app.') ? t(item.subtitleKey) : item.subtitleKey;

          return (
            <Tooltip key={item.id} content={displayTitle} position={isRTL ? 'left' : 'right'}>
              <TouchableOpacity
                style={[
                  styles.menuItemCard,
                  isSelected && styles.menuItemCardSelected,
                  { flexDirection: isRTL ? 'row-reverse' : 'row' },
                ]}
                onPress={() => onSelectCategory(item.id)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={displayTitle}
                accessibilityState={{ selected: isSelected }}
              >
                {/* Accent border strip for category differentiation */}
                <View
                  style={[
                    styles.accentStrip,
                    isRTL ? styles.accentStripRtl : styles.accentStripLtr,
                    { backgroundColor: item.color },
                  ]}
                />

                {/* Category Icon */}
                <View
                  style={[
                    styles.menuItemIcon,
                    isSelected && styles.menuItemIconSelected,
                  ]}
                >
                  {renderCategoryIcon(item.id, isSelected)}
                </View>

                {/* Text Labels */}
                <View style={[styles.menuItemTextCol, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                  <Text
                    style={[
                      styles.menuItemTitle,
                      isSelected && styles.menuItemTitleSelected,
                      { textAlign: isRTL ? 'right' : 'left' },
                    ]}
                    numberOfLines={1}
                  >
                    {displayTitle}
                  </Text>
                  {displaySub && (
                    <Text
                      style={[
                        styles.menuItemSub,
                        isSelected && styles.menuItemSubSelected,
                        { textAlign: isRTL ? 'right' : 'left' },
                      ]}
                      numberOfLines={1}
                    >
                      {displaySub}
                    </Text>
                  )}
                </View>

                {/* Active Indicator Icon */}
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Star size={12} color={colors.primaryDark} fill={colors.primaryDark} />
                  </View>
                )}
              </TouchableOpacity>
            </Tooltip>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  shelfContainer: {
    width: 280,
    backgroundColor: 'rgba(18, 59, 43, 0.95)',
    borderRadius: layout.borderRadius.xl,
    padding: 16,
    ...shadows.lg,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.3)',
  },
  shelfContainerCompact: {
    width: '100%',
  },
  headerRow: {
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
    paddingBottom: 14,
    marginBottom: 14,
  },
  headerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: layout.borderRadius.md,
    backgroundColor: 'rgba(229, 193, 88, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelfTitle: {
    color: colors.textLight,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    flex: 1,
  },
  spinesListContent: {
    gap: 8,
    paddingBottom: 4,
  },
  menuItemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: layout.borderRadius.lg,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemCardSelected: {
    backgroundColor: 'rgba(229, 193, 88, 0.22)',
    borderColor: colors.accent,
    ...shadows.sm,
  },
  accentStrip: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
  },
  accentStripLtr: {
    left: 0,
  },
  accentStripRtl: {
    right: 0,
  },
  menuItemIcon: {
    width: 32,
    height: 32,
    borderRadius: layout.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemIconSelected: {
    backgroundColor: colors.accent,
  },
  menuItemTextCol: {
    flex: 1,
  },
  menuItemTitle: {
    color: colors.textLight,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  menuItemTitleSelected: {
    color: colors.accentLight,
  },
  menuItemSub: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  menuItemSubSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  selectedBadge: {
    width: 22,
    height: 22,
    borderRadius: layout.borderRadius.full,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
