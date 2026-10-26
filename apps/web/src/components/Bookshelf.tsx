import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { EDUCATION_LEVELS, EducationLevel } from '../mock/data';
import { useLanguage } from '../context/LanguageContext';
import { colors, layout, shadows, typography } from '../theme/tokens';

interface BookshelfProps {
  selectedLevel: string | null;
  onSelectLevel: (levelId: string | null) => void;
  booksCountByLevel?: Record<string, number>;
}

export const Bookshelf: React.FC<BookshelfProps> = ({
  selectedLevel,
  onSelectLevel,
  booksCountByLevel = {},
}) => {
  const { language, isRTL, t } = useLanguage();

  return (
    <View style={styles.libraryMenuContainer}>
      <View style={[styles.menuHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={styles.menuHeaderIcon}>📚</Text>
        <Text style={[styles.menuTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('app.allLevels')}
        </Text>
      </View>

      {/* Stacked Level Books / Volume Spines */}
      <View style={styles.shelfStack}>
        {/* All Levels Option */}
        <TouchableOpacity
          style={[
            styles.bookVolumeCard,
            selectedLevel === null && styles.bookVolumeSelected,
            { backgroundColor: colors.primary },
          ]}
          onPress={() => onSelectLevel(null)}
          activeOpacity={0.85}
        >
          <View style={styles.spineRibbon} />
          <View style={styles.volumeContent}>
            <Text style={styles.volumeTitle}>{t('app.allLevels')}</Text>
            <Text style={styles.volumeSub}>جميع المستويات التعليمية</Text>
          </View>
          {selectedLevel === null && (
            <View style={styles.openTag}>
              <Text style={styles.openTagText}>مفتوح</Text>
            </View>
          )}
        </TouchableOpacity>

        {EDUCATION_LEVELS.map((level) => {
          const title = level.title[language] || level.title.ar;
          const subtitle = level.subTitle[language] || level.subTitle.ar;
          const isSelected = selectedLevel === level.id;
          const count = booksCountByLevel[level.id] || 0;

          return (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.bookVolumeCard,
                isSelected && styles.bookVolumeSelected,
                { backgroundColor: level.spineColor },
              ]}
              onPress={() => onSelectLevel(level.id)}
              activeOpacity={0.85}
            >
              {/* Gold Spine Trim */}
              <View style={styles.goldSpineBand} />
              <View style={styles.volumeContent}>
                <View style={[styles.titleRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Text style={styles.volumeTitle}>{title}</Text>
                  {count > 0 && (
                    <Text style={styles.bookCountBadge}>{count} كتب</Text>
                  )}
                </View>
                <Text style={styles.volumeSub}>{subtitle}</Text>
              </View>

              {isSelected && (
                <View style={styles.openTag}>
                  <Text style={styles.openTagText}>📖 مفتوح</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  libraryMenuContainer: {
    width: '100%',
    backgroundColor: '#27170B', // Dark rich oak wood finish
    borderRadius: layout.borderRadius.xl,
    padding: 16,
    ...shadows.lg,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  menuHeader: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  menuHeaderIcon: {
    fontSize: 20,
  },
  menuTitle: {
    color: '#F0E6D2',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  shelfStack: {
    gap: 10,
  },
  bookVolumeCard: {
    borderRadius: layout.borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    borderLeftWidth: 6,
    borderLeftColor: 'rgba(255, 255, 255, 0.4)',
    ...shadows.md,
  },
  bookVolumeSelected: {
    borderLeftColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.accent,
    transform: [{ scale: 1.02 }],
  },
  goldSpineBand: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 10,
    width: 4,
    backgroundColor: 'rgba(212, 175, 55, 0.4)',
  },
  spineRibbon: {
    position: 'absolute',
    left: 8,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.accent,
  },
  volumeContent: {
    flex: 1,
  },
  titleRow: {
    alignItems: 'center',
    gap: 8,
  },
  volumeTitle: {
    color: colors.textLight,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  volumeSub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  bookCountBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    color: colors.accentLight,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: layout.borderRadius.full,
  },
  openTag: {
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: layout.borderRadius.sm,
    marginLeft: 8,
  },
  openTagText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
});
