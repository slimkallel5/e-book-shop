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

  const renderCategoryIcon = (id: NavCategory) => {
    switch (id) {
      case 'all':
        return <Library size={18} color={colors.accent} />;
      case 'primary':
        return <GraduationCap size={18} color={colors.accent} />;
      case 'middle':
        return <Compass size={18} color={colors.accent} />;
      case 'secondary':
        return <GraduationCap size={18} color={colors.accent} />;
      case 'packs':
        return <Gift size={18} color={colors.accent} />;
      case 'articles':
        return <Newspaper size={18} color={colors.accent} />;
      default:
        return <BookOpen size={18} color={colors.accent} />;
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
      {/* Wooden Header Bar */}
      <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <BookOpen size={20} color={colors.accent} />
        <Text style={[styles.shelfTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('app.shelfOverview')}
        </Text>
      </View>

      {/* 3D Book Spines Collection */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.spinesListContent}
      >
        {navItems.map((item) => {
          const isSelected = selectedCategory === item.id;
          const displayTitle = item.titleKey.startsWith('app.') ? t(item.titleKey) : item.titleKey;
          const displaySub = item.subtitleKey && item.subtitleKey.startsWith('app.') ? t(item.subtitleKey) : item.subtitleKey;

          return (
            <Tooltip key={item.id} content={displayTitle} position="right">
              <TouchableOpacity
                style={[
                  styles.spine3DCard,
                  { backgroundColor: item.color },
                  isSelected && styles.spine3DCardSelected,
                  { flexDirection: isRTL ? 'row-reverse' : 'row' },
                ]}
                onPress={() => onSelectCategory(item.id)}
                activeOpacity={0.88}
                accessibilityRole="button"
                accessibilityLabel={displayTitle}
                accessibilityState={{ selected: isSelected }}
              >
                {/* Spine 3D Left Edge Shadow & Ribbing */}
                <View style={styles.spineRibEdge} />
                <View style={styles.spineGoldFoil} />

                {/* Book Spine Icon & Content */}
                <View style={styles.spineItemIcon}>{renderCategoryIcon(item.id)}</View>
                <View style={[styles.spineTextCol, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                  <Text style={[styles.spineTitleText, { textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                    {displayTitle}
                  </Text>
                  {displaySub && (
                    <Text style={[styles.spineSubText, { textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                      {displaySub}
                    </Text>
                  )}
                </View>

                {/* Active Golden Bookmark Ribbon Indicator */}
                {isSelected && (
                  <View style={styles.activeRibbonBookmark}>
                    <Star size={11} color={colors.primaryDark} fill={colors.primaryDark} />
                  </View>
                )}
              </TouchableOpacity>
            </Tooltip>
          );
        })}
      </ScrollView>

      {/* Real Handcrafted Wooden Shelf Platform */}
      <View style={styles.woodenPlatform}>
        <View style={styles.platformLedge} />
        <View style={styles.woodTextureLine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shelfContainer: {
    width: 280,
    backgroundColor: '#321C14', // Rich mahogany / dark walnut wood
    borderRadius: layout.borderRadius.xl,
    padding: 16,
    ...shadows.lg,
    borderWidth: 2,
    borderColor: '#523223',
    position: 'relative',
  },
  shelfContainerCompact: {
    width: '100%',
  },
  headerRow: {
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#523223',
    paddingBottom: 12,
    marginBottom: 16,
  },
  shelfTitle: {
    color: '#E8D8C8',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    flex: 1,
  },
  spinesListContent: {
    gap: 12,
    paddingBottom: 8,
  },
  spine3DCard: {
    borderRadius: layout.borderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
    position: 'relative',
    overflow: 'hidden',
    borderLeftWidth: 5,
    borderLeftColor: 'rgba(255, 255, 255, 0.45)',
    ...shadows.md,
    transform: Platform.OS === 'web' ? ([{ perspective: 400 }, { rotateY: '-4deg' }] as any) : [],
  },
  spine3DCardSelected: {
    borderColor: colors.accent,
    borderWidth: 2,
    borderLeftWidth: 7,
    borderLeftColor: colors.accentLight,
    transform: Platform.OS === 'web' ? ([{ perspective: 400 }, { rotateY: '0deg' }, { scale: 1.03 }] as any) : [{ scale: 1.03 }],
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  spineRibEdge: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  spineGoldFoil: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 12,
    width: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
  },
  spineItemIcon: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spineTextCol: {
    flex: 1,
  },
  spineTitleText: {
    color: colors.textLight,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  spineSubText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  activeRibbonBookmark: {
    position: 'absolute',
    top: -2,
    right: 8,
    backgroundColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  woodenPlatform: {
    marginTop: 12,
    height: 14,
    backgroundColor: '#1E100B',
    borderRadius: layout.borderRadius.sm,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  platformLedge: {
    height: 3,
    backgroundColor: colors.accent,
    opacity: 0.6,
    borderRadius: 2,
  },
  woodTextureLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 3,
  },
});
