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
import {
  Gift,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  X,
  CheckCircle2,
  XCircle,
} from 'lucide-react-native';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Tooltip } from './ui/Tooltip';
import { GlassCard } from './ui/GlassCard';
import { colors, layout, shadows, typography } from '../theme/tokens';

export interface AdminPackItem {
  articleId: string;
  quantity: number;
}

export interface AdminPack {
  id: string;
  sku: string;
  name: { ar: string; fr?: string; en?: string };
  description?: { ar?: string; fr?: string; en?: string };
  price: number;
  discountPrice?: number;
  items: AdminPackItem[];
  posterUrl?: string;
  active: boolean;
}

const SAMPLE_ARTICLES = [
  { id: 'art-1', name: 'كتاب الرياضيات - السنة الأولى ابتدائي' },
  { id: 'art-2', name: 'كتاب العربية - السنة الثانية إعدادي' },
  { id: 'art-3', name: 'كتاب الفيزياء - السنة الثالثة ثانوي' },
];

const INITIAL_PACKS: AdminPack[] = [
  {
    id: 'pack-1',
    sku: 'PACK-PRIM-FULL',
    name: {
      ar: 'حزمة السنة الأولى ابتدائي الكاملة',
      fr: 'Pack Complet 1ère Année Primaire',
      en: 'Complete 1st Grade Primary Pack',
    },
    description: { ar: 'تتضمن كتب الرياضيات والعربية والتمارين' },
    price: 45.0,
    discountPrice: 38.0,
    items: [
      { articleId: 'art-1', quantity: 1 },
      { articleId: 'art-2', quantity: 1 },
    ],
    active: true,
  },
];

