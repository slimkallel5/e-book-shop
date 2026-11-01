import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { MOCK_ARTICLES, Article } from '../mock/data';
import { useLanguage } from '../context/LanguageContext';
import {
  Newspaper,
  User,
  Clock,
  Calendar,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { colors, layout, shadows, typography } from '../theme/tokens';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';
import { GlassCard } from './ui/GlassCard';

interface ArticleLookbookGalleryProps {
  articles?: Article[];
}

export const ArticleLookbookGallery: React.FC<ArticleLookbookGalleryProps> = ({
  articles = MOCK_ARTICLES,
}) => {
  const { language, isRTL, t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [expandedArticle, setExpandedArticle] = useState<Article | null>(null);

  if (!articles || articles.length === 0) {
    return null;
  }

  const activeArticle = articles[selectedIndex] || articles[0];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % articles.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  // Keyboard accessibility handler for Web
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (expandedArticle) {
        if (e.key === 'Escape') {
          setExpandedArticle(null);
        }
        return;
      }

      if (e.key === 'ArrowRight') {
        isRTL ? handlePrev() : handleNext();
      } else if (e.key === 'ArrowLeft') {
        isRTL ? handleNext() : handlePrev();
      } else if (e.key === 'Enter' || e.key === ' ') {
        setExpandedArticle(activeArticle);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, expandedArticle, isRTL, activeArticle]);

  return (
    <View style={styles.sectionContainer}>
      {/* 3D Glass Header */}
      <GlassCard variant="dark" elevation="sm" style={styles.sectionHeader}>
        <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }]}>
          <View style={styles.iconBadge}>
            <Newspaper size={22} color={colors.primaryDark} />
          </View>
          <View style={styles.headerTextGroup}>
            <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('app.articlesGalleryTitle')}
            </Text>
            <Text style={[styles.sectionSub, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('app.articlesGallerySub')}
            </Text>
          </View>
        </View>
      </GlassCard>

      {/* 3D Curved Perspective Carousel Stage */}
      <View style={styles.perspectiveStage}>
        {/* Navigation Arrows */}
        <TouchableOpacity
          style={[styles.navArrow, styles.navArrowLeft]}
          onPress={isRTL ? handleNext : handlePrev}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={isRTL ? t('app.nextPage') : t('app.prevPage')}
        >
          {isRTL ? <ChevronRight size={22} color={colors.accentLight} /> : <ChevronLeft size={22} color={colors.accentLight} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navArrow, styles.navArrowRight]}
          onPress={isRTL ? handlePrev : handleNext}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={isRTL ? t('app.prevPage') : t('app.nextPage')}
        >
          {isRTL ? <ChevronLeft size={22} color={colors.accentLight} /> : <ChevronRight size={22} color={colors.accentLight} />}
        </TouchableOpacity>

        {/* 3D Carousel Cards */}
        <View style={styles.cardsRowWrapper}>
          {articles.map((article, idx) => {
            const isFocal = idx === selectedIndex;
            const title = article.title[language] || article.title.ar;
            const category = article.category[language] || article.category.ar;

            const offset = idx - selectedIndex;
            const absOffset = Math.abs(offset);

            if (absOffset > 2) return null;

            const rotateY = offset * -22;
            const translateX = offset * 155;
            const scale = 1 - absOffset * 0.16;
            const opacity = 1 - absOffset * 0.28;
            const zIndex = 10 - absOffset;

            return (
              <TouchableOpacity
                key={article.id}
                style={[
                  styles.lookbookCard3D,
                  isFocal && styles.lookbookCard3DFocal,
                  {
                    zIndex,
                    opacity,
                    transform: Platform.OS === 'web'
                      ? ([
                          { perspective: 1000 },
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
                accessibilityRole="button"
                accessibilityState={{ selected: isFocal }}
                accessibilityLabel={title}
                activeOpacity={0.9}
              >
                <Image source={{ uri: article.coverUrl }} style={styles.cardImage} resizeMode="cover" />

                {/* 3D Shimmer Overlay */}
                <View style={styles.cardOverlayGradient}>
                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryPillText}>{category}</Text>
                  </View>
                  <Text style={[styles.cardTitle, { textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={2}>
                    {title}
                  </Text>
                  <View style={[styles.metaRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }]}>
                      <Clock size={12} color={colors.accentLight} />
                      <Text style={styles.metaText}>{article.readTime}</Text>
                    </View>
                    <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }]}>
                      <User size={12} color={colors.accentLight} />
                      <Text style={styles.metaText}>{article.author}</Text>
                    </View>
                  </View>
                </View>

                {isFocal && <View style={styles.focalGoldTrim} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Expanded Story Summary Card */}
      {activeArticle && (
        <GlassCard variant="dark" elevation="md" style={styles.storyCard}>
          <View style={[styles.storyCardInner, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={styles.storyTextContent}>
              <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginBottom: 4 }]}>
                <Sparkles size={14} color={colors.accent} />
                <Text style={styles.storyCategoryLabel}>
                  {activeArticle.category[language] || activeArticle.category.ar}
                </Text>
              </View>
              <Text style={[styles.storyHeading, { textAlign: isRTL ? 'right' : 'left' }]}>
                {activeArticle.title[language] || activeArticle.title.ar}
              </Text>
              <Text style={[styles.storyExcerpt, { textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={3}>
                {activeArticle.excerpt[language] || activeArticle.excerpt.ar}
              </Text>
            </View>

            <View style={styles.storyActionWrap}>
              <Button
                title={t('app.readArticle')}
                icon={<BookOpen size={18} color={colors.primaryDark} />}
                tooltip={t('app.readArticle')}
                onPress={() => setExpandedArticle(activeArticle)}
                variant="accent"
                size="md"
              />
            </View>
          </View>
        </GlassCard>
      )}

      {/* Full Modal Reader */}
      {expandedArticle && (
        <View style={styles.readerModalOverlay} accessibilityViewIsModal aria-modal={true}>
          <GlassCard variant="dark" elevation="lg" style={styles.readerContainer}>
            <View style={[styles.readerHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={styles.readerCategoryText}>
                {expandedArticle.category[language] || expandedArticle.category.ar}
              </Text>
              <Tooltip content={t('app.closeArticle')}>
                <TouchableOpacity
                  style={[styles.closeReaderBtn, { flexDirection: 'row', alignItems: 'center', gap: 6 }]}
                  onPress={() => setExpandedArticle(null)}
                  accessibilityLabel={t('app.closeArticle')}
                  accessibilityRole="button"
                  activeOpacity={0.8}
                >
                  <X size={16} color={colors.textLight} />
                  <Text style={styles.closeReaderText}>{t('app.closeArticle')}</Text>
                </TouchableOpacity>
              </Tooltip>
            </View>

            <ScrollView contentContainerStyle={styles.readerScrollBody}>
              <Text style={[styles.readerHeadline, { textAlign: isRTL ? 'right' : 'left' }]}>
                {expandedArticle.title[language] || expandedArticle.title.ar}
              </Text>

              <View style={[styles.readerMetaBar, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 14 }]}>
                <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }]}>
                  <User size={14} color={colors.accentLight} />
                  <Text style={styles.readerMetaVal}>{expandedArticle.author}</Text>
                </View>
                <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }]}>
                  <Calendar size={14} color={colors.accentLight} />
                  <Text style={styles.readerMetaVal}>{expandedArticle.date}</Text>
                </View>
                <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }]}>
                  <Clock size={14} color={colors.accentLight} />
                  <Text style={styles.readerMetaVal}>{expandedArticle.readTime}</Text>
                </View>
              </View>

              <Image source={{ uri: expandedArticle.coverUrl }} style={styles.readerCoverBanner} resizeMode="cover" />

              <Text style={[styles.readerArticleText, { textAlign: isRTL ? 'right' : 'left' }]}>
                {expandedArticle.content[language] || expandedArticle.content.ar}
              </Text>
            </ScrollView>
          </GlassCard>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 18,
    width: '100%',
  },
  sectionHeader: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.3)',
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: layout.borderRadius.md,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.goldGlow,
  },
  headerTextGroup: {
    flex: 1,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  sectionSub: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: typography.fontSize.sm,
    marginTop: 2,
  },
  perspectiveStage: {
    height: 330,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    overflow: 'hidden',
  },
  navArrow: {
    position: 'absolute',
    top: '42%',
    width: 42,
    height: 42,
    borderRadius: layout.borderRadius.full,
    backgroundColor: 'rgba(10, 32, 23, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    ...shadows.md,
  },
  navArrowLeft: {
    left: 14,
  },
  navArrowRight: {
    right: 14,
  },
  cardsRowWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lookbookCard3D: {
    position: 'absolute',
    width: 240,
    height: 290,
    borderRadius: layout.borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: 'rgba(12, 38, 28, 0.95)',
    ...shadows.lg,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.3)',
  },
  lookbookCard3DFocal: {
    borderColor: colors.accent,
    borderWidth: 2,
    ...shadows.goldGlow,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlayGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    backgroundColor: 'rgba(7, 24, 17, 0.92)',
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(229, 193, 88, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.4)',
    marginBottom: 6,
  },
  categoryPillText: {
    color: colors.accentLight,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 18,
  },
  metaRow: {
    marginTop: 8,
    gap: 12,
  },
  metaText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
  },
  focalGoldTrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: colors.accent,
  },
  storyCard: {
    padding: 18,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.35)',
  },
  storyCardInner: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  storyTextContent: {
    flex: 1,
    minWidth: 260,
  },
  storyCategoryLabel: {
    color: colors.accentLight,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  storyHeading: {
    color: '#ffffff',
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 6,
  },
  storyExcerpt: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  storyActionWrap: {
    justifyContent: 'center',
  },
  readerModalOverlay: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 18, 12, 0.92)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  readerContainer: {
    width: '100%',
    maxWidth: 820,
    maxHeight: '90%',
    borderRadius: layout.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.4)',
  },
  readerHeader: {
    paddingHorizontal: 22,
    paddingVertical: 16,
    backgroundColor: 'rgba(12, 38, 28, 0.96)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 193, 88, 0.3)',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readerCategoryText: {
    color: colors.accentLight,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
  },
  closeReaderBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: layout.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeReaderText: {
    color: '#ffffff',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  readerScrollBody: {
    padding: 24,
  },
  readerHeadline: {
    color: '#ffffff',
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 34,
  },
  readerMetaBar: {
    marginVertical: 14,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 193, 88, 0.25)',
    paddingBottom: 12,
  },
  readerMetaVal: {
    color: colors.accentLight,
    fontSize: typography.fontSize.xs,
  },
  readerCoverBanner: {
    width: '100%',
    height: 250,
    borderRadius: layout.borderRadius.lg,
    marginVertical: 16,
  },
  readerArticleText: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: typography.fontSize.md,
    lineHeight: 28,
  },
});
