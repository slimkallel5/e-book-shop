import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Book } from '../mock/data';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { colors, layout, shadows, typography } from '../theme/tokens';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { LottieIcon } from './icons';

interface ProductCardProps {
  book: Book;
  onPreview: (book: Book) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ book, onPreview }) => {
  const { language, isRTL, t } = useLanguage();
  const { addToCart, toggleFavourite, isFavourite } = useStore();

  const title = book.title[language] || book.title.ar;
  const levelName = book.levelName[language] || book.levelName.ar;
  const favorited = isFavourite(book.id);

  const discountPercent =
    book.discountPrice && book.price > 0
      ? Math.round(((book.price - book.discountPrice) / book.price) * 100)
      : null;

  const prefersReducedMotion =
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <View style={[styles.card3DWrapper, prefersReducedMotion && { transform: [] }]}>
      <View style={styles.cardContainer}>
        {/* Cover Image Wrapper with A4 Aspect Ratio and 3D Spine Shadow */}
        <View style={styles.coverWrapper}>
          <Image
            source={{ uri: book.coverUrl }}
            style={styles.coverImage}
            resizeMode="cover"
          />

          {/* Simulated 3D Book Spine Left Shadow Edge */}
          <View style={styles.spine3DEdge} />

          {/* Floating Badges */}
          <View style={[styles.badgeContainer, isRTL ? { right: 8 } : { left: 8 }]}>
            {book.isPack && <Badge label={t('app.packBadge')} variant="pack" />}
            {discountPercent && (
              <Badge
                label={`-${discountPercent}%`}
                variant="discount"
                style={{ marginTop: 4 }}
              />
            )}
          </View>

          {/* Favourite Button */}
          <TouchableOpacity
            style={[styles.favBtn, isRTL ? { left: 8 } : { right: 8 }]}
            onPress={() => toggleFavourite(book.id)}
            activeOpacity={0.8}
          >
            <LottieIcon name={favorited ? 'heart' : 'heart-outline'} size={18} />
          </TouchableOpacity>

          {/* Quick Preview Hover Overlay / Button */}
          <TouchableOpacity
            style={styles.previewOverlayBtn}
            onPress={() => onPreview(book)}
            activeOpacity={0.85}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <LottieIcon name="book" size={16} />
              <Text style={styles.previewBtnText}>{t('app.previewBook')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Book Content Details */}
        <View style={styles.contentContainer}>
          {/* Education Level Badge */}
          <View style={[styles.levelRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <LottieIcon name="grad-cap" size={14} />
            <Text style={styles.levelText}>{levelName}</Text>
            {book.quarter && book.quarter !== 'full' && (
              <Text style={styles.quarterText}>• {t(`app.${book.quarter}`)}</Text>
            )}
          </View>

          {/* Localized Title */}
          <Text
            style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}
            numberOfLines={2}
          >
            {title}
          </Text>

          {/* Rating Stars */}
          <View style={[styles.ratingRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <LottieIcon name="star" size={14} />
            <Text style={styles.stars}>{book.rating.toFixed(1)}</Text>
            <Text style={styles.reviewsCount}>({book.reviewCount} {t('app.reviews')})</Text>
          </View>

          {/* Pricing Row */}
          <View style={[styles.priceRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {book.discountPrice ? (
              <View style={[styles.priceGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.discountPrice}>
                  {book.discountPrice.toFixed(2)} {t('app.currency')}
                </Text>
                <Text style={styles.originalPrice}>
                  {book.price.toFixed(2)} {t('app.currency')}
                </Text>
              </View>
            ) : (
              <Text style={styles.normalPrice}>
                {book.price.toFixed(2)} {t('app.currency')}
              </Text>
            )}
          </View>

          {/* Add to Basket Action */}
          <Button
            title={t('app.addToCart')}
            onPress={() => addToCart(book)}
            variant="primary"
            size="sm"
            style={styles.cartBtn}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card3DWrapper: {
    margin: 8,
    transform: Platform.OS === 'web' ? ([{ perspective: 1000 }] as any) : [],
  },
  cardContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: layout.borderRadius.lg,
    overflow: 'hidden',
    width: 220,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.lg,
  },
  coverWrapper: {
    width: '100%',
    aspectRatio: 1 / layout.a4AspectRatio,
    backgroundColor: colors.background,
    position: 'relative',
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
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    zIndex: 10,
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: layout.borderRadius.full,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...shadows.sm,
  },
  favIcon: {
    fontSize: 16,
  },
  previewOverlayBtn: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(18, 59, 43, 0.92)',
    borderRadius: layout.borderRadius.sm,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBtnText: {
    color: colors.textLight,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  contentContainer: {
    padding: 12,
    justifyContent: 'space-between',
    flex: 1,
  },
  levelRow: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  levelText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  quarterText: {
    fontSize: typography.fontSize.xs,
    color: colors.accent,
    fontWeight: typography.fontWeight.bold,
  },
  title: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    minHeight: 38,
    marginBottom: 6,
  },
  ratingRow: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  stars: {
    color: colors.accent,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  reviewsCount: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
  },
  priceRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceGroup: {
    alignItems: 'center',
    gap: 6,
  },
  discountPrice: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
  },
  originalPrice: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  normalPrice: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  cartBtn: {
    marginTop: 'auto',
  },
});
