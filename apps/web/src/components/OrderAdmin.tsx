import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { getApiUrl } from '../services/api';
import { colors, layout, shadows, typography } from '../theme/tokens';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { LottieIcon } from './icons';

export interface AdminOrderItem {
  type: 'article' | 'pack';
  itemId: string;
  name: { ar: string; fr?: string; en?: string };
  unitPrice: number;
  discountPrice?: number;
  quantity: number;
  subtotal: number;
}

export interface AdminOrder {
  id: string;
  reference: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    instructions?: string;
  };
  items: AdminOrderItem[];
  subtotal: number;
  deliveryFee: number;
  appliedDeliveryRuleId?: string;
  total: number;
  status: 'pending' | 'in_progress' | 'delivered' | 'rejected';
  rejectionReason?: string;
  paymentMethod: 'cash_on_delivery';
  paymentStatus: 'unpaid' | 'paid';
  createdAt: string;
  updatedAt: string;
}

interface OrderAdminProps {
  token?: string;
}

export const OrderAdmin: React.FC<OrderAdminProps> = ({ token }) => {
  const { t, language, isRTL } = useLanguage();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal for Order Details & Rejection
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [targetRejectOrderId, setTargetRejectOrderId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [rejectionError, setRejectionError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let endpoint = '/orders';
      const params: string[] = [];
      if (selectedStatus !== 'all') params.push(`status=${selectedStatus}`);
      if (searchQuery.trim()) params.push(`search=${encodeURIComponent(searchQuery.trim())}`);
      if (params.length > 0) endpoint += `?${params.join('&')}`;

      const url = getApiUrl(endpoint);
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      // Fallback mock orders if API is unreachable
      setOrders([
        {
          id: 'ord-101',
          reference: 'TN-849201',
          customer: {
            fullName: 'أحمد بن علي / Ahmed Ben Ali',
            email: 'ahmed@gmail.com',
            phone: '98 123 456',
            city: 'تونس / Tunis',
            address: 'شارع الحبيب بورقيبة 12',
          },
          items: [
            {
              type: 'article',
              itemId: 'art-1',
              name: { ar: 'كتاب الرياضيات - السنة الأولى ابتدائي' },
              unitPrice: 18.5,
              discountPrice: 15.0,
              quantity: 2,
              subtotal: 30.0,
            },
          ],
          subtotal: 30.0,
          deliveryFee: 7.0,
          total: 37.0,
          status: 'pending',
          paymentMethod: 'cash_on_delivery',
          paymentStatus: 'unpaid',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, searchQuery, token]);

  const handleUpdateStatus = async (orderId: string, newStatus: AdminOrder['status'], reason?: string) => {
    try {
      const res = await fetch(getApiUrl(`/orders/${orderId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: newStatus,
          rejectionReason: reason,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update order status');
      }

      const updatedOrder: AdminOrder = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const openRejectModal = (orderId: string) => {
    setTargetRejectOrderId(orderId);
    setRejectionReasonInput('');
    setRejectionError('');
    setRejectionModalVisible(true);
  };

  const confirmRejection = async () => {
    if (!rejectionReasonInput.trim()) {
      setRejectionError(t('admin.rejectionRequiredError'));
      return;
    }
    if (targetRejectOrderId) {
      await handleUpdateStatus(targetRejectOrderId, 'rejected', rejectionReasonInput.trim());
      setRejectionModalVisible(false);
      setTargetRejectOrderId(null);
    }
  };

  const getStatusBadge = (status: AdminOrder['status']) => {
    switch (status) {
      case 'pending':
        return { label: t('admin.pending'), bg: '#FFF3E0', color: '#E65100' };
      case 'in_progress':
        return { label: t('admin.inProgress'), bg: '#E1F5FE', color: '#0288D1' };
      case 'delivered':
        return { label: t('admin.delivered'), bg: '#E8F5E9', color: '#2E7D32' };
      case 'rejected':
        return { label: t('admin.rejected'), bg: '#FFEBEE', color: '#C62828' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header & Filter Controls */}
      <View style={[styles.topRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View>
          <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }]}>
            <LottieIcon name="cart" size={20} />
            <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('admin.orderManagement')}
            </Text>
          </View>
          <Text style={[styles.subtitle, { textAlign: isRTL ? 'right' : 'left', marginTop: 2 }]}>
            {t('admin.orderManagementSub')}
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={fetchOrders}>
          <Text style={styles.refreshBtnText}>🔄 {t('admin.refreshData')}</Text>
        </TouchableOpacity>
      </View>

      {/* Status Filter Tabs */}
      <View style={[styles.tabsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {[
          { key: 'all', label: t('admin.all') },
          { key: 'pending', label: t('admin.pending') },
          { key: 'in_progress', label: t('admin.inProgress') },
          { key: 'delivered', label: t('admin.delivered') },
          { key: 'rejected', label: t('admin.rejected') },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabPill, selectedStatus === tab.key && styles.tabPillActive]}
            onPress={() => setSelectedStatus(tab.key)}
          >
            <Text style={[styles.tabPillText, selectedStatus === tab.key && styles.tabPillTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Input */}
      <TextInput
        style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
        placeholder={t('admin.searchOrderPlaceholder')}
        placeholderTextColor={colors.textMuted}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={styles.ordersList}>
          {orders.length === 0 ? (
            <Text style={styles.emptyText}>{t('admin.noMatchingOrders')}</Text>
          ) : (
            orders.map((ord) => {
              const badge = getStatusBadge(ord.status);
              return (
                <View key={ord.id} style={styles.orderCard}>
                  {/* Header Row */}
                  <View style={[styles.cardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <View>
                      <Text style={styles.refText}>{ord.reference}</Text>
                      <Text style={styles.dateText}>
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: badge.color }]}>
                        {badge.label}
                      </Text>
                    </View>
                  </View>

                  {/* Customer Info */}
                  <View style={[styles.customerInfoBox, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                    <Text style={styles.customerName}>👤 {ord.customer.fullName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <LottieIcon name="phone" size={14} />
                      <Text style={styles.customerDetail}>{ord.customer.phone}</Text>
                      <Text style={styles.customerDetail}>|</Text>
                      <LottieIcon name="mail" size={14} />
                      <Text style={styles.customerDetail}>{ord.customer.email}</Text>
                    </View>
                    <Text style={styles.customerDetail}>📍 {ord.customer.address}, {ord.customer.city}</Text>
                  </View>

                  {ord.status === 'rejected' && ord.rejectionReason && (
                    <View style={[styles.rejectionBox, { flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
                      <LottieIcon name="close" size={14} />
                      <Text style={styles.rejectionText}>{t('admin.rejectionReasonLabel')}: {ord.rejectionReason}</Text>
                    </View>
                  )}

                  {/* Total & Action Footer */}
                  <View style={[styles.cardFooter, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <View>
                      <Text style={styles.totalLabel}>{t('app.total')}:</Text>
                      <Text style={styles.totalVal}>{ord.total.toFixed(2)} {t('app.currency')}</Text>
                    </View>

                    <View style={[styles.actionBtns, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <TouchableOpacity
                        style={[styles.detailsBtn, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}
                        onPress={() => setSelectedOrder(ord)}
                      >
                        <LottieIcon name="eye" size={14} />
                        <Text style={styles.detailsBtnText}>التفاصيل</Text>
                      </TouchableOpacity>

                      {ord.status !== 'delivered' && (
                        <TouchableOpacity
                          style={[styles.deliverBtn, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}
                          onPress={() => handleUpdateStatus(ord.id, 'delivered')}
                        >
                          <LottieIcon name="check" size={14} />
                          <Text style={styles.deliverBtnText}>تسليم</Text>
                        </TouchableOpacity>
                      )}

                      {ord.status !== 'rejected' && (
                        <TouchableOpacity
                          style={[styles.rejectBtn, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}
                          onPress={() => openRejectModal(ord.id)}
                        >
                          <LottieIcon name="close" size={14} />
                          <Text style={styles.rejectBtnText}>رفض</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Rejection Modal */}
      <Modal
        visible={rejectionModalVisible}
        onClose={() => setRejectionModalVisible(false)}
        title="رفض الطلب"
      >
        <View style={styles.modalContent}>
          <Text style={[styles.modalLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
            الرجاء كتابة سبب الرفض (مطلوب) *:
          </Text>
          <TextInput
            style={[styles.textArea, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder="مثال: عدم توفر المخزون، أو عنوان غير مكتمل..."
            value={rejectionReasonInput}
            onChangeText={setRejectionReasonInput}
            multiline
            numberOfLines={3}
          />
          {rejectionError ? (
            <Text style={styles.errorText}>⚠️ {rejectionError}</Text>
          ) : null}

          <Button
            title="تأكيد رفض الطلب"
            onPress={confirmRejection}
            variant="accent"
            size="md"
            style={{ marginTop: 12 }}
          />
        </View>
      </Modal>

      {/* Order Detail View Modal */}
      {selectedOrder && (
        <Modal
          visible={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`تفاصيل الطلب: ${selectedOrder.reference}`}
        >
          <ScrollView contentContainerStyle={styles.detailScroll}>
            <View style={styles.detailBox}>
              <Text style={styles.detailTitle}>📍 معلومات الحريف</Text>
              <Text style={styles.detailLine}>الاسم: {selectedOrder.customer.fullName}</Text>
              <Text style={styles.detailLine}>الهاتف: {selectedOrder.customer.phone}</Text>
              <Text style={styles.detailLine}>العنوان: {selectedOrder.customer.address}, {selectedOrder.customer.city}</Text>
            </View>

            <View style={styles.detailBox}>
              <Text style={styles.detailTitle}>📚 عناصر الطلب</Text>
              {selectedOrder.items.map((item, i) => (
                <View key={i} style={[styles.itemRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Text style={styles.itemName}>{item.name[language] || item.name.ar} × {item.quantity}</Text>
                  <Text style={styles.itemVal}>{item.subtotal.toFixed(2)} د.ت</Text>
                </View>
              ))}
            </View>

            <View style={styles.detailBox}>
              <Text style={styles.detailTitle}>💰 المجموع المالي</Text>
              <Text style={styles.detailLine}>المجموع الفرعي: {selectedOrder.subtotal.toFixed(2)} د.ت</Text>
              <Text style={styles.detailLine}>رسوم التوصيل: {selectedOrder.deliveryFee.toFixed(2)} د.ت</Text>
              <Text style={[styles.detailLine, { fontWeight: typography.fontWeight.bold, color: colors.primary }]}>
                الإجمالي: {selectedOrder.total.toFixed(2)} د.ت
              </Text>
            </View>
          </ScrollView>
        </Modal>
      )}
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
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  refreshBtn: {
    backgroundColor: colors.cardBg,
    borderColor: colors.borderDark,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.md,
  },
  refreshBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  tabsRow: {
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  tabPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.full,
    backgroundColor: colors.cardBg,
    borderColor: colors.border,
    borderWidth: 1,
  },
  tabPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabPillText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  tabPillTextActive: {
    color: colors.textLight,
    fontWeight: typography.fontWeight.bold,
  },
  searchInput: {
    backgroundColor: colors.cardBg,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: typography.fontSize.sm,
    marginBottom: 12,
  },
  ordersList: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 20,
  },
  orderCard: {
    backgroundColor: colors.cardBg,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: layout.borderRadius.md,
    padding: 14,
    marginBottom: 12,
    gap: 10,
    ...shadows.sm,
  },
  cardHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  dateText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: layout.borderRadius.full,
  },
  statusBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  customerInfoBox: {
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: layout.borderRadius.sm,
    gap: 2,
  },
  customerName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  customerDetail: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  rejectionBox: {
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: layout.borderRadius.sm,
  },
  rejectionText: {
    fontSize: typography.fontSize.xs,
    color: '#C62828',
  },
  cardFooter: {
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  totalVal: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  actionBtns: {
    gap: 8,
  },
  detailsBtn: {
    backgroundColor: colors.background,
    borderColor: colors.borderDark,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.sm,
  },
  detailsBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  deliverBtn: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.sm,
  },
  deliverBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#059669',
  },
  rejectBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.sm,
  },
  rejectBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#DC2626',
  },
  modalContent: {
    gap: 10,
  },
  modalLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  textArea: {
    backgroundColor: colors.background,
    borderColor: colors.borderDark,
    borderWidth: 1,
    borderRadius: layout.borderRadius.sm,
    padding: 10,
    fontSize: typography.fontSize.sm,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
  },
  detailScroll: {
    gap: 12,
  },
  detailBox: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: layout.borderRadius.sm,
    gap: 4,
  },
  detailTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: 4,
  },
  detailLine: {
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
  },
  itemRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  itemName: {
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
  },
  itemVal: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
});
