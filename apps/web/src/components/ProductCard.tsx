import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { ShoppingCart, Heart, Star, GraduationCap, Eye } from 'lucide-react-native';
import { Book } from '../mock/data';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { colors, layout, shadows, typography } from '../theme/tokens';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';
import { GlassCard } from './ui/GlassCard';

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
      <TouchableOpacity
        onPress={() => onPreview(book)}
        activeOpacity={0.92}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <GlassCard
          variant={book.isPack ? 'goldGlow' : 'dark'}
          elevation="md"
          isInteractive={true}
          style={styles.cardContainer}
        >
          {/* Cover Image Wrapper with A4 Aspect Ratio and 3D Spine Shadow */}
          <View style={styles.coverWrapper}>
            <Image
              source={{ uri: book.coverUrl }}
              style={styles.coverImage}
              resizeMode="cover"
            />

            {/* Simulated 3D Book Spine Left Shadow Edge */}
            <View style={styles.spine3DEdge} />

            {/* Foil edge shimmer overlay */}
            <View style={styles.topFoilEdge} />

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

            {/* Quick preview hover hint icon */}
            <View style={[styles.quickViewBadge, isRTL ? { left: 44 } : { right: 44 }]}>
              <Eye size={14} color="rgba(255, 255, 255, 0.85)" />
            </View>

            {/* Favourite Button with Tooltip */}
            <Tooltip content={favorited ? t('app.favourites') : t('app.favourites')}>
              <TouchableOpacity
                style={[styles.favBtn, isRTL ? { left: 8 } : { right: 8 }]}
                onPress={(e) => {
                  e.stopPropagation?.();
                  toggleFavourite(book.id);
                }}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={t('app.favourites')}
              >
                <Heart
                  size={16}
                  color={favorited ? colors.error : colors.textMuted}
                  fill={favorited ? colors.error : 'transparent'}
                />
              </TouchableOpacity>
            </Tooltip>
          </View>

          {/* Book Content Details */}
          <View style={styles.contentContainer}>
            {/* Education Level Badge */}
            <View style={[styles.levelRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <GraduationCap size={14} color={colors.accentLight} />
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
              <Star size={13} color={colors.accent} fill={colors.accent} />
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

            {/* Add to Basket Action using Lucide Icon and Tooltip */}
            <Button
              title={t('app.addToCart')}
              icon={<ShoppingCart size={16} color={colors.primaryDark} />}
              tooltip={t('app.addToCart')}
              onPress={() => addToCart(book)}
              variant="accent"
              size="sm"
              style={styles.cartBtn}
            />
          </View>
        </GlassCard>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card3DWrapper: {
    margin: 8,
    transform: Platform.OS === 'web' ? ([{ perspective: 1000 }] as any) : [],
  },
  cardContainer: {
    borderRadius: layout.borderRadius.xl,
    overflow: 'hidden',
    width: 224,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.32)',
    ...shadows.lg,
  },
  coverWrapper: {
    width: '100%',
    aspectRatio: 1 / layout.a4AspectRatio,
    backgroundColor: '#0a1c14',
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
    width: 7,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
  },
  topFoilEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(229, 193, 88, 0.5)',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    zIndex: 10,
  },
  quickViewBadge: {
    position: 'absolute',
    top: 8,
    backgroundColor: 'rgba(10, 28, 20, 0.75)',
    borderRadius: layout.borderRadius.full,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    backgroundColor: 'rgba(10, 28, 20, 0.85)',
    borderRadius: layout.borderRadius.full,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.45)',
    ...shadows.sm,
  },
  contentContainer: {
    padding: 14,
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: 'rgba(10, 32, 23, 0.94)',
  },
  levelRow: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  levelText: {
    fontSize: typography.fontSize.xs,
    color: colors.accentLight,
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
    color: '#ffffff',
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
    color: 'rgba(255, 255, 255, 0.65)',
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
    color: colors.accentLight,
  },
  originalPrice: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.55)',
    textDecorationLine: 'line-through',
  },
  normalPrice: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: '#ffffff',
  },
  cartBtn: {
    marginTop: 'auto',
  },
});
