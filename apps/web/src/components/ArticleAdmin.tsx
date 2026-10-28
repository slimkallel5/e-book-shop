import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { colors, layout, shadows, typography } from '../theme/tokens';

export interface AdminArticle {
  id: string;
  sku: string;
  name: { ar: string; fr?: string; en?: string };
  description?: { ar?: string; fr?: string; en?: string };
  price: number;
  discountPrice?: number;
  stock?: number;
  educationLevelId: string;
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'ALL_YEAR';
  posterUrl?: string;
  samplePdfUrl?: string;
  author?: string;
  publisher?: string;
  active: boolean;
}

const INITIAL_ARTICLES: AdminArticle[] = [
  {
    id: 'art-1',
    sku: 'TUN-PRIM-M1',
    name: {
      ar: 'كتاب الرياضيات - السنة الأولى ابتدائي',
      fr: 'Livre de Mathématiques - 1ère Année Primaire',
      en: 'Mathematics Book - 1st Grade Primary',
    },
    description: { ar: 'كتاب تلميذ الرياضيات للثلاثي الأول والثاني والثالث' },
    price: 18.5,
    discountPrice: 15.0,
    stock: 120,
    educationLevelId: 'primary-1',
    quarter: 'ALL_YEAR',
    author: 'المركز الوطني بباجة',
    publisher: 'دار النشر التعليمية',
    active: true,
  },
  {
    id: 'art-2',
    sku: 'TUN-MID-A2',
    name: {
      ar: 'كتاب العربية - السنة الثانية إعدادي',
      fr: 'Livre d\'Arabe - 2ème Année Collège',
      en: 'Arabic Book - 8th Grade Middle',
    },
    description: { ar: 'كتاب مادة اللغة العربية مع التمارين التطبيقية' },
    price: 22.0,
    stock: 45,
    educationLevelId: 'middle-2',
    quarter: 'Q1',
    author: 'مؤلفون جماعيون',
    publisher: 'الدار التونسية للكتاب',
    active: true,
  },
];

