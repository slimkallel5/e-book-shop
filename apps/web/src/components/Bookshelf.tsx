import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { EDUCATION_LEVELS, EducationLevel } from '../mock/data';
import { useLanguage } from '../context/LanguageContext';
import { colors, layout, shadows, typography } from '../theme/tokens';

interface BookshelfProps {
  selectedLevel: string | null;
  onSelectLevel: (levelId: string | null) => void;
}

export const Bookshelf: React.FC<BookshelfProps> = ({ selectedLevel, onSelectLevel }) => {
  const { language, isRTL, t } = useLanguage();

  return (
    <View style={styles.shelfContainer}>
      <Text style={[styles.shelfTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
        📚 {t('app.allLevels')}
      </Text>

      {/* Reset / All Levels Option */}
      <TouchableOpacity
        style={[
          styles.spineCard,
          selectedLevel === null && styles.spineCardSelected,
          { backgroundColor: colors.primaryDark },
        ]}
        onPress={() => onSelectLevel(null)}
        activeOpacity={0.85}
      >
        <View style={styles.spineRibbon} />
        <Text style={styles.spineText}>{t('app.allLevels')}</Text>
      </TouchableOpacity>

      {/* Shelf Levels list as 3D-styled Book Spines */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {EDUCATION_LEVELS.map((level) => {
          const title = level.title[language] || level.title.ar;
          const subtitle = level.subTitle[language] || level.subTitle.ar;
          const isSelected = selectedLevel === level.id;

          return (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.spineCard,
                isSelected && styles.spineCardSelected,
                { backgroundColor: level.spineColor },
              ]}
              onPress={() => onSelectLevel(level.id)}
              activeOpacity={0.85}
            >
              <View style={styles.spineGoldAccent} />
              <View style={styles.spineContent}>
                <Text style={styles.spineText}>{title}</Text>
                <Text style={styles.spineSubText}>{subtitle}</Text>
              </View>
              {isSelected && <Text style={styles.activeIndicator}>▶</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Wooden Shelf Base Visual Effect */}
      <View style={styles.woodenBase}>
        <View style={styles.woodenGrain} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shelfContainer: {
    width: 260,
    backgroundColor: '#3E2723', // Deep rich walnut wood color
    borderRadius: layout.borderRadius.xl,
    padding: 16,
    ...shadows.lg,
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: '#5D4037',
  },
  shelfTitle: {
    color: '#D7CCC8',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#5D4037',
    paddingBottom: 8,
  },
  spineCard: {
    borderRadius: layout.borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    borderLeftWidth: 6,
    borderLeftColor: 'rgba(255, 255, 255, 0.4)',
    ...shadows.md,
  },
  spineCardSelected: {
    transform: [{ scale: 1.03 }],
    borderLeftColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.accentLight,
  },
  spineGoldAccent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 8,
    width: 3,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  spineRibbon: {
    position: 'absolute',
    left: 8,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.accent,
  },
  spineContent: {
    flex: 1,
  },
  spineText: {
    color: colors.textLight,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  spineSubText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  activeIndicator: {
    color: colors.accent,
    fontSize: 14,
    marginLeft: 6,
  },
  woodenBase: {
    height: 12,
    backgroundColor: '#27170B',
    borderRadius: layout.borderRadius.sm,
    marginTop: 8,
  },
  woodenGrain: {
    height: 2,
    backgroundColor: '#1A0E07',
    marginTop: 5,
  },
});
