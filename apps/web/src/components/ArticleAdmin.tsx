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
import { Select } from './ui/Select';
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
  educationSubLevel?: string;
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'ALL_YEAR';
  posterUrl?: string;
  samplePdfUrl?: string;
  author?: string;
  publisher?: string;
  active: boolean;
}

export interface EducationLevelOption {
  id: string;
  category: 'primary' | 'middle' | 'secondary';
  label: { ar: string; fr: string; en: string };
  subLevels: Array<{
    value: string;
    label: { ar: string; fr: string; en: string };
  }>;
}

export const EDUCATION_LEVEL_OPTIONS: EducationLevelOption[] = [
  {
    id: 'primary',
    category: 'primary',
    label: {
      ar: 'التعليم الابتدائي',
      fr: 'Enseignement Primaire',
      en: 'Primary Education',
    },
    subLevels: [
      { value: '1', label: { ar: 'السنة الأولى (1)', fr: '1ère Année (1)', en: '1st Grade (1)' } },
      { value: '2', label: { ar: 'السنة الثانية (2)', fr: '2ème Année (2)', en: '2nd Grade (2)' } },
      { value: '3', label: { ar: 'السنة الثالثة (3)', fr: '3ème Année (3)', en: '3rd Grade (3)' } },
      { value: '4', label: { ar: 'السنة الرابعة (4)', fr: '4ème Année (4)', en: '4th Grade (4)' } },
      { value: '5', label: { ar: 'السنة الخامسة (5)', fr: '5ème Année (5)', en: '5th Grade (5)' } },
      { value: '6', label: { ar: 'السنة السادسة (6)', fr: '6ème Année (6)', en: '6th Grade (6)' } },
    ],
  },
  {
    id: 'middle',
    category: 'middle',
    label: {
      ar: 'التعليم الإعدادي',
      fr: 'Enseignement de Base / Collège',
      en: 'Middle School',
    },
    subLevels: [
      { value: '7', label: { ar: 'السنة السابعة أساسي (7)', fr: '7ème Année de Base (7)', en: '7th Grade (7)' } },
      { value: '8', label: { ar: 'السنة الثامنة أساسي (8)', fr: '8ème Année de Base (8)', en: '8th Grade (8)' } },
      { value: '9', label: { ar: 'السنة التاسعة أساسي (9)', fr: '9ème Année de Base (9)', en: '9th Grade (9)' } },
    ],
  },
  {
    id: 'secondary',
    category: 'secondary',
    label: {
      ar: 'التعليم الثانوي',
      fr: 'Enseignement Secondaire',
      en: 'Secondary Education',
    },
    subLevels: [
      { value: '1', label: { ar: 'السنة الأولى ثانوي (1)', fr: '1ère Année Secondaire (1)', en: '1st Year Secondary (1)' } },
      { value: '2', label: { ar: 'السنة الثانية ثانوي (2)', fr: '2ème Année Secondaire (2)', en: '2nd Year Secondary (2)' } },
      { value: '3', label: { ar: 'السنة الثالثة ثانوي (3)', fr: '3ème Année Secondaire (3)', en: '3rd Year Secondary (3)' } },
      { value: '4', label: { ar: 'السنة الرابعة ثانوي / بكالوريا (4)', fr: '4ème Année / Baccalauréat (4)', en: '4th Year / Baccalaureate (4)' } },
    ],
  },
];

