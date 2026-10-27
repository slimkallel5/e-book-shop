import React, { useState } from 'react';
import { registerRootComponent } from 'expo';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';
import { StoreProvider, useStore } from './src/context/StoreContext';
import { Header, Footer } from './src/components/Header';
import { Bookshelf, NavCategory } from './src/components/Bookshelf';
import { ProductCard } from './src/components/ProductCard';
import { BookViewer } from './src/components/BookViewer';
import { BookLookbookGallery } from './src/components/BookLookbookGallery';
import { ArticleLookbookGallery } from './src/components/ArticleLookbookGallery';
import { ImmersiveBackground } from './src/components/ImmersiveBackground';
import { Modal } from './src/components/ui/Modal';
import { Button } from './src/components/ui/Button';
import { MOCK_BOOKS, Book } from './src/mock/data';
import { colors, layout, shadows, typography } from './src/theme/tokens';

function StorefrontContent() {
  const { language, isRTL, t } = useLanguage();
  const { cart, favourites, removeFromCart, updateQuantity, subtotal } = useStore();
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const [selectedCategory, setSelectedCategory] = useState<NavCategory>('all');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter books based on active navigation category, quarter, and search
  const filteredBooks = MOCK_BOOKS.filter((book) => {
    if (selectedCategory === 'primary' || selectedCategory === 'middle' || selectedCategory === 'secondary') {
      if (book.educationLevel !== selectedCategory) return false;
    }
    if (selectedCategory === 'packs') {
      if (!book.isPack) return false;
    }
    if (selectedQuarter !== 'all' && book.quarter && book.quarter !== selectedQuarter && book.quarter !== 'full') {
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
    <ImmersiveBackground>
      <View style={styles.appContainer}>
        {/* Persistent Shell Header */}
        <Header
          cartCount={cartTotalItems}
          favouritesCount={favourites.length}
          onOpenCart={() => setCartModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Hero Section */}
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

        {/* Main Scroll Content */}
        <ScrollView contentContainerStyle={styles.mainScrollContent}>
          <View style={styles.storeLayoutWrapper}>
            {/* Mobile Drawer Trigger Bar */}
            {isMobile && (
              <TouchableOpacity
                style={[styles.mobileMenuTrigger, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
                activeOpacity={0.8}
              >
                <Text style={styles.triggerIcon}>📚</Text>
                <Text style={styles.triggerText}>{t('app.menuToggle')}</Text>
                <Text style={styles.triggerArrow}>{mobileMenuOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>
            )}

            {/* Mobile Dropdown Shelf */}
            {isMobile && mobileMenuOpen && (
              <View style={styles.mobileShelfDrawer}>
                <Bookshelf
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                    setMobileMenuOpen(false);
                  }}
                  isCompact
                />
              </View>
            )}

            {/* Main Interactive Library & Storefront Layout */}
            <View style={[styles.storeLayout, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {/* Desktop 3D Navigation Bookshelf */}
              {!isMobile && (
                <View style={styles.shelfCol}>
                  <Bookshelf
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                </View>
              )}

              {/* Center Catalog / Showcase Section */}
              <View style={styles.catalogCol}>
                {/* Educational Articles Showcase Mode */}
                {selectedCategory === 'articles' ? (
                  <ArticleLookbookGallery />
                ) : (
                  <>
                    <View style={[styles.catalogHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <Text style={styles.catalogTitle}>{t('app.catalogTitle')}</Text>

                      {/* Quarter Filter Pills */}
                      <View style={[styles.filterBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        {['all', 'q1', 'q2', 'q3'].map((q) => (
                          <TouchableOpacity
                            key={q}
                            style={[
                              styles.pillBtn,
                              selectedQuarter === q && styles.pillBtnActive,
                            ]}
                            onPress={() => setSelectedQuarter(q)}
                            activeOpacity={0.8}
                          >
                            <Text
                              style={[
                                styles.pillText,
                                selectedQuarter === q && styles.pillTextActive,
                              ]}
                            >
                              {q === 'all' ? t('app.allQuarters') : t(`app.${q}`)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Interactive 3D Motion UI Lookbook Reveal Book Showcase */}
                    {filteredBooks.length > 0 && (
                      <BookLookbookGallery
                        books={filteredBooks}
                        onPreviewBook={(b) => setPreviewBook(b)}
                      />
                    )}

                    {/* Responsive Books Grid */}
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
                          <Text style={styles.emptyGridText}>لا توجد كتب مطابقة لبحثك</Text>
                        </View>
                      )}
                    </View>

                  </>
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* 3D Book Sample Viewer Modal */}
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

        {/* Persistent Shell Footer */}
        <Footer />
      </View>
    </ImmersiveBackground>
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
  },
  heroBanner: {
    backgroundColor: 'rgba(10, 35, 25, 0.88)',
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderBottomColor: colors.accent,
    ...shadows.md,
  },
  heroContent: {
    width: '100%',
    alignSelf: 'stretch',
  },
  heroTitle: {
    color: colors.textLight,
    fontSize: typography.fontSize.hero,
    fontWeight: typography.fontWeight.bold,
  },
  heroSub: {
    color: colors.accentLight,
    fontSize: typography.fontSize.md,
    marginTop: 6,
  },
  mainScrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  storeLayoutWrapper: {
    width: '100%',
    alignSelf: 'stretch',
  },
  mobileMenuTrigger: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    ...shadows.md,
  },
  triggerIcon: {
    fontSize: 20,
  },
  triggerText: {
    color: colors.textLight,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.md,
  },
  triggerArrow: {
    color: colors.accent,
    fontSize: 14,
  },
  mobileShelfDrawer: {
    marginBottom: 20,
  },
  storeLayout: {
    gap: 24,
    alignItems: 'flex-start',
  },
  shelfCol: {
    width: 280,
  },
  catalogCol: {
    flex: 1,
    minWidth: 280,
  },
  catalogHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: 'rgba(18, 59, 43, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.3)',
    ...shadows.md,
  },
  catalogTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
  },
  filterBar: {
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  pillBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  pillBtnActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accentLight,
  },
  pillText: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
  },
  pillTextActive: {
    color: colors.primaryDark,
    fontWeight: typography.fontWeight.bold,
  },
  booksGrid: {
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  emptyGrid: {
    padding: 32,
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
