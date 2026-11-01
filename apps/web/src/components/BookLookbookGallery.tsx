import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Star,
} from 'lucide-react-native';
import { Book } from '../mock/data';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { colors, layout, shadows, typography } from '../theme/tokens';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Tooltip } from './ui/Tooltip';
import { GlassCard } from './ui/GlassCard';

interface BookLookbookGalleryProps {
  books: Book[];
  onPreviewBook: (book: Book) => void;
}

export const BookLookbookGallery: React.FC<BookLookbookGalleryProps> = ({
  books,
  onPreviewBook,
}) => {
  const { language, isRTL, t } = useLanguage();
  const { addToCart } = useStore();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  if (!books || books.length === 0) {
    return null;
  }

  // Ensure index is within current books bounds
  const activeIndex = selectedIndex >= books.length ? 0 : selectedIndex;
  const activeBook = books[activeIndex];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % books.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + books.length) % books.length);
  };

  return (
    <View style={styles.lookbookSection}>
      {/* 3D Arc Gallery Carousel Stage */}
      <View style={styles.perspectiveStage}>
        {/* Navigation Control Arrows */}
        {books.length > 1 && (
          <>
            <Tooltip content={isRTL ? t('app.nextPage') : t('app.prevPage')}>
              <TouchableOpacity
                style={[styles.stageArrow, styles.arrowLeft]}
                onPress={isRTL ? handleNext : handlePrev}
                activeOpacity={0.8}
                accessibilityLabel={isRTL ? t('app.nextPage') : t('app.prevPage')}
              >
                {isRTL ? (
                  <ChevronRight size={22} color={colors.textLight} />
                ) : (
                  <ChevronLeft size={22} color={colors.textLight} />
                )}
              </TouchableOpacity>
            </Tooltip>

            <Tooltip content={isRTL ? t('app.prevPage') : t('app.nextPage')}>
              <TouchableOpacity
                style={[styles.stageArrow, styles.arrowRight]}
                onPress={isRTL ? handlePrev : handleNext}
                activeOpacity={0.8}
                accessibilityLabel={isRTL ? t('app.prevPage') : t('app.nextPage')}
              >
                {isRTL ? (
                  <ChevronLeft size={22} color={colors.textLight} />
                ) : (
                  <ChevronRight size={22} color={colors.textLight} />
                )}
              </TouchableOpacity>
            </Tooltip>
          </>
        )}

        {/* 3D Arc Arranged Book Cover Cards */}
        <View style={styles.cardsArcWrapper}>
          {books.map((book, idx) => {
            const isFocal = idx === activeIndex;
            const title = book.title[language] || book.title.ar;
            const level = book.levelName[language] || book.levelName.ar;

            // Calculate offset relative to active book
            const offset = idx - activeIndex;
            const absOffset = Math.abs(offset);

            if (absOffset > 2) return null; // Show focal item and 2 neighbors

            // Perspective layout transformations
            const rotateY = offset * -20;
            const translateX = offset * 150;
            const scale = 1 - absOffset * 0.18;
            const opacity = 1 - absOffset * 0.3;
            const zIndex = 10 - absOffset;

            const discountPercent =
              book.discountPrice && book.price > 0
                ? Math.round(((book.price - book.discountPrice) / book.price) * 100)
                : null;

            return (
              <TouchableOpacity
                key={book.id}
                style={[
                  styles.lookbookCard,
                  isFocal && styles.lookbookCardFocal,
                  {
                    zIndex,
                    opacity,
                    transform: Platform.OS === 'web'
                      ? ([
                          { perspective: 900 },
                          { translateX },
                          { scale },
                          { rotateY: `${rotateY}deg` },
                        ] as any)
                      : [{ scale }],
                  },
                ]}
                onPress={() => {
                  setSelectedIndex(idx);
                  onPreviewBook(book);
                }}
                activeOpacity={0.9}
                accessibilityRole="button"
                accessibilityLabel={title}
              >
                <Image source={{ uri: book.coverUrl }} style={styles.coverImage} resizeMode="cover" />

                {/* 3D Spine Edge Overlay */}
                <View style={styles.spine3DEdge} />

                {/* Badges */}
                <View style={[styles.badgeContainer, isRTL ? { right: 8 } : { left: 8 }]}>
                  {book.isPack && <Badge label={t('app.packBadge')} variant="pack" />}
                  {discountPercent && (
                    <Badge label={`-${discountPercent}%`} variant="discount" style={{ marginTop: 4 }} />
                  )}
                </View>

                {/* Bottom Overlay Info */}
                <View style={styles.cardGradient}>
                  <View style={[styles.levelRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <GraduationCap size={12} color={colors.accentLight} />
                    <Text style={styles.levelBadge}>{level}</Text>
                  </View>
                  <Text style={[styles.cardTitle, { textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={2}>
                    {title}
                  </Text>
                  <Text style={styles.priceLabel}>
                    {(book.discountPrice ?? book.price).toFixed(2)} {t('app.currency')}
                  </Text>
                </View>

                {isFocal && <View style={styles.focalGoldBorder} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Selected Book Reveal Details Panel with GlassCard */}
      {activeBook && (
        <GlassCard variant="dark" elevation="md" style={styles.revealDetailCard}>
          <View style={[styles.detailHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={styles.detailInfoCol}>
              <View style={[styles.metaBadgesRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <GraduationCap size={14} color={colors.accentLight} />
                <Text style={styles.detailLevel}>
                  {activeBook.levelName[language] || activeBook.levelName.ar}
                </Text>
                {activeBook.quarter && activeBook.quarter !== 'full' && (
                  <Text style={styles.detailQuarter}>• {t(`app.${activeBook.quarter}`)}</Text>
                )}
                <Star size={13} color={colors.accent} fill={colors.accent} />
                <Text style={styles.detailStars}>{activeBook.rating.toFixed(1)}</Text>
              </View>

              <Text style={[styles.detailTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                {activeBook.title[language] || activeBook.title.ar}
              </Text>

              <Text style={[styles.detailDesc, { textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={2}>
                {activeBook.description[language] || activeBook.description.ar}
              </Text>
            </View>

            <View style={styles.detailActionsCol}>
              <View style={[styles.priceTagRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.currentPrice}>
                  {(activeBook.discountPrice ?? activeBook.price).toFixed(2)} {t('app.currency')}
                </Text>
                {activeBook.discountPrice && (
                  <Text style={styles.oldPrice}>
                    {activeBook.price.toFixed(2)} {t('app.currency')}
                  </Text>
                )}
              </View>

              <View style={[styles.btnRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Button
                  title={t('app.addToCart')}
                  icon={<ShoppingCart size={16} color={colors.primaryDark} />}
                  tooltip={t('app.addToCart')}
                  onPress={() => addToCart(activeBook)}
                  variant="accent"
                  size="md"
                />
              </View>
            </View>
          </View>
        </GlassCard>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  lookbookSection: {
    marginVertical: 16,
    width: '100%',
  },
  perspectiveStage: {
    height: 320,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    overflow: 'hidden',
  },
  stageArrow: {
    position: 'absolute',
    top: '42%',
    backgroundColor: 'rgba(18, 59, 43, 0.95)',
    width: 42,
    height: 42,
    borderRadius: layout.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.4)',
    ...shadows.md,
  },
  arrowLeft: {
    left: 12,
  },
  arrowRight: {
    right: 12,
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
    width: 210,
    height: 285,
    borderRadius: layout.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.cardBg,
    ...shadows.lg,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.3)',
  },
  lookbookCardFocal: {
    borderColor: colors.accent,
    borderWidth: 2,
    ...shadows.goldGlow,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  spine3DEdge: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 6,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    zIndex: 10,
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(10, 35, 25, 0.92)',
  },
  levelRow: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  levelBadge: {
    color: colors.accentLight,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  cardTitle: {
    color: colors.textLight,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 16,
  },
  priceLabel: {
    color: colors.accentLight,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginTop: 4,
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
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.35)',
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
  metaBadgesRow: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  detailLevel: {
    color: colors.accentLight,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  detailQuarter: {
    color: colors.accent,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  detailStars: {
    color: colors.accent,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  detailTitle: {
    color: colors.textLight,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  detailDesc: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: typography.fontSize.xs,
    marginTop: 4,
    lineHeight: 18,
  },
  detailActionsCol: {
    alignItems: 'center',
    gap: 10,
  },
  priceTagRow: {
    alignItems: 'center',
    gap: 8,
  },
  currentPrice: {
    color: colors.accentLight,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  oldPrice: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    textDecorationLine: 'line-through',
  },
  btnRow: {
    gap: 8,
  },
});