export const ArticleAdmin: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const [articles, setArticles] = useState<AdminArticle[]>(INITIAL_ARTICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState<AdminArticle | null>(null);

  // Form State
  const [sku, setSku] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [priceStr, setPriceStr] = useState('');
  const [discountStr, setDiscountStr] = useState('');
  const [stockStr, setStockStr] = useState('');
  const [educationLevelId, setEducationLevelId] = useState('primary-1');
  const [quarter, setQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'ALL_YEAR'>('ALL_YEAR');
  const [posterUrl, setPosterUrl] = useState('');
  const [samplePdfUrl, setSamplePdfUrl] = useState('');
  const [active, setActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const openModal = (article?: AdminArticle) => {
    setErrorMessage('');
    if (article) {
      setEditingArticle(article);
      setSku(article.sku);
      setNameAr(article.name.ar);
      setNameFr(article.name.fr || '');
      setNameEn(article.name.en || '');
      setDescAr(article.description?.ar || '');
      setPriceStr(article.price.toString());
      setDiscountStr(article.discountPrice?.toString() || '');
      setStockStr(article.stock !== undefined ? article.stock.toString() : '');
      setEducationLevelId(article.educationLevelId);
      setQuarter(article.quarter || 'ALL_YEAR');
      setPosterUrl(article.posterUrl || '');
      setSamplePdfUrl(article.samplePdfUrl || '');
      setActive(article.active);
    } else {
      setEditingArticle(null);
      setSku(`TUN-ART-${Date.now().toString().slice(-4)}`);
      setNameAr('');
      setNameFr('');
      setNameEn('');
      setDescAr('');
      setPriceStr('');
      setDiscountStr('');
      setStockStr('');
      setEducationLevelId('primary-1');
      setQuarter('ALL_YEAR');
      setPosterUrl('');
      setSamplePdfUrl('');
      setActive(true);
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    setErrorMessage('');
    if (!sku.trim()) {
      setErrorMessage('رمز الكتاب (SKU) مطلوب');
      return;
    }
    if (!nameAr.trim()) {
      setErrorMessage('اسم الكتاب باللغة العربية مطلوب');
      return;
    }
    const price = parseFloat(priceStr);
    if (isNaN(price) || price < 0) {
      setErrorMessage('السعر الأصلي يجب أن يكون رقماً موجباً');
      return;
    }

    let discountPrice: number | undefined;
    if (discountStr.trim()) {
      discountPrice = parseFloat(discountStr);
      if (isNaN(discountPrice) || discountPrice < 0) {
        setErrorMessage('سعر التخفيض يجب أن يكون رقماً موجباً');
        return;
      }
      if (discountPrice >= price) {
        setErrorMessage('سعر التخفيض يجب أن يكون أقل من السعر الأصلي');
        return;
      }
    }

    const stock = stockStr.trim() ? parseInt(stockStr, 10) : undefined;

    const savedData: AdminArticle = {
      id: editingArticle ? editingArticle.id : `art_${Date.now()}`,
      sku,
      name: { ar: nameAr, fr: nameFr || undefined, en: nameEn || undefined },
      description: descAr ? { ar: descAr } : undefined,
      price,
      discountPrice,
      stock,
      educationLevelId,
      quarter,
      posterUrl: posterUrl || undefined,
      samplePdfUrl: samplePdfUrl || undefined,
      active,
    };

    if (editingArticle) {
      setArticles((prev) => prev.map((a) => (a.id === editingArticle.id ? savedData : a)));
    } else {
      setArticles((prev) => [savedData, ...prev]);
    }

    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const filteredArticles = articles.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.name.ar.toLowerCase().includes(q) ||
      a.sku.toLowerCase().includes(q) ||
      (a.name.fr && a.name.fr.toLowerCase().includes(q))
    );
  });

  return (
    <View style={styles.container}>
      {/* Top Header & Actions */}
      <View style={[styles.topRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.titleGroup}>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            📦 إدارة الكتب والمستلزمات التعليمية
          </Text>
          <Text style={[styles.sectionSub, { textAlign: isRTL ? 'right' : 'left' }]}>
            إضافة، تعديل، وتحديث الأسعار ومعاينات PDF
          </Text>
        </View>
        <Button
          title="➕ إضافة كتاب جديد"
          onPress={() => openModal()}
          variant="accent"
          size="md"
        />
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <TextInput
          style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
          placeholder="ابحث بالاسم أو SKU..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Table / List View */}
      <ScrollView style={styles.listScrollView}>
        {filteredArticles.map((art) => (
          <View key={art.id} style={styles.articleCard}>
            <View style={[styles.cardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={styles.artInfo}>
                <View style={[styles.skuRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Badge label={art.sku} variant="outline" />
                  <Badge
                    label={art.active ? 'مفعل' : 'معطل'}
                    variant={art.active ? 'primary' : 'discount'}
                  />
                  {art.quarter && (
                    <Badge label={art.quarter} variant="secondary" />
                  )}
                </View>
                <Text style={[styles.artTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {art.name[language] || art.name.ar}
                </Text>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.priceCurrent}>
                  {(art.discountPrice ?? art.price).toFixed(2)} د.ت
                </Text>
                {art.discountPrice && (
                  <Text style={styles.priceOriginal}>{art.price.toFixed(2)} د.ت</Text>
                )}
                {art.stock !== undefined && (
                  <Text style={styles.stockLabel}>المخزون: {art.stock}</Text>
                )}
              </View>
            </View>

            {/* Actions Footer */}
            <View style={[styles.cardActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => openModal(art)}
              >
                <Text style={styles.editBtnText}>✏️ تعديل</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(art.id)}
              >
                <Text style={styles.deleteBtnText}>🗑 حذف</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Article Create / Edit Modal */}
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={editingArticle ? 'تعديل الكتاب' : 'إضافة كتاب جديد'}
      >
        <ScrollView style={styles.formScroll}>
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          ) : null}

          <Text style={styles.fieldLabel}>رمز الكتاب (SKU):</Text>
          <TextInput
            style={styles.formInput}
            value={sku}
            onChangeText={setSku}
            placeholder="مثال: TUN-ART-101"
          />

          <Text style={styles.fieldLabel}>اسم الكتاب (عربي) *:</Text>
          <TextInput
            style={styles.formInput}
            value={nameAr}
            onChangeText={setNameAr}
            placeholder="عنوان الكتاب بالعربية"
          />

          <Text style={styles.fieldLabel}>اسم الكتاب (فرنسي):</Text>
          <TextInput
            style={styles.formInput}
            value={nameFr}
            onChangeText={setNameFr}
            placeholder="Nom du livre en français"
          />

          <Text style={styles.fieldLabel}>السعر الأصلي (د.ت) *:</Text>
          <TextInput
            style={styles.formInput}
            value={priceStr}
            onChangeText={setPriceStr}
            keyboardType="numeric"
            placeholder="15.00"
          />

          <Text style={styles.fieldLabel}>سعر التخفيض (د.ت) (اختياري):</Text>
          <TextInput
            style={styles.formInput}
            value={discountStr}
            onChangeText={setDiscountStr}
            keyboardType="numeric"
            placeholder="12.00"
          />

          <Text style={styles.fieldLabel}>المخزون المتوفر:</Text>
          <TextInput
            style={styles.formInput}
            value={stockStr}
            onChangeText={setStockStr}
            keyboardType="numeric"
            placeholder="100"
          />

          <Text style={styles.fieldLabel}>الثلاثي / الفترة:</Text>
          <View style={styles.quarterRow}>
            {(['Q1', 'Q2', 'Q3', 'ALL_YEAR'] as const).map((q) => (
              <TouchableOpacity
                key={q}
                style={[styles.quarterPill, quarter === q && styles.quarterPillActive]}
                onPress={() => setQuarter(q)}
              >
                <Text style={[styles.quarterPillText, quarter === q && styles.quarterPillTextActive]}>
                  {q === 'ALL_YEAR' ? 'كامل السنة' : q}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>رابط الغلاف Poster A4 (اختياري):</Text>
          <TextInput
            style={styles.formInput}
            value={posterUrl}
            onChangeText={setPosterUrl}
            placeholder="/uploads/poster.jpg"
          />

          <Text style={styles.fieldLabel}>رابط المعاينة PDF (اختياري):</Text>
          <TextInput
            style={styles.formInput}
            value={samplePdfUrl}
            onChangeText={setSamplePdfUrl}
            placeholder="/uploads/sample.pdf"
          />

          <TouchableOpacity
            style={[styles.toggleBtn, active && styles.toggleBtnActive]}
            onPress={() => setActive(!active)}
          >
            <Text style={styles.toggleText}>
              الحالة: {active ? '✅ مفعل للبيع' : '❌ معطل'}
            </Text>
          </TouchableOpacity>

          <Button
            title={editingArticle ? 'حفظ التغييرات' : 'إضافة الكتاب'}
            onPress={handleSave}
            variant="accent"
            size="lg"
            style={{ marginTop: 20 }}
          />
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  topRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
  },
  titleGroup: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  sectionSub: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  searchBox: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: colors.cardBg,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: typography.fontSize.sm,
  },
  listScrollView: {
    flex: 1,
  },
  articleCard: {
    backgroundColor: colors.cardBg,
    borderRadius: layout.borderRadius.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardHeader: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  artInfo: {
    flex: 1,
  },
  skuRow: {
    gap: 8,
    alignItems: 'center',
    marginBottom: 6,
  },
  artTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceCurrent: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  priceOriginal: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  stockLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 4,
  },
  cardActions: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    justifyContent: 'flex-end',
    gap: 12,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  editBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fee2e2',
    borderRadius: layout.borderRadius.sm,
  },
  deleteBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
  },
  formScroll: {
    maxHeight: 480,
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: layout.borderRadius.sm,
    marginBottom: 12,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
  },
  fieldLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: 10,
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: layout.borderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: typography.fontSize.sm,
  },
  quarterRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 6,
    flexWrap: 'wrap',
  },
  quarterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderDark,
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
  toggleBtn: {
    marginTop: 14,
    padding: 12,
    borderRadius: layout.borderRadius.sm,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#dcfce7',
  },
  toggleText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
