import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { Book } from '../mock/data';
import { getApiUrl } from '../services/api';
import { colors, layout, typography } from '../theme/tokens';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

interface ProductDetailModalProps {
  book: Book | null;
  allBooks: Book[];
  visible: boolean;
  onClose: () => void;
  onPreviewBook?: (book: Book) => void;
  onSelectBook?: (book: Book) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  book,
  allBooks,
  visible,
  onClose,
  onPreviewBook,
  onSelectBook,
}) => {
  const { language, isRTL, t } = useLanguage();
  const { addToCart, isFavourite, toggleFavourite } = useStore();

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  if (!book) return null;

  const title = book.title[language] || book.title.ar;
  const description = book.description[language] || book.description.ar;
  const levelName = book.levelName[language] || book.levelName.ar;
  const isFav = isFavourite(book.id);

  const effectivePrice = book.discountPrice ?? book.price;
  const hasDiscount = book.discountPrice !== undefined && book.discountPrice < book.price;
  const discountPercent = hasDiscount
    ? Math.round(((book.price - book.discountPrice!) / book.price) * 100)
    : 0;

  // Find included books if pack
  const includedBooks = book.isPack && book.includedBookIds
    ? allBooks.filter((b) => book.includedBookIds?.includes(b.id))
    : [];

  // Related items in the same education level
  const relatedBooks = allBooks.filter(
    (b) => b.id !== book.id && b.educationLevel === book.educationLevel
  ).slice(0, 3);

  const handleAddToCart = () => {
    const success = addToCart(book, 1);
    if (!success) {
      alert(t('app.outOfStock'));
    }
  };

  const handleReviewSubmit = async () => {
    setReviewError('');
    if (!reviewAuthor.trim() || !reviewComment.trim()) {
      setReviewError(t('app.reviewRequiredError'));
      return;
    }

    setReviewSubmitting(true);
    try {
      const res = await fetch(getApiUrl('/reviews'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: book.id,
          rating: reviewRating,
          authorName: reviewAuthor.trim(),
          comment: reviewComment.trim(),
        }),
      });

      if (!res.ok) throw new Error(t('app.reviewSubmitError'));

      setReviewSuccess(true);
      setReviewAuthor('');
      setReviewComment('');
    } catch (err: any) {
      setReviewError(err.message || t('app.reviewSubmitError'));
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} title={book.isPack ? t('app.packDetails') : t('app.productDetails')}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Main Product Banner / Details */}
        <View style={[styles.mainSection, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {/* Cover Image Container */}
          <View style={styles.coverWrapper}>
            <Image source={{ uri: book.coverUrl }} style={styles.coverImage} resizeMode="contain" />
            {book.isPack && (
              <View style={styles.packBadgePos}>
                <Badge label="PACK" variant="accent" />
              </View>
            )}
          </View>

          {/* Details Content */}
          <View style={styles.detailsContent}>
            <View style={[styles.titleRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>{title}</Text>
              <TouchableOpacity
                onPress={() => toggleFavourite(book.id)}
                style={styles.favBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.favIcon}>{isFav ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            </View>

            {book.author && (
              <Text style={[styles.author, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('app.author')}: {book.author}
              </Text>
            )}

            <View style={[styles.badgeRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Badge label={levelName} variant="primary" />
              {book.quarter && (
                <Badge
                  label={book.quarter === 'full' ? t('app.fullYear') : t(`app.${book.quarter}`)}
                  variant="secondary"
                />
              )}
            </View>

            {/* Price section */}
            <View style={[styles.priceRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={styles.effectivePrice}>
                {effectivePrice.toFixed(2)} {t('app.currency')}
              </Text>
              {hasDiscount && (
                <>
                  <Text style={styles.originalPrice}>
                    {book.price.toFixed(2)} {t('app.currency')}
                  </Text>
                  <Badge label={`-${discountPercent}%`} variant="accent" />
                </>
              )}
            </View>

            {/* Availability */}
            <View style={[styles.stockRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.stockStatus, { color: book.inStock ? colors.success : colors.error }]}>
                {book.inStock
                  ? `${t('app.inStock')} (${book.stockCount})`
                  : t('app.outOfStock')}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={[styles.actionRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Button
                title={t('app.addToCart')}
                onPress={handleAddToCart}
                disabled={!book.inStock}
                variant="accent"
                size="md"
              />
              {book.samplePages && book.samplePages.length > 0 && onPreviewBook && (
                <Button
                  title={t('app.previewSample')}
                  onPress={() => {
                    onClose();
                    onPreviewBook(book);
                  }}
                  variant="secondary"
                  size="md"
                />
              )}
            </View>
          </View>
        </View>

        {/* Description Section */}
        {description ? (
          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('app.description')}
            </Text>
            <Text style={[styles.descriptionText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {description}
            </Text>
          </View>
        ) : null}

        {/* Customer Review Submission Form */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            ⭐ {t('app.addReviewTitle')}
          </Text>

          {reviewSuccess ? (
            <View style={styles.reviewSuccessBox}>
              <Text style={styles.reviewSuccessText}>
                ✅ {t('app.reviewSuccess')}
              </Text>
            </View>
          ) : (
            <View style={styles.reviewForm}>
              {reviewError ? (
                <Text style={styles.reviewErrorText}>⚠️ {reviewError}</Text>
              ) : null}

              <Text style={styles.fieldLabel}>{t('app.reviews')}:</Text>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
                    <Text style={styles.starIcon}>{star <= reviewRating ? '⭐' : '☆'}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={[styles.reviewInput, { textAlign: isRTL ? 'right' : 'left' }]}
                placeholder={t('app.reviewAuthorPlaceholder')}
                value={reviewAuthor}
                onChangeText={setReviewAuthor}
              />

              <TextInput
                style={[styles.reviewInput, styles.textArea, { textAlign: isRTL ? 'right' : 'left' }]}
                placeholder={t('app.reviewCommentPlaceholder')}
                value={reviewComment}
                onChangeText={setReviewComment}
                multiline
                numberOfLines={3}
              />

              <Button
                title={reviewSubmitting ? t('app.submitting') : t('app.submitReview')}
                onPress={handleReviewSubmit}
                variant="accent"
                size="sm"
                disabled={reviewSubmitting}
              />
            </View>
          )}
        </View>

        {/* Pack Breakdown Section */}
        {book.isPack && includedBooks.length > 0 && (
          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('app.packContents')}
            </Text>
            {includedBooks.map((item) => (
              <View
                key={item.id}
                style={[styles.packItemRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              >
                <Image source={{ uri: item.coverUrl }} style={styles.packItemImage} resizeMode="cover" />
                <View style={styles.packItemInfo}>
                  <Text style={[styles.packItemTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {item.title[language] || item.title.ar}
                  </Text>
                  <Text style={[styles.packItemPrice, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {item.price.toFixed(2)} {t('app.currency')}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('app.relatedProducts')}
            </Text>
            <View style={[styles.relatedGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {relatedBooks.map((rel) => (
                <TouchableOpacity
                  key={rel.id}
                  style={styles.relatedCard}
                  onPress={() => onSelectBook && onSelectBook(rel)}
                >
                  <Image source={{ uri: rel.coverUrl }} style={styles.relatedImage} resizeMode="contain" />
                  <Text numberOfLines={2} style={styles.relatedTitle}>
                    {rel.title[language] || rel.title.ar}
                  </Text>
                  <Text style={styles.relatedPrice}>
                    {(rel.discountPrice ?? rel.price).toFixed(2)} {t('app.currency')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    gap: 20,
  },
  mainSection: {
    gap: 16,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  coverWrapper: {
    width: 160,
    height: 226, // Aspect ratio ~ 1:1.414
    position: 'relative',
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  packBadgePos: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  detailsContent: {
    flex: 1,
    minWidth: 220,
    gap: 10,
  },
  titleRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  favBtn: {
    padding: 4,
  },
  favIcon: {
    fontSize: 20,
  },
  author: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  badgeRow: {
    gap: 8,
    alignItems: 'center',
  },
  priceRow: {
    alignItems: 'baseline',
    gap: 10,
    marginTop: 4,
  },
  effectivePrice: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  originalPrice: {
    fontSize: typography.fontSize.md,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  stockRow: {
    alignItems: 'center',
  },
  stockStatus: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  actionRow: {
    gap: 10,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  sectionBlock: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 14,
    gap: 8,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  descriptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  reviewSuccessBox: {
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: layout.borderRadius.md,
  },
  reviewSuccessText: {
    color: '#059669',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  reviewForm: {
    gap: 8,
  },
  reviewErrorText: {
    color: '#D32F2F',
    fontSize: typography.fontSize.xs,
  },
  fieldLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  starRow: {
    flexDirection: 'row',
    gap: 6,
  },
  starIcon: {
    fontSize: 22,
    color: colors.secondary,
  },
  reviewInput: {
    backgroundColor: colors.cardBg,
    borderColor: colors.borderDark,
    borderWidth: 1,
    borderRadius: layout.borderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: typography.fontSize.xs,
  },
  textArea: {
    height: 70,
  },
  packItemRow: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  packItemImage: {
    width: 40,
    height: 56,
    borderRadius: layout.borderRadius.sm,
  },
  packItemInfo: {
    flex: 1,
  },
  packItemTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  packItemPrice: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    marginTop: 2,
  },
  relatedGrid: {
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 6,
  },
  relatedCard: {
    width: 100,
    backgroundColor: colors.cardBg,
    borderRadius: layout.borderRadius.md,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  relatedImage: {
    width: 70,
    height: 99,
    borderRadius: layout.borderRadius.sm,
  },
  relatedTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: 6,
    textAlign: 'center',
  },
  relatedPrice: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    marginTop: 2,
  },
});
