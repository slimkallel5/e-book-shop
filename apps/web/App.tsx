import React, { useState, useEffect } from 'react';
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
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  BarChart3,
  ShoppingCart,
  Package,
  Gift,
  Star,
  Mail,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  Layers,
} from 'lucide-react-native';
import { Header, Footer } from './src/components/Header';
import { Bookshelf, NavCategory } from './src/components/Bookshelf';
import { ProductCard } from './src/components/ProductCard';
import { Tooltip } from './src/components/ui/Tooltip';
import { BookViewer } from './src/components/BookViewer';
import { ProductDetailModal } from './src/components/ProductDetailModal';
import { ArticleAdmin } from './src/components/ArticleAdmin';
import { PackAdmin } from './src/components/PackAdmin';
import { OrderAdmin } from './src/components/OrderAdmin';
import { ReviewAdmin } from './src/components/ReviewAdmin';
import { ContactAdmin } from './src/components/ContactAdmin';
import { AdminDashboard } from './src/components/AdminDashboard';
import { AdminLoginModal } from './src/components/AdminLoginModal';
import { BookLookbookGallery } from './src/components/BookLookbookGallery';
import { ArticleLookbookGallery } from './src/components/ArticleLookbookGallery';
import { ThreeDScene } from './src/components/3d/ThreeDScene';
import { ThreeDPreviewDemonstrator } from './src/components/3d/ThreeDPreviewDemonstrator';
import { CheckoutModal } from './src/components/CheckoutModal';
import { OrderLookupModal } from './src/components/OrderLookupModal';
import { ContactModal } from './src/components/ContactModal';
import { Modal } from './src/components/ui/Modal';
import { Button } from './src/components/ui/Button';
import { GlassCard } from './src/components/ui/GlassCard';
import { Book, MOCK_BOOKS } from './src/mock/data';
import { fetchCatalogBooks } from './src/services/api';
import { colors, layout, shadows, typography } from './src/theme/tokens';