const INITIAL_ARTICLES: AdminArticle[] = [
  {
    id: 'art-1',
    sku: 'MATH-P1',
    name: {
      ar: 'كتاب الرياضيات - السنة الأولى ابتدائي',
      fr: 'Livre de Mathématiques - 1ère Année Primaire',
      en: 'Mathematics Book - 1st Grade Primary',
    },
    description: { ar: 'كتاب تلميذ الرياضيات للثلاثي الأول والثاني والثالث' },
    price: 18.5,
    discountPrice: 15.0,
    stock: 120,
    educationLevelId: 'primary',
    educationSubLevel: '1',
    quarter: 'ALL_YEAR',
    posterUrl: '/assets/covers/math1.jpg',
    samplePdfUrl: '/assets/samples/math1.pdf',
    author: 'المركز الوطني للبيداغوجيا',
    publisher: 'CNP',
    active: true,
  },
  {
    id: 'art-2',
    sku: 'ARAB-P1',
    name: {
      ar: 'كتاب القراءة واللغة العربية - السنة الأولى ابتدائي',
      fr: 'Livre de Langue Arabe 1ère Année',
      en: 'Arabic Language 1st Grade',
    },
    description: { ar: 'كتاب متكامل لتعلم الحروف والقراءة للسنوات الأولى' },
    price: 16.0,
    stock: 80,
    educationLevelId: 'primary',
    educationSubLevel: '1',
    quarter: 'ALL_YEAR',
    posterUrl: '/assets/covers/arabic1.jpg',
    samplePdfUrl: '/assets/samples/arabic1.pdf',
    author: 'المركز الوطني للبيداغوجيا',
    publisher: 'CNP',
    active: true,
  },
  {
    id: 'art-3',
    sku: 'MATH-P2',
    name: {
      ar: 'كتاب الرياضيات - السنة الثانية ابتدائي',
      fr: 'Livre de Mathématiques 2ème Année',
      en: 'Math Book 2nd Grade',
    },
    description: { ar: 'كتاب التلميذ في الحساب والهندسة وتنمية التفكير المنطقي' },
    price: 17.5,
    discountPrice: 14.5,
    stock: 65,
    educationLevelId: 'primary',
    educationSubLevel: '2',
    quarter: 'ALL_YEAR',
    posterUrl: '/assets/covers/math2.jpg',
    samplePdfUrl: '/assets/samples/math2.pdf',
    author: 'المركز الوطني للبيداغوجيا',
    publisher: 'CNP',
    active: true,
  },
  {
    id: 'art-4',
    sku: 'SCI-P2',
    name: {
      ar: 'كتاب الإيقاظ العلمي - السنة الثانية ابتدائي',
      fr: 'Livre d\'Éveil Scientifique 2ème Année',
      en: 'Scientific Awakening 2nd Grade',
    },
    description: { ar: 'أنشطة استكشاف البيئة وجسم الإنسان والتجارب العلمية المبسطة' },
    price: 14.0,
    stock: 50,
    educationLevelId: 'primary',
    educationSubLevel: '2',
    quarter: 'ALL_YEAR',
    posterUrl: '/assets/covers/science2.jpg',
    samplePdfUrl: '/assets/samples/science2.pdf',
    author: 'المركز الوطني للبيداغوجيا',
    publisher: 'CNP',
    active: true,
  },
  {
    id: 'art-5',
    sku: 'MATH-P3',
    name: {
      ar: 'كتاب الرياضيات - السنة الثالثة ابتدائي',
      fr: 'Livre de Mathématiques 3ème Année',
      en: 'Math Book 3rd Grade',
    },
    description: { ar: 'العمليات الحسابية الأساسية والأشكال الهندسية وحل المسائل' },
    price: 19.0,
    discountPrice: 16.0,
    stock: 70,
    educationLevelId: 'primary',
    educationSubLevel: '3',
    quarter: 'ALL_YEAR',
    posterUrl: '/assets/covers/math3.jpg',
    samplePdfUrl: '/assets/samples/math3.pdf',
    author: 'المركز الوطني للبيداغوجيا',
    publisher: 'CNP',
    active: true,
  },
  {
    id: 'art-6',
    sku: 'FRAN-P3',
    name: {
      ar: 'كتاب الفرنسية للناشئة - السنة الثالثة ابتدائي',
      fr: 'Manuel de Français 3ème Année',
      en: 'French Language 3rd Grade',
    },
    description: { ar: 'انطلاق تعلم اللغة الفرنسية: قراءة وحوارات وأنشطة كتابية أولى' },
    price: 18.0,
    stock: 60,
    educationLevelId: 'primary',
    educationSubLevel: '3',
    quarter: 'ALL_YEAR',
    posterUrl: '/assets/covers/french3.jpg',
    samplePdfUrl: '/assets/samples/french3.pdf',
    author: 'المركز الوطني للبيداغوجيا',
    publisher: 'CNP',
    active: true,
  },
  {
    id: 'art-7',
    sku: 'MATH-P4',
    name: {
      ar: 'كتاب الرياضيات - السنة الرابعة ابتدائي',
      fr: 'Livre de Mathématiques 4ème Année',
      en: 'Math Book 4th Grade',
    },
    description: { ar: 'الأعداد الكبيرة والضرب والقسمة والهندسة التطبيقية والمقادير' },
    price: 19.5,
    discountPrice: 16.5,
    stock: 75,
    educationLevelId: 'primary',
    educationSubLevel: '4',
    quarter: 'ALL_YEAR',
    posterUrl: '/assets/covers/math4.jpg',
    samplePdfUrl: '/assets/samples/math4.pdf',
    author: 'المركز الوطني للبيداغوجيا',
    publisher: 'CNP',
    active: true,
  },
  {
    id: 'art-8',
    sku: 'MATH-P5',
    name: {
      ar: 'كتاب الرياضيات - السنة الخامسة ابتدائي',
      fr: 'Livre de Mathématiques 5ème Année',
      en: 'Math Book 5th Grade',
    },
    description: { ar: 'الأعداد الكسرية والعشرية والنسب المئوية وحساب المساحات المعقدة' },
    price: 20.0,
    discountPrice: 17.0,
    stock: 80,
    educationLevelId: 'primary',
    educationSubLevel: '5',
    quarter: 'ALL_YEAR',
    posterUrl: '/assets/covers/math5.jpg',
    samplePdfUrl: '/assets/samples/math5.pdf',
    author: 'المركز الوطني للبيداغوجيا',
    publisher: 'CNP',
    active: true,
  },
  {
    id: 'art-9',
    sku: 'ENG-P5',
    name: {
      ar: 'كتاب الانجليزية - السنة الخامسة ابتدائي',
      fr: 'Manuel d\'Anglais 5ème Année',
      en: 'English for Kids 5th Grade',
    },
    description: { ar: 'مدخل إلى المحادثة والمفردات وقواعد اللغة الإنجليزية للطور الابتدائي' },
    price: 17.5,
    stock: 55,
    educationLevelId: 'primary',
    educationSubLevel: '5',
    quarter: 'ALL_YEAR',
    posterUrl: '/assets/covers/english5.jpg',
    samplePdfUrl: '/assets/samples/english5.pdf',
    author: 'المركز الوطني للبيداغوجيا',
    publisher: 'CNP',
    active: true,
  },
  {
    id: 'art-10',
    sku: 'MATH-P6',
    name: {
      ar: 'كتاب الرياضيات - السنة السادسة ابتدائي (مناظرة السيزيام)',
      fr: 'Manuel de Mathématiques 6ème Année (Concours)',
      en: 'Mathematics Textbook 6th Grade (National Exam)',
    },
    description: { ar: 'التحضير الشامل لمناظرة الدخول للمدارس الإعدادية النموذجية مع مسائل وحلول' },
    price: 21.0,
    discountPrice: 18.0,
    stock: 90,
    educationLevelId: 'primary',
    educationSubLevel: '6',
    quarter: 'ALL_YEAR',
    posterUrl: '/assets/covers/math6.jpg',
    samplePdfUrl: '/assets/samples/math6.pdf',
    author: 'المركز الوطني للبيداغوجيا',
    publisher: 'CNP',
    active: true,
  },
  {
    id: 'art-11',
    sku: 'SCI-P6',
    name: {
      ar: 'كتاب الإيقاظ العلمي - السنة السادسة ابتدائي',
      fr: 'Livre d\'Éveil Scientifique 6ème Année',
      en: 'Scientific Awakening 6th Grade',
    },
    description: { ar: 'المفاهيم الفيزيائية والبيولوجية والتحضير لمناظرة السيزيام' },
    price: 17.5,
    discountPrice: 15.0,
    stock: 70,
    educationLevelId: 'primary',
    educationSubLevel: '6',
    quarter: 'ALL_YEAR',
    posterUrl: '/assets/covers/science6.jpg',
    samplePdfUrl: '/assets/samples/science6.pdf',
    author: 'المركز الوطني للبيداغوجيا',
    publisher: 'CNP',
    active: true,
  },
];