export const PackAdmin: React.FC = () => {
  const { language, isRTL, t } = useLanguage();
  const [packs, setPacks] = useState<AdminPack[]>(INITIAL_PACKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPack, setEditingPack] = useState<AdminPack | null>(null);

  // Form State
  const [sku, setSku] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [priceStr, setPriceStr] = useState('');
  const [discountStr, setDiscountStr] = useState('');
  const [selectedItems, setSelectedItems] = useState<AdminPackItem[]>([]);
  const [posterUrl, setPosterUrl] = useState('');
  const [active, setActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const openModal = (pack?: AdminPack) => {
    setErrorMessage('');
    if (pack) {
      setEditingPack(pack);
      setSku(pack.sku);
      setNameAr(pack.name.ar);
      setNameFr(pack.name.fr || '');
      setNameEn(pack.name.en || '');
      setDescAr(pack.description?.ar || '');
      setPriceStr(pack.price.toString());
      setDiscountStr(pack.discountPrice?.toString() || '');
      setSelectedItems([...pack.items]);
      setPosterUrl(pack.posterUrl || '');
      setActive(pack.active);
    } else {
      setEditingPack(null);
      setSku(`TUN-PACK-${Date.now().toString().slice(-4)}`);
      setNameAr('');
      setNameFr('');
      setNameEn('');
      setDescAr('');
      setPriceStr('');
      setDiscountStr('');
      setSelectedItems([{ articleId: 'art-1', quantity: 1 }]);
      setPosterUrl('');
      setActive(true);
    }
    setModalVisible(true);
  };

  const addItemRow = () => {
    const unusedArticle = SAMPLE_ARTICLES.find(
      (sa) => !selectedItems.some((si) => si.articleId === sa.id),
    );
    if (!unusedArticle) {
      setErrorMessage(t('admin.allBooksSelectedError'));
      return;
    }
    setSelectedItems((prev) => [...prev, { articleId: unusedArticle.id, quantity: 1 }]);
  };

  const removeItemRow = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItemRow = (index: number, articleId: string, quantity: number) => {
    setSelectedItems((prev) =>
      prev.map((item, i) => (i === index ? { articleId, quantity } : item)),
    );
  };

  const handleSave = () => {
    setErrorMessage('');
    if (!sku.trim()) {
      setErrorMessage(t('admin.packSkuRequired'));
      return;
    }
    if (!nameAr.trim()) {
      setErrorMessage(t('admin.packArNameRequired'));
      return;
    }
    const price = parseFloat(priceStr);
    if (isNaN(price) || price < 0) {
      setErrorMessage(t('admin.packPricePositiveRequired'));
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

    if (selectedItems.length === 0) {
      setErrorMessage(t('admin.minOneBookError'));
      return;
    }

    // Check duplicate article selections
    const articleIds = selectedItems.map((si) => si.articleId);
    if (new Set(articleIds).size !== articleIds.length) {
      setErrorMessage(t('admin.noDuplicateBooksError'));
      return;
    }

    const savedData: AdminPack = {
      id: editingPack ? editingPack.id : `pack_${Date.now()}`,
      sku,
      name: { ar: nameAr, fr: nameFr || undefined, en: nameEn || undefined },
      description: descAr ? { ar: descAr } : undefined,
      price,
      discountPrice,
      items: selectedItems,
      posterUrl: posterUrl || undefined,
      active,
    };

    if (editingPack) {
      setPacks((prev) => prev.map((p) => (p.id === editingPack.id ? savedData : p)));
    } else {
      setPacks((prev) => [savedData, ...prev]);
    }

    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    setPacks((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredPacks = packs.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.ar.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.name.fr && p.name.fr.toLowerCase().includes(q))
    );
  });

  return (
    <View style={styles.container}>
      {/* Top Header & Actions Card */}
      <GlassCard variant="dark" elevation="sm" style={styles.topRowCard}>
        <View style={[styles.topRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={styles.titleGroup}>
            <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }]}>
              <Gift size={22} color={colors.accentLight} />
              <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('admin.packsManagementTitle')}
              </Text>
            </View>
            <Text style={[styles.sectionSub, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('admin.packsManagementSub')}
            </Text>
          </View>
          <Button
            title={t('admin.addNewPack')}
            icon={<Plus size={18} color={colors.primaryDark} />}
            tooltip={t('admin.addNewPack')}
            onPress={() => openModal()}
            variant="accent"
            size="md"
          />
        </View>

        {/* Search Input */}
        <View style={styles.searchBox}>
          <TextInput
            style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('admin.searchPackPlaceholder')}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </GlassCard>

      {/* Table / List View */}
      <ScrollView style={styles.listScrollView}>
        {filteredPacks.map((pack) => (
          <GlassCard key={pack.id} variant="dark" elevation="sm" style={styles.packCard}>
            <View style={[styles.cardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={styles.packInfo}>
                <View style={[styles.skuRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Badge label="PACK" variant="pack" />
                  <Badge label={pack.sku} variant="outline" />
                  <Badge
                    label={pack.active ? t('admin.active') : t('admin.inactive')}
                    variant={pack.active ? 'primary' : 'discount'}
                  />
                </View>
                <Text style={[styles.packTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {pack.name[language] || pack.name.ar}
                </Text>
                <Text style={[styles.itemsSummary, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {t('admin.containsItems').replace('{count}', pack.items.length.toString())}
                </Text>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.priceCurrent}>
                  {(pack.discountPrice ?? pack.price).toFixed(2)} {t('app.currency')}
                </Text>
                {pack.discountPrice && (
                  <Text style={styles.priceOriginal}>{pack.price.toFixed(2)} {t('app.currency')}</Text>
                )}
              </View>
            </View>

            {/* Actions Footer */}
            <View style={[styles.cardActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Tooltip content={t('admin.editPack')}>
                <TouchableOpacity
                  style={[styles.editBtn, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }]}
                  onPress={() => openModal(pack)}
                  accessibilityLabel={t('admin.editPack')}
                >
                  <Pencil size={14} color={colors.accentLight} />
                  <Text style={styles.editBtnText}>{t('admin.editPack')}</Text>
                </TouchableOpacity>
              </Tooltip>
              <Tooltip content={t('admin.delete')}>
                <TouchableOpacity
                  style={[styles.deleteBtn, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }]}
                  onPress={() => handleDelete(pack.id)}
                  accessibilityLabel={t('admin.delete')}
                >
                  <Trash2 size={14} color={colors.error} />
                  <Text style={styles.deleteBtnText}>{t('admin.delete')}</Text>
                </TouchableOpacity>
              </Tooltip>
            </View>
          </GlassCard>
        ))}
      </ScrollView>

      {/* Pack Create / Edit Modal */}
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={editingPack ? t('admin.editPack') : t('admin.addNewPack')}
      >
        <ScrollView style={styles.formScroll}>
          {errorMessage ? (
            <View style={[styles.errorBanner, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }]}>
              <AlertCircle size={16} color="#D32F2F" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <Text style={styles.fieldLabel}>{t('admin.packSkuLabel')}:</Text>
          <TextInput
            style={styles.formInput}
            value={sku}
            onChangeText={setSku}
            placeholder="TUN-PACK-01"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.fieldLabel}>{t('admin.packTitleAr')} *:</Text>
          <TextInput
            style={styles.formInput}
            value={nameAr}
            onChangeText={setNameAr}
            placeholder="Pack Title in Arabic"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.fieldLabel}>{t('admin.packPriceLabel')} *:</Text>
          <TextInput
            style={styles.formInput}
            value={priceStr}
            onChangeText={setPriceStr}
            keyboardType="numeric"
            placeholder="45.00"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.fieldLabel}>{t('admin.discountPriceOpt')}:</Text>
          <TextInput
            style={styles.formInput}
            value={discountStr}
            onChangeText={setDiscountStr}
            keyboardType="numeric"
            placeholder="38.00"
            placeholderTextColor={colors.textMuted}
          />

          {/* Included Items Section */}
          <Text style={styles.fieldLabel}>{t('admin.includedBooksLabel')} *:</Text>
          {selectedItems.map((item, index) => (
            <View key={index} style={styles.itemSelectRow}>
              <ScrollView horizontal style={styles.pickerScroll}>
                {SAMPLE_ARTICLES.map((sa) => (
                  <TouchableOpacity
                    key={sa.id}
                    style={[
                      styles.artSelectChip,
                      item.articleId === sa.id && styles.artSelectChipActive,
                    ]}
                    onPress={() => updateItemRow(index, sa.id, item.quantity)}
                  >
                    <Text
                      style={[
                        styles.artSelectChipText,
                        item.articleId === sa.id && styles.artSelectChipTextActive,
                      ]}
                    >
                      {sa.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.qtyRow}>
                <Tooltip content={t('admin.delete')}>
                  <TouchableOpacity
                    style={styles.removeRowBtn}
                    onPress={() => removeItemRow(index)}
                    accessibilityLabel={t('admin.delete')}
                  >
                    <X size={16} color={colors.error} />
                  </TouchableOpacity>
                </Tooltip>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.addItemBtn, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }]}
            onPress={addItemRow}
          >
            <Plus size={16} color={colors.accentLight} />
            <Text style={styles.addItemBtnText}>{t('admin.addAnotherBook')}</Text>
          </TouchableOpacity>

          <Text style={styles.fieldLabel}>{t('admin.packCoverUrl')}:</Text>
          <TextInput
            style={styles.formInput}
            value={posterUrl}
            onChangeText={setPosterUrl}
            placeholder="/uploads/pack-poster.jpg"
            placeholderTextColor={colors.textMuted}
          />

          <TouchableOpacity
            style={[styles.toggleBtn, active && styles.toggleBtnActive, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }]}
            onPress={() => setActive(!active)}
          >
            {active ? <CheckCircle2 size={16} color="#059669" /> : <XCircle size={16} color="#DC2626" />}
            <Text style={styles.toggleText}>
              {t('admin.status')}: {active ? t('admin.statusEnabled') : t('admin.statusDisabled')}
            </Text>
          </TouchableOpacity>

          <Button
            title={editingPack ? t('admin.saveChanges') : t('admin.addPackBtn')}
            tooltip={editingPack ? t('admin.saveChanges') : t('admin.addPackBtn')}
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
  topRowCard: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.3)',
    gap: 12,
  },
  topRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  titleGroup: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
  },
  sectionSub: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  searchBox: {
    marginTop: 4,
  },
  searchInput: {
    backgroundColor: colors.cardBg,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.borderDark,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  listScrollView: {
    flex: 1,
  },
  packCard: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.25)',
  },
  cardHeader: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  packInfo: {
    flex: 1,
  },
  skuRow: {
    gap: 8,
    alignItems: 'center',
    marginBottom: 6,
  },
  packTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
  },
  itemsSummary: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceCurrent: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentLight,
  },
  priceOriginal: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  cardActions: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 193, 88, 0.2)',
    justifyContent: 'flex-end',
    gap: 12,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.3)',
  },
  editBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
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
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: layout.borderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  itemSelectRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 8,
    borderRadius: layout.borderRadius.sm,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.2)',
  },
  pickerScroll: {
    marginBottom: 6,
  },
  artSelectChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.full,
    backgroundColor: colors.cardBg,
    marginRight: 6,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  artSelectChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accentLight,
  },
  artSelectChipText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  artSelectChipTextActive: {
    color: colors.primaryDark,
    fontWeight: typography.fontWeight.bold,
  },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  removeRowBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#fee2e2',
    borderRadius: layout.borderRadius.sm,
  },
  addItemBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.35)',
    borderStyle: 'dashed',
    alignItems: 'center',
    marginVertical: 6,
  },
  addItemBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentLight,
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
