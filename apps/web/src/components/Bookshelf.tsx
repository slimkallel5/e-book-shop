import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import {
  BookOpen,
  Library,
  GraduationCap,
  Compass,
  Gift,
  Newspaper,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { EDUCATION_LEVELS } from '../mock/data';
import { useLanguage } from '../context/LanguageContext';
import { colors, layout, shadows, typography } from '../theme/tokens';
import { Tooltip } from './ui/Tooltip';
import { GlassCard } from './ui/GlassCard';

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
    const iconColor = isSelected ? colors.primaryDark : colors.accentLight;
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
    <GlassCard
      variant="dark"
      elevation="lg"
      style={[styles.shelfContainer, isCompact && styles.shelfContainerCompact]}
    >
      {/* 3D Shelf Header */}
      <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.headerIconContainer}>
          <BookOpen size={18} color={colors.accentLight} />
        </View>
        <Text style={[styles.shelfTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('app.shelfOverview')}
        </Text>
        <Sparkles size={16} color={colors.accent} />
      </View>

      {/* 3D Isometric Book Spines Menu */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.spinesListContent}
      >
        {navItems.map((item, index) => {
          const isSelected = selectedCategory === item.id;
          const displayTitle = item.titleKey.startsWith('app.') ? t(item.titleKey) : item.titleKey;
          const displaySub = item.subtitleKey && item.subtitleKey.startsWith('app.') ? t(item.subtitleKey) : item.subtitleKey;

          return (
            <Tooltip key={item.id} content={displayTitle} position={isRTL ? 'left' : 'right'}>
              <TouchableOpacity
                style={[
                  styles.spineCard3D,
                  isSelected && styles.spineCard3DSelected,
                  { flexDirection: isRTL ? 'row-reverse' : 'row' },
                ]}
                onPress={() => onSelectCategory(item.id)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={displayTitle}
                accessibilityState={{ selected: isSelected }}
              >
                {/* 3D Spine Colored Rim & Binding Ridge */}
                <View
                  style={[
                    styles.spineRidge,
                    isRTL ? styles.spineRidgeRtl : styles.spineRidgeLtr,
                    { backgroundColor: item.color },
                  ]}
                />

                {/* Level / Category Icon Badge */}
                <View
                  style={[
                    styles.categoryIconBadge,
                    isSelected && styles.categoryIconBadgeSelected,
                  ]}
                >
                  {renderCategoryIcon(item.id, isSelected)}
                </View>

                {/* Spine Title & Subtitle Labels */}
                <View style={[styles.spineTextContainer, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                  <Text
                    style={[
                      styles.spineTitle,
                      isSelected && styles.spineTitleSelected,
                      { textAlign: isRTL ? 'right' : 'left' },
                    ]}
                    numberOfLines={1}
                  >
                    {displayTitle}
                  </Text>
                  {displaySub && (
                    <Text
                      style={[
                        styles.spineSubtitle,
                        isSelected && styles.spineSubtitleSelected,
                        { textAlign: isRTL ? 'right' : 'left' },
                      ]}
                      numberOfLines={1}
                    >
                      {displaySub}
                    </Text>
                  )}
                </View>

                {/* Selection Pointer indicator */}
                {isSelected ? (
                  <View style={styles.activeGlowIndicator}>
                    <Sparkles size={14} color={colors.primaryDark} />
                  </View>
                ) : (
                  <View style={styles.idleArrow}>
                    {isRTL ? (
                      <ChevronLeft size={16} color="rgba(255, 255, 255, 0.3)" />
                    ) : (
                      <ChevronRight size={16} color="rgba(255, 255, 255, 0.3)" />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            </Tooltip>
          );
        })}
      </ScrollView>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  shelfContainer: {
    width: 280,
    borderRadius: layout.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.35)',
    ...shadows.lg,
  },
  shelfContainerCompact: {
    width: '100%',
  },
  headerRow: {
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 193, 88, 0.25)',
    paddingBottom: 14,
    marginBottom: 14,
  },
  headerIconContainer: {
    width: 34,
    height: 34,
    borderRadius: layout.borderRadius.md,
    backgroundColor: 'rgba(229, 193, 88, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.3)',
  },
  shelfTitle: {
    color: '#ffffff',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    flex: 1,
  },
  spinesListContent: {
    gap: 10,
    paddingBottom: 4,
  },
  spineCard3D: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: layout.borderRadius.lg,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  spineCard3DSelected: {
    backgroundColor: 'rgba(229, 193, 88, 0.22)',
    borderColor: colors.accent,
    ...shadows.goldGlow,
  },
  spineRidge: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 5,
  },
  spineRidgeLtr: {
    left: 0,
  },
  spineRidgeRtl: {
    right: 0,
  },
  categoryIconBadge: {
    width: 34,
    height: 34,
    borderRadius: layout.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconBadgeSelected: {
    backgroundColor: colors.accent,
    ...shadows.sm,
  },
  spineTextContainer: {
    flex: 1,
  },
  spineTitle: {
    color: '#ffffff',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  spineTitleSelected: {
    color: colors.accentLight,
  },
  spineSubtitle: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  spineSubtitleSelected: {
    color: 'rgba(255, 255, 255, 0.95)',
  },
  activeGlowIndicator: {
    width: 24,
    height: 24,
    borderRadius: layout.borderRadius.full,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  idleArrow: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