export const ArticleAdmin: React.FC = () => {
  const { language, isRTL, t } = useLanguage();
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
  const [educationLevelId, setEducationLevelId] = useState('primary');
  const [educationSubLevel, setEducationSubLevel] = useState('1');
  const [quarter, setQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'ALL_YEAR'>('ALL_YEAR');
  const [posterUrl, setPosterUrl] = useState('');
  const [samplePdfUrl, setSamplePdfUrl] = useState('');
  const [active, setActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Level Selection and auto-update Sub-level Options
  const handleLevelChange = (levelId: string) => {
    setEducationLevelId(levelId);
    const selectedLevel = EDUCATION_LEVEL_OPTIONS.find((l) => l.id === levelId || l.category === levelId);
    if (selectedLevel && selectedLevel.subLevels.length > 0) {
      setEducationSubLevel(selectedLevel.subLevels[0].value);
    } else {
      setEducationSubLevel('');
    }
  };

  const currentLevelOption = EDUCATION_LEVEL_OPTIONS.find(
    (l) => l.id === educationLevelId || l.category === educationLevelId,
  ) || EDUCATION_LEVEL_OPTIONS[0];

  const levelSelectOptions = EDUCATION_LEVEL_OPTIONS.map((l) => ({
    value: l.id,
    label: l.label[language] || l.label.ar,
  }));

  const subLevelSelectOptions = (currentLevelOption?.subLevels || []).map((sl) => ({
    value: sl.value,
    label: sl.label[language] || sl.label.ar,
  }));

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

      const normalizedLevel = article.educationLevelId.startsWith('primary')
        ? 'primary'
        : article.educationLevelId.startsWith('middle')
        ? 'middle'
        : article.educationLevelId.startsWith('sec')
        ? 'secondary'
        : article.educationLevelId;
      setEducationLevelId(normalizedLevel);

      const matchedLevel = EDUCATION_LEVEL_OPTIONS.find((l) => l.id === normalizedLevel);
      const defaultSub = article.educationSubLevel || (matchedLevel?.subLevels[0]?.value ?? '1');
      setEducationSubLevel(defaultSub);

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
      setEducationLevelId('primary');
      setEducationSubLevel('1');
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
      setErrorMessage(t('admin.skuRequired'));
      return;
    }
    if (!nameAr.trim()) {
      setErrorMessage(t('admin.arNameRequired'));
      return;
    }
    const price = parseFloat(priceStr);
    if (isNaN(price) || price < 0) {
      setErrorMessage(t('admin.pricePositiveRequired'));
      return;
    }

    let discountPrice: number | undefined;
    if (discountStr.trim()) {
      discountPrice = parseFloat(discountStr);
      if (isNaN(discountPrice) || discountPrice < 0) {
        setErrorMessage(t('admin.discountPricePositiveRequired'));
        return;
      }
      if (discountPrice >= price) {
        setErrorMessage(t('admin.discountPriceLowerRequired'));
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
      educationSubLevel: educationSubLevel || undefined,
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
            📦 {t('admin.articlesManagementTitle')}
          </Text>
          <Text style={[styles.sectionSub, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('admin.articlesManagementSub')}
          </Text>
        </View>
        <Button
          title={`➕ ${t('admin.addNewArticle')}`}
          onPress={() => openModal()}
          variant="accent"
          size="md"
        />
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <TextInput
          style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
          placeholder={t('admin.searchArticlePlaceholder')}
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
                    label={art.active ? t('admin.active') : t('admin.inactive')}
                    variant={art.active ? 'primary' : 'discount'}
                  />
                  {art.educationSubLevel && (
                    <Badge
                      label={
                        art.educationLevelId === 'primary' || art.educationLevelId.startsWith('primary')
                          ? `سنة ${art.educationSubLevel} ابتدائي`
                          : art.educationLevelId === 'middle' || art.educationLevelId.startsWith('middle')
                          ? `سنة ${art.educationSubLevel} أساسي`
                          : `سنة ${art.educationSubLevel} ثانوي`
                      }
                      variant="primary"
                    />
                  )}
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

          {/* Education Level Dropdown */}
          <Select
            label={t('admin.educationLevelLabel')}
            options={levelSelectOptions}
            value={educationLevelId}
            onChange={handleLevelChange}
            placeholder={t('admin.selectEducationLevelPlaceholder')}
          />

          {/* Education Sub-Level (Academic Year) Dropdown */}
          <Select
            label={t('admin.educationSubLevelLabel')}
            options={subLevelSelectOptions}
            value={educationSubLevel}
            onChange={setEducationSubLevel}
            placeholder={t('admin.selectEducationSubLevelPlaceholder')}
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
