import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  AccessibilityInfo,
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
} from 'lucide-react-native';
import { colors, layout, shadows, typography } from '../theme/tokens';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';

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
      {/* Section Header */}
      <View style={[styles.sectionHeader, { alignItems: isRTL ? 'flex-start' : 'flex-end' }]}>
        <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }]}>
          <Newspaper size={24} color={colors.accent} />
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('app.articlesGalleryTitle')}
          </Text>
        </View>
        <Text style={[styles.sectionSub, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('app.articlesGallerySub')}
        </Text>
      </View>

      {/* Horizontally Arranged Curved 3D Lookbook Stage */}
      <View style={styles.perspectiveStage}>
        {/* Curved Row of Image Cards */}
        <View style={styles.cardsRowWrapper}>
          {articles.map((article, idx) => {
            const isFocal = idx === selectedIndex;
            const title = article.title[language] || article.title.ar;
            const category = article.category[language] || article.category.ar;

            // Offset relative to active index
            const offset = idx - selectedIndex;
            const absOffset = Math.abs(offset);

            if (absOffset > 2) return null;

            // 3D Perspective layout values
            const rotateY = offset * -18;
            const translateX = offset * 140;
            const scale = 1 - absOffset * 0.16;
            const opacity = 1 - absOffset * 0.3;
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
                          { perspective: 850 },
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

                {/* Card Gradient Overlay */}
                <View style={styles.cardOverlay}>
                  <Text style={styles.categoryBadge}>{category}</Text>
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

                {isFocal && <View style={styles.focalGoldHighlight} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Expanded Story Panel Revealing Active Article Details */}
      {activeArticle && (
        <View style={styles.expandedStoryPanel}>
          <View style={[styles.storyHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={styles.storyContentCol}>
              <Text style={styles.storyCategory}>
                {activeArticle.category[language] || activeArticle.category.ar}
              </Text>
              <Text style={[styles.storyTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                {activeArticle.title[language] || activeArticle.title.ar}
              </Text>
              <Text style={[styles.storyExcerpt, { textAlign: isRTL ? 'right' : 'left' }]}>
                {activeArticle.excerpt[language] || activeArticle.excerpt.ar}
              </Text>
            </View>

            <View style={styles.storyActionCol}>
              <Button
                title={t('app.readArticle')}
                icon={<BookOpen size={18} color={colors.textLight} />}
                tooltip={t('app.readArticle')}
                onPress={() => setExpandedArticle(activeArticle)}
                variant="primary"
                size="md"
              />
            </View>
          </View>
        </View>
      )}

      {/* Full Article Modal Reader Overlay */}
      {expandedArticle && (
        <View style={styles.readerModalOverlay} accessibilityViewIsModal aria-modal={true}>
          <View style={styles.readerContainer}>
            <View style={[styles.readerHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={styles.readerCategory}>
                {expandedArticle.category[language] || expandedArticle.category.ar}
              </Text>
              <Tooltip content={t('app.closeArticle')}>
                <TouchableOpacity
                  style={[styles.closeBtn, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}
                  onPress={() => setExpandedArticle(null)}
                  accessibilityLabel={t('app.closeArticle')}
                  accessibilityRole="button"
                  activeOpacity={0.8}
                >
                  <X size={16} color={colors.textLight} />
                  <Text style={styles.closeBtnText}>{t('app.closeArticle')}</Text>
                </TouchableOpacity>
              </Tooltip>
            </View>

            <ScrollView contentContainerStyle={styles.readerScrollBody}>
              <Text style={[styles.readerTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                {expandedArticle.title[language] || expandedArticle.title.ar}
              </Text>

              <View style={[styles.readerMetaRow, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }]}>
                <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }]}>
                  <User size={14} color={colors.primary} />
                  <Text style={styles.readerMetaText}>{expandedArticle.author}</Text>
                </View>
                <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }]}>
                  <Calendar size={14} color={colors.primary} />
                  <Text style={styles.readerMetaText}>{expandedArticle.date}</Text>
                </View>
                <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }]}>
                  <Clock size={14} color={colors.primary} />
                  <Text style={styles.readerMetaText}>{expandedArticle.readTime}</Text>
                </View>
              </View>

              <Image source={{ uri: expandedArticle.coverUrl }} style={styles.readerImage} resizeMode="cover" />

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
  sectionContainer: {
    marginVertical: 20,
    width: '100%',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  sectionSub: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
    marginTop: 4,
  },
  perspectiveStage: {
    height: 310,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    overflow: 'hidden',
  },
  cardsRowWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lookbookCard: {
    position: 'absolute',
    width: 230,
    height: 270,
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
    shadowOpacity: 0.28,
    shadowRadius: 16,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(10, 35, 25, 0.88)',
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
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 16,
  },
  metaRow: {
    marginTop: 6,
    gap: 12,
  },
  metaText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
  },
  focalGoldHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.accent,
  },
  expandedStoryPanel: {
    backgroundColor: colors.cardBg,
    borderRadius: layout.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
    marginTop: 12,
  },
  storyHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  storyContentCol: {
    flex: 1,
    minWidth: 240,
  },
  storyCategory: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 4,
  },
  storyTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  storyExcerpt: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    marginTop: 4,
    lineHeight: 18,
  },
  storyActionCol: {
    justifyContent: 'center',
  },
  readerModalOverlay: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 35, 25, 0.88)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  readerContainer: {
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
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: layout.borderRadius.full,
  },
  closeBtnText: {
    color: colors.textLight,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  readerScrollBody: {
    padding: 24,
  },
  readerTitle: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 32,
  },
  readerMetaRow: {
    marginVertical: 14,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
  },
  readerMetaText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
  },
  readerImage: {
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
