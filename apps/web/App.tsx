import React, { useState } from 'react';
import { registerRootComponent } from 'expo';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';
import { StoreProvider, useStore } from './src/context/StoreContext';
import { Header, Footer } from './src/components/Header';
import { Bookshelf } from './src/components/Bookshelf';
import { ProductCard } from './src/components/ProductCard';
import { BookViewer } from './src/components/BookViewer';
import { Modal } from './src/components/ui/Modal';
import { Button } from './src/components/ui/Button';
import { MOCK_BOOKS, EDUCATION_LEVELS, Book } from './src/mock/data';
import { colors, layout, shadows, typography } from './src/theme/tokens';

function StorefrontContent() {
  const { language, isRTL, t } = useLanguage();
  const { cart, favourites, removeFromCart, updateQuantity, subtotal } = useStore();

  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [cartModalOpen, setCartModalOpen] = useState(false);

  // Count books per level
  const booksCountByLevel: Record<string, number> = {};
  EDUCATION_LEVELS.forEach((level) => {
    booksCountByLevel[level.id] = MOCK_BOOKS.filter(
      (b) => b.educationLevel === level.id
    ).length;
  });

  const activeLevelData = EDUCATION_LEVELS.find((l) => l.id === selectedLevel);

  // Filter books based on search, education level, and quarter
  const filteredBooks = MOCK_BOOKS.filter((book) => {
    if (selectedLevel && book.educationLevel !== selectedLevel) return false;
    if (
      selectedQuarter !== 'all' &&
      book.quarter &&
      book.quarter !== selectedQuarter &&
      book.quarter !== 'full'
    ) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = (book.title[language] || book.title.ar).toLowerCase();
      return title.includes(q);
    }
    return true;
  });

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.appContainer}>
      {/* Header Shell */}
      <Header
        cartCount={cartTotalItems}
        favouritesCount={favourites.length}
        onOpenCart={() => setCartModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <View style={[styles.heroContent, { alignItems: isRTL ? 'flex-start' : 'flex-end' }]}>
          <Text style={[styles.heroTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('app.name')}
          </Text>
          <Text style={[styles.heroSub, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('app.tagline')}
          </Text>
        </View>
      </View>

      {/* Main Interactive Library */}
      <ScrollView contentContainerStyle={styles.mainScrollContent}>
        <View style={styles.storeContainer}>
          {/* Level Menu Bar */}
          <View style={styles.shelfSection}>
            <Bookshelf
              selectedLevel={selectedLevel}
              onSelectLevel={setSelectedLevel}
              booksCountByLevel={booksCountByLevel}
            />
          </View>

          {/* OPENED BOOK LEVEL CONTAINER */}
          <View style={styles.openedBookContainer}>
            {/* Center Spine Crease Effect */}
            <View style={styles.openedBookSpine} />

            {/* Left Page: Level Overview / Meta / Filters */}
            <View style={styles.openedBookLeftPage}>
              <View style={[styles.pageHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.levelBadgeIcon}>📖</Text>
                <View style={styles.levelTitleCol}>
                  <Text style={[styles.levelTitleText, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {activeLevelData
                      ? activeLevelData.title[language] || activeLevelData.title.ar
                      : t('app.allLevels')}
                  </Text>
                  <Text style={[styles.levelSubText, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {activeLevelData
                      ? activeLevelData.subTitle[language] || activeLevelData.subTitle.ar
                      : 'المكتبة التعليمية الرقمية'}
                  </Text>
                </View>

                {selectedLevel !== null && (
                  <TouchableOpacity
                    style={styles.closeLevelBtn}
                    onPress={() => setSelectedLevel(null)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.closeLevelBtnText}>✕ {t('app.allLevels')}</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Trimester / Quarter Filters Inside Book Page */}
              <View style={[styles.quarterFilterBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.quarterLabel}>🔍 {t('app.filterBy')}:</Text>
                {['all', 'q1', 'q2', 'q3'].map((q) => (
                  <TouchableOpacity
                    key={q}
                    style={[
                      styles.quarterPill,
                      selectedQuarter === q && styles.quarterPillActive,
                    ]}
                    onPress={() => setSelectedQuarter(q)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.quarterPillText,
                        selectedQuarter === q && styles.quarterPillTextActive,
                      ]}
                    >
                      {q === 'all' ? t('app.allQuarters') : t(`app.${q}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Right Page (Spread): Articles & Books of the opened level */}
            <View style={styles.openedBookRightPage}>
              <View style={[styles.booksGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <ProductCard
                      key={book.id}
                      book={book}
                      onPreview={(b) => setPreviewBook(b)}
                    />
                  ))
                ) : (
                  <View style={styles.emptyGrid}>
                    <Text style={styles.emptyGridText}>لا توجد كتب مطابقة لبحثك في هذا المستوى</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Opened Book Preview Modal */}
      <BookViewer
        book={previewBook}
        visible={previewBook !== null}
        onClose={() => setPreviewBook(null)}
      />

      {/* Cart Modal */}
      <Modal
        visible={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        title={t('app.cart')}
      >
        {cart.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>{t('app.emptyCart')}</Text>
          </View>
        ) : (
          <View style={styles.cartContent}>
            {cart.map((item) => (
              <View
                key={item.book.id}
                style={[styles.cartItemRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              >
                <View style={styles.cartItemInfo}>
                  <Text style={[styles.cartItemTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {item.book.title[language] || item.book.title.ar}
                  </Text>
                  <Text style={styles.cartItemPrice}>
                    {((item.book.discountPrice ?? item.book.price) * item.quantity).toFixed(2)}{' '}
                    {t('app.currency')}
                  </Text>
                </View>

                <View style={styles.cartQtyControls}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(item.book.id, item.quantity - 1)}
                  >
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(item.book.id, item.quantity + 1)}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeFromCart(item.book.id)}
                  >
                    <Text style={styles.removeBtnText}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.cartSummary}>
              <View style={[styles.cartSummaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.summaryLabel}>{t('app.subtotal')}:</Text>
                <Text style={styles.summaryValue}>
                  {subtotal.toFixed(2)} {t('app.currency')}
                </Text>
              </View>
              <Button
                title={t('app.checkout')}
                onPress={() => alert('إعادة توجيه إلى التوصيل والمحاسبة')}
                variant="accent"
                size="lg"
                style={{ marginTop: 16 }}
              />
            </View>
          </View>
        )}
      </Modal>

      {/* Footer */}
      <Footer />
    </View>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <StoreProvider>
        <StorefrontContent />
      </StoreProvider>
    </LanguageProvider>
  );
}

registerRootComponent(App);

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroBanner: {
    backgroundColor: colors.primaryDark,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderBottomColor: colors.accent,
  },
  heroContent: {
    maxWidth: layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  heroTitle: {
    color: colors.textLight,
    fontSize: typography.fontSize.hero,
    fontWeight: typography.fontWeight.bold,
  },
  heroSub: {
    color: colors.accentLight,
    fontSize: typography.fontSize.md,
    marginTop: 4,
  },
  mainScrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  storeContainer: {
    maxWidth: layout.maxWidth,
    width: '100%',
    alignSelf: 'center',
    gap: 24,
  },
  shelfSection: {
    width: '100%',
  },
  openedBookContainer: {
    backgroundColor: colors.pageBg,
    borderRadius: layout.borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.borderDark,
    ...shadows.lg,
    overflow: 'hidden',
    position: 'relative',
    padding: 20,
  },
  openedBookSpine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 12,
    marginLeft: -6,
    backgroundColor: 'rgba(92, 58, 33, 0.12)',
    zIndex: 5,
  },
  openedBookLeftPage: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 16,
    marginBottom: 20,
  },
  pageHeaderRow: {
    alignItems: 'center',
    gap: 12,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  levelBadgeIcon: {
    fontSize: 28,
  },
  levelTitleCol: {
    flex: 1,
  },
  levelTitleText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  levelSubText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeLevelBtn: {
    backgroundColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.sm,
  },
  closeLevelBtnText: {
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.bold,
  },
  quarterFilterBar: {
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  quarterLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.secondary,
  },
  quarterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.full,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quarterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quarterPillText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  quarterPillTextActive: {
    color: colors.textLight,
    fontWeight: typography.fontWeight.bold,
  },
  openedBookRightPage: {
    width: '100%',
  },
  booksGrid: {
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  emptyGrid: {
    padding: 40,
    alignItems: 'center',
    width: '100%',
  },
  emptyGridText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.md,
  },
  emptyCartContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyCartText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.md,
  },
  cartContent: {
    gap: 12,
  },
  cartItemRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartItemInfo: {
    flex: 1,
    paddingHorizontal: 8,
  },
  cartItemTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  cartItemPrice: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    marginTop: 2,
  },
  cartQtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: layout.borderRadius.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 14,
    fontWeight: typography.fontWeight.bold,
  },
  qtyValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    paddingHorizontal: 4,
  },
  removeBtn: {
    padding: 4,
    marginLeft: 6,
  },
  removeBtnText: {
    fontSize: 16,
  },
  cartSummary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: colors.borderDark,
  },
  cartSummaryRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  summaryValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});