function StorefrontContent() {
  const { language, isRTL, t } = useLanguage();
  const { cart, favourites, removeFromCart, updateQuantity, subtotal, clearCart } = useStore();
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminLoginOpen, setAdminLoginOpen] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'orders' | 'articles' | 'packs' | 'reviews' | 'contact'>('dashboard');

  const [selectedCategory, setSelectedCategory] = useState<NavCategory>('all');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [detailBook, setDetailBook] = useState<Book | null>(null);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderLookupOpen, setOrderLookupOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [show3DPreview, setShow3DPreview] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchCatalogBooks().then((data) => {
      if (isMounted && data.length > 0) {
        setBooks(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleAdminMode = () => {
    if (!isAdminView && !adminToken) {
      setAdminLoginOpen(true);
    } else {
      setIsAdminView(!isAdminView);
    }
  };

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    setIsAdminView(true);
  };

  // Filter books based on active navigation category, quarter, and search
  const filteredBooks = books.filter((book) => {
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
    <ThreeDScene showFloatingBooks={!isAdminView && !show3DPreview} interactiveCamera={!isAdminView}>
      <View style={styles.appContainer}>
        {/* Rebuilt 3D Shell Navigation Header */}
        <Header
          cartCount={cartTotalItems}
          favouritesCount={favourites.length}
          onOpenCart={() => setCartModalOpen(true)}
          onOpenOrderLookup={() => setOrderLookupOpen(true)}
          onOpenContact={() => setContactModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isAdminMode={isAdminView}
          onToggleAdminMode={handleToggleAdminMode}
          onToggle3DPreview={() => setShow3DPreview(!show3DPreview)}
          is3DPreviewActive={show3DPreview}
        />

        {/* Main Content Area */}
        <ScrollView contentContainerStyle={styles.mainScrollContent}>
          <View style={styles.storeLayoutWrapper}>
            {/* Mobile Drawer Trigger Bar */}
            {isMobile && !isAdminView && (
              <TouchableOpacity
                style={[styles.mobileMenuTrigger, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={t('app.menuToggle')}
              >
                <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }]}>
                  <BookOpen size={20} color={colors.accentLight} />
                  <Text style={styles.triggerText}>{t('app.menuToggle')}</Text>
                </View>
                {mobileMenuOpen ? (
                  <ChevronUp size={20} color={colors.accent} />
                ) : (
                  <ChevronDown size={20} color={colors.accent} />
                )}
              </TouchableOpacity>
            )}

            {/* Mobile Dropdown Shelf */}
            {isMobile && mobileMenuOpen && !isAdminView && (
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

            {/* 3D Demonstrator Preview Mode */}
            {show3DPreview ? (
              <ThreeDPreviewDemonstrator
                sampleBooks={filteredBooks.length > 0 ? filteredBooks : books}
                onClose={() => setShow3DPreview(false)}
              />
            ) : isAdminView ? (
              <View style={styles.adminContainer}>
                {/* Admin Sub-navigation Tabs */}
                <View style={[styles.adminTabRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <TouchableOpacity
                    style={[styles.adminTabBtn, adminTab === 'dashboard' && styles.adminTabBtnActive, { flexDirection: isRTL ? 'row-reverse' : 'row', gap: 6, alignItems: 'center' }]}
                    onPress={() => setAdminTab('dashboard')}
                  >
                    <BarChart3 size={16} color={adminTab === 'dashboard' ? colors.textLight : colors.textSecondary} />
                    <Text style={[styles.adminTabText, adminTab === 'dashboard' && styles.adminTabTextActive]}>
                      {t('admin.dashboardTab')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.adminTabBtn, adminTab === 'orders' && styles.adminTabBtnActive, { flexDirection: isRTL ? 'row-reverse' : 'row', gap: 6, alignItems: 'center' }]}
                    onPress={() => setAdminTab('orders')}
                  >
                    <ShoppingCart size={16} color={adminTab === 'orders' ? colors.textLight : colors.textSecondary} />
                    <Text style={[styles.adminTabText, adminTab === 'orders' && styles.adminTabTextActive]}>
                      {t('admin.ordersTab')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.adminTabBtn, adminTab === 'articles' && styles.adminTabBtnActive, { flexDirection: isRTL ? 'row-reverse' : 'row', gap: 6, alignItems: 'center' }]}
                    onPress={() => setAdminTab('articles')}
                  >
                    <Package size={16} color={adminTab === 'articles' ? colors.textLight : colors.textSecondary} />
                    <Text style={[styles.adminTabText, adminTab === 'articles' && styles.adminTabTextActive]}>
                      {t('admin.articlesTab')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.adminTabBtn, adminTab === 'packs' && styles.adminTabBtnActive, { flexDirection: isRTL ? 'row-reverse' : 'row', gap: 6, alignItems: 'center' }]}
                    onPress={() => setAdminTab('packs')}
                  >
                    <Gift size={16} color={adminTab === 'packs' ? colors.textLight : colors.textSecondary} />
                    <Text style={[styles.adminTabText, adminTab === 'packs' && styles.adminTabTextActive]}>
                      {t('admin.packsTab')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.adminTabBtn, adminTab === 'reviews' && styles.adminTabBtnActive, { flexDirection: isRTL ? 'row-reverse' : 'row', gap: 6, alignItems: 'center' }]}
                    onPress={() => setAdminTab('reviews')}
                  >
                    <Star size={16} color={adminTab === 'reviews' ? colors.textLight : colors.textSecondary} />
                    <Text style={[styles.adminTabText, adminTab === 'reviews' && styles.adminTabTextActive]}>
                      {t('admin.reviewsTab')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.adminTabBtn, adminTab === 'contact' && styles.adminTabBtnActive, { flexDirection: isRTL ? 'row-reverse' : 'row', gap: 6, alignItems: 'center' }]}
                    onPress={() => setAdminTab('contact')}
                  >
                    <Mail size={16} color={adminTab === 'contact' ? colors.textLight : colors.textSecondary} />
                    <Text style={[styles.adminTabText, adminTab === 'contact' && styles.adminTabTextActive]}>
                      {t('admin.contactTab')}
                    </Text>
                  </TouchableOpacity>
                </View>

                {adminTab === 'dashboard' && <AdminDashboard token={adminToken || undefined} />}
                {adminTab === 'orders' && <OrderAdmin token={adminToken || undefined} />}
                {adminTab === 'articles' && <ArticleAdmin />}
                {adminTab === 'packs' && <PackAdmin />}
                {adminTab === 'reviews' && <ReviewAdmin token={adminToken || undefined} />}
                {adminTab === 'contact' && <ContactAdmin token={adminToken || undefined} />}
              </View>
            ) : (
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
                      {/* 3D Catalog Header & Filter Control Bar */}
                      <View style={[styles.catalogHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }]}>
                          <Sparkles size={20} color={colors.accentLight} />
                          <Text style={styles.catalogTitle}>{t('app.catalogTitle')}</Text>
                        </View>

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
                              accessibilityRole="button"
                              accessibilityLabel={q === 'all' ? t('app.allQuarters') : t(`app.${q}`)}
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
                          onPreviewBook={(b) => setDetailBook(b)}
                        />
                      )}

                      {/* Responsive 3D Books Grid */}
                      <View style={[styles.booksGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        {filteredBooks.length > 0 ? (
                          filteredBooks.map((book) => (
                            <ProductCard
                              key={book.id}
                              book={book}
                              onPreview={(b) => setDetailBook(b)}
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
            )}
          </View>
        </ScrollView>

        {/* Admin Login Modal */}
        <AdminLoginModal
          visible={adminLoginOpen}
          onClose={() => setAdminLoginOpen(false)}
          onSuccess={handleAdminLoginSuccess}
        />

        {/* Product Details Modal */}
        <ProductDetailModal
          book={detailBook}
          allBooks={books}
          visible={detailBook !== null}
          onClose={() => setDetailBook(null)}
          onPreviewBook={(b) => setPreviewBook(b)}
          onSelectBook={(b) => setDetailBook(b)}
        />

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
              <ShoppingCart size={48} color={colors.textMuted} style={{ marginBottom: 12 }} />
              <Text style={styles.emptyCartText}>{t('app.emptyCart')}</Text>
            </View>
          ) : (
            <ScrollView style={styles.cartModalScrollView} contentContainerStyle={styles.cartContent}>
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
                    <Tooltip content="-1">
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.book.id, item.quantity - 1)}
                        accessibilityRole="button"
                        accessibilityLabel="Decrease quantity"
                      >
                        <Minus size={14} color={colors.accentLight} />
                      </TouchableOpacity>
                    </Tooltip>
                    <Text style={styles.qtyValue}>{item.quantity}</Text>
                    <Tooltip content="+1">
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.book.id, item.quantity + 1)}
                        accessibilityRole="button"
                        accessibilityLabel="Increase quantity"
                      >
                        <Plus size={14} color={colors.accentLight} />
                      </TouchableOpacity>
                    </Tooltip>
                    <Tooltip content={t('admin.delete')}>
                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => removeFromCart(item.book.id)}
                        accessibilityRole="button"
                        accessibilityLabel={t('admin.delete')}
                      >
                        <Trash2 size={16} color={colors.error} />
                      </TouchableOpacity>
                    </Tooltip>
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
                  icon={<ShoppingCart size={18} color={colors.primaryDark} />}
                  tooltip={t('app.checkout')}
                  onPress={() => {
                    setCartModalOpen(false);
                    setCheckoutModalOpen(true);
                  }}
                  variant="accent"
                  size="lg"
                  style={{ marginTop: 16 }}
                />
              </View>
            </ScrollView>
          )}
        </Modal>

        {/* Guest Checkout Modal */}
        <CheckoutModal
          visible={checkoutModalOpen}
          onClose={() => setCheckoutModalOpen(false)}
          cart={cart}
          subtotal={subtotal}
          onSuccess={(_reference) => {
            clearCart();
          }}
        />

        {/* Guest Order Tracking / Lookup Modal */}
        <OrderLookupModal
          visible={orderLookupOpen}
          onClose={() => setOrderLookupOpen(false)}
        />

        {/* Contact Us Modal */}
        <ContactModal
          visible={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
        />

        {/* Persistent Shell Footer */}
        <Footer />
      </View>
    </ThreeDScene>
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
  mainScrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  storeLayoutWrapper: {
    width: '100%',
    alignSelf: 'stretch',
    maxWidth: 1440,
    marginHorizontal: 'auto',
  },
  mobileMenuTrigger: {
    backgroundColor: 'rgba(12, 38, 28, 0.95)',
    padding: 14,
    borderRadius: layout.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.35)',
    ...shadows.md,
  },
  triggerText: {
    color: '#ffffff',
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.md,
  },
  mobileShelfDrawer: {
    marginBottom: 20,
  },
  storeLayout: {
    gap: 28,
    alignItems: 'flex-start',
  },
  shelfCol: {
    width: 280,
  },
  catalogCol: {
    flex: 1,
    minWidth: 0,
    width: '100%',
  },
  catalogHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    flexWrap: 'wrap',
    gap: 14,
    backgroundColor: 'rgba(10, 32, 23, 0.88)',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: layout.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.35)',
    ...shadows.lg,
  },
  catalogTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  filterBar: {
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  pillBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: layout.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  pillBtnActive: {
    backgroundColor: colors.accent,
    borderColor: '#fff1a8',
    ...shadows.goldGlow,
  },
  pillText: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  pillTextActive: {
    color: colors.primaryDark,
    fontWeight: typography.fontWeight.bold,
  },
  booksGrid: {
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 18,
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
  cartModalScrollView: {
    maxHeight: '100%',
  },
  cartContent: {
    gap: 12,
  },
  cartItemRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 193, 88, 0.2)',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adminContainer: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  adminTabRow: {
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  adminTabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: layout.borderRadius.md,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  adminTabBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  adminTabText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  adminTabTextActive: {
    color: colors.textLight,
    fontWeight: typography.fontWeight.bold,
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
  qtyValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    paddingHorizontal: 4,
  },
  removeBtn: {
    padding: 4,
    marginLeft: 6,
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
