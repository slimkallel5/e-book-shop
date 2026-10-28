import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Book } from '../mock/data';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { colors, layout, typography } from '../theme/tokens';

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
      alert(t('app.outOfStock') || 'المخزون غير كافٍ');
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} title={book.isPack ? t('app.packDetails') || 'تفاصيل الحزمة' : t('app.productDetails') || 'تفاصيل الكتاب'}>
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
                {t('app.author') || 'المؤلف'}: {book.author}
              </Text>
            )}

            <View style={[styles.badgeRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Badge label={levelName} variant="primary" />
              {book.quarter && (
                <Badge
                  label={book.quarter === 'full' ? t('app.fullYear') || 'سنة كاملة' : t(`app.${book.quarter}`)}
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
                  ? `${t('app.inStock') || 'متوفر'} (${book.stockCount})`
                  : t('app.outOfStock') || 'غير متوفر'}
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
                  title={t('app.previewSample') || 'معاينة عينة'}
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
              {t('app.description') || 'الوصف'}
            </Text>
            <Text style={[styles.descriptionText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {description}
            </Text>
          </View>
        ) : null}

        {/* Pack Breakdown Section */}
        {book.isPack && includedBooks.length > 0 && (
          <View style={styles.sectionBlock}>
            <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('app.packContents') || 'محتويات الحزمة'}
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
              {t('app.relatedProducts') || 'منتجات ذات صلة'}
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
