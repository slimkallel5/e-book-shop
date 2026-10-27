import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { MOCK_ARTICLES, Article } from '../mock/data';
import { useLanguage } from '../context/LanguageContext';
import { colors, layout, shadows, typography } from '../theme/tokens';
import { Button } from './ui/Button';

export const ArticleGallery: React.FC = () => {
  const { language, isRTL, t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [expandedArticle, setExpandedArticle] = useState<Article | null>(null);

  const activeArticle = MOCK_ARTICLES[selectedIndex] || MOCK_ARTICLES[0];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % MOCK_ARTICLES.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + MOCK_ARTICLES.length) % MOCK_ARTICLES.length);
  };

  return (
    <View style={styles.gallerySection}>
      {/* Gallery Header */}
      <View style={[styles.sectionHeader, { alignItems: isRTL ? 'flex-start' : 'flex-end' }]}>
        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('app.articlesGalleryTitle')}
        </Text>
        <Text style={[styles.sectionSub, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('app.articlesGallerySub')}
        </Text>
      </View>

      {/* Perspective Arc Gallery Carousel Stage */}
      <View style={styles.perspectiveStage}>
        {/* Navigation Arrows */}
        <TouchableOpacity
          style={[styles.stageArrow, styles.arrowLeft]}
          onPress={isRTL ? handleNext : handlePrev}
          activeOpacity={0.8}
        >
          <Text style={styles.arrowText}>{isRTL ? '▶' : '◀'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.stageArrow, styles.arrowRight]}
          onPress={isRTL ? handlePrev : handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.arrowText}>{isRTL ? '◀' : '▶'}</Text>
        </TouchableOpacity>

        {/* 3D Arc Arranged Article Cards */}
        <View style={styles.cardsArcWrapper}>
          {MOCK_ARTICLES.map((article, idx) => {
            const isFocal = idx === selectedIndex;
            const title = article.title[language] || article.title.ar;
            const cat = article.category[language] || article.category.ar;

            // Calculate offset relative to active item
            const offset = idx - selectedIndex;
            const absOffset = Math.abs(offset);

            if (absOffset > 2) return null; // Only show focal item and immediate neighbors

            // Perspective positioning values
            const rotateY = offset * -18; // Degrees curved
            const translateX = offset * 140; // Horizontal offset
            const scale = 1 - absOffset * 0.18; // Depth scaling
            const opacity = 1 - absOffset * 0.35; // Depth opacity
            const zIndex = 10 - absOffset;

            return (
              <TouchableOpacity
                key={article.id}
                style={[
                  styles.lookbookCard,
                  isFocal && styles.lookbookCardFocal,
                  {
                    zIndex,
                    opacity,
                    transform: Platform.OS === 'web'
                      ? ([
                          { perspective: 800 },
                          { translateX },
                          { scale },
                          { rotateY: `${rotateY}deg` },
                        ] as any)
                      : [{ scale }],
                  },
                ]}
                onPress={() => {
                  if (isFocal) {
                    setExpandedArticle(article);
                  } else {
                    setSelectedIndex(idx);
                  }
                }}
                activeOpacity={0.9}
              >
                {/* Cover Image */}
                <Image source={{ uri: article.coverUrl }} style={styles.cardImage} resizeMode="cover" />

                {/* Card Gradient Overlay */}
                <View style={styles.cardGradient}>
                  <Text style={styles.categoryBadge}>{cat}</Text>
                  <Text style={[styles.cardTitle, { textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={2}>
                    {title}
                  </Text>
                  <View style={[styles.metaRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Text style={styles.metaText}>👤 {article.author}</Text>
                    <Text style={styles.metaText}>⏱ {article.readTime}</Text>
                  </View>
                </View>

                {/* Golden Reveal Edge Frame */}
                {isFocal && <View style={styles.focalGoldBorder} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Selected Focal Reveal Detail Drawer / Modal Panel */}
      <View style={styles.revealDetailCard}>
        <View style={[styles.detailHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={styles.detailInfoCol}>
            <Text style={styles.detailCategory}>
              {activeArticle.category[language] || activeArticle.category.ar}
            </Text>
            <Text style={[styles.detailTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {activeArticle.title[language] || activeArticle.title.ar}
            </Text>
            <Text style={[styles.detailExcerpt, { textAlign: isRTL ? 'right' : 'left' }]}>
              {activeArticle.excerpt[language] || activeArticle.excerpt.ar}
            </Text>
          </View>

          <View style={styles.detailActionCol}>
            <Button
              title={t('app.readArticle')}
              onPress={() => setExpandedArticle(activeArticle)}
              variant="primary"
              size="md"
            />
          </View>
        </View>
      </View>

      {/* Expanded Full Article Reader Overlay */}
      {expandedArticle && (
        <View style={styles.readerOverlay}>
          <View style={styles.readerModal}>
            <View style={[styles.readerHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={styles.readerCategory}>
                {expandedArticle.category[language] || expandedArticle.category.ar}
              </Text>
              <TouchableOpacity
                style={styles.readerCloseBtn}
                onPress={() => setExpandedArticle(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.readerCloseText}>✕ {t('app.closeArticle')}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.readerContent}>
              <Text style={[styles.readerTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                {expandedArticle.title[language] || expandedArticle.title.ar}
              </Text>

              <View style={[styles.readerMetaBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.readerMeta}>✍️ {expandedArticle.author}</Text>
                <Text style={styles.readerMeta}>📅 {expandedArticle.date}</Text>
                <Text style={styles.readerMeta}>⏱ {expandedArticle.readTime}</Text>
              </View>

              <Image source={{ uri: expandedArticle.coverUrl }} style={styles.readerCoverImage} resizeMode="cover" />

              <Text style={[styles.readerBodyText, { textAlign: isRTL ? 'right' : 'left' }]}>
                {expandedArticle.content[language] || expandedArticle.content.ar}
              </Text>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gallerySection: {
    marginVertical: 24,
    width: '100%',
  },
  sectionHeader: {
    marginBottom: 20,
  },
  badgeRow: {
    backgroundColor: 'rgba(194, 155, 56, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: layout.borderRadius.full,
    marginBottom: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  badgeText: {
    color: colors.secondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  sectionTitle: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
  },
  sectionSub: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginTop: 4,
  },
  perspectiveStage: {
    height: 320,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    overflow: 'hidden',
  },
  stageArrow: {
    position: 'absolute',
    top: '42%',
    backgroundColor: colors.primary,
    width: 42,
    height: 42,
    borderRadius: layout.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    ...shadows.md,
  },
  arrowLeft: {
    left: 12,
  },
  arrowRight: {
    right: 12,
  },
  arrowText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: typography.fontWeight.bold,
  },
  cardsArcWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lookbookCard: {
    position: 'absolute',
    width: 260,
    height: 280,
    borderRadius: layout.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.cardBg,
    ...shadows.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lookbookCardFocal: {
    borderColor: colors.accent,
    borderWidth: 2,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    backgroundColor: 'rgba(10, 35, 25, 0.85)',
  },
  categoryBadge: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardTitle: {
    color: colors.textLight,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 18,
  },
  metaRow: {
    marginTop: 8,
    gap: 12,
  },
  metaText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
  },
  focalGoldBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.accent,
  },
  revealDetailCard: {
    backgroundColor: colors.cardBg,
    borderRadius: layout.borderRadius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
    marginTop: 12,
  },
  detailHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  detailInfoCol: {
    flex: 1,
    minWidth: 240,
  },
  detailCategory: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 4,
  },
  detailTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  detailExcerpt: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginTop: 6,
    lineHeight: 20,
  },
  detailActionCol: {
    justifyContent: 'center',
  },
  readerOverlay: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 35, 25, 0.85)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  readerModal: {
    width: '100%',
    maxWidth: 800,
    maxHeight: '90%',
    backgroundColor: colors.cardBg,
    borderRadius: layout.borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  readerHeader: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.primary,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readerCategory: {
    color: colors.accent,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
  },
  readerCloseBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: layout.borderRadius.full,
  },
  readerCloseText: {
    color: colors.textLight,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  readerContent: {
    padding: 24,
  },
  readerTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 32,
  },
  readerMetaBar: {
    marginVertical: 14,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
  },
  readerMeta: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
  },
  readerCoverImage: {
    width: '100%',
    height: 240,
    borderRadius: layout.borderRadius.md,
    marginVertical: 16,
  },
  readerBodyText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    lineHeight: 28,
  },
});
