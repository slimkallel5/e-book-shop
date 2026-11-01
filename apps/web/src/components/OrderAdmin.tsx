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
import {
  ShoppingCart,
  RefreshCw,
  User,
  Phone,
  Mail,
  MapPin,
  XCircle,
  Eye,
  Check,
  AlertCircle,
  BookOpen,
  DollarSign,
} from 'lucide-react-native';
import { useLanguage } from '../context/LanguageContext';
import { getApiUrl } from '../services/api';
import { colors, layout, shadows, typography } from '../theme/tokens';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';
import { Modal } from './ui/Modal';
import { GlassCard } from './ui/GlassCard';

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
      <GlassCard variant="dark" elevation="sm" style={styles.topRowCard}>
        <View style={[styles.topRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View>
            <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }]}>
              <ShoppingCart size={22} color={colors.accentLight} />
              <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('admin.orderManagement')}
              </Text>
            </View>
            <Text style={[styles.subtitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('admin.orderManagementSub')}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.refreshBtn, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }]}
            onPress={fetchOrders}
          >
            <RefreshCw size={14} color={colors.accentLight} />
            <Text style={styles.refreshBtnText}>{t('admin.refreshData')}</Text>
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
      </GlassCard>

      {loading ? (
        <ActivityIndicator size="large" color={colors.accentLight} style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={styles.ordersList}>
          {orders.length === 0 ? (
            <Text style={styles.emptyText}>{t('admin.noMatchingOrders')}</Text>
          ) : (
            orders.map((ord) => {
              const badge = getStatusBadge(ord.status);
              return (
                <GlassCard key={ord.id} variant="dark" elevation="sm" style={styles.orderCard}>
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
                    <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }]}>
                      <User size={14} color={colors.accentLight} />
                      <Text style={styles.customerName}>{ord.customer.fullName}</Text>
                    </View>
                    <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }]}>
                      <Phone size={13} color={colors.textMuted} />
                      <Text style={styles.customerDetail}>{ord.customer.phone} | </Text>
                      <Mail size={13} color={colors.textMuted} />
                      <Text style={styles.customerDetail}>{ord.customer.email}</Text>
                    </View>
                    <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }]}>
                      <MapPin size={13} color={colors.textMuted} />
                      <Text style={styles.customerDetail}>{ord.customer.address}, {ord.customer.city}</Text>
                    </View>
                  </View>

                  {ord.status === 'rejected' && ord.rejectionReason && (
                    <View style={[styles.rejectionBox, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }]}>
                      <XCircle size={15} color="#DC2626" />
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
                      <Tooltip content={t('admin.details')}>
                        <TouchableOpacity
                          style={[styles.detailsBtn, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }]}
                          onPress={() => setSelectedOrder(ord)}
                          accessibilityLabel={t('admin.details')}
                        >
                          <Eye size={14} color={colors.accentLight} />
                          <Text style={styles.detailsBtnText}>{t('admin.details')}</Text>
                        </TouchableOpacity>
                      </Tooltip>

                      {ord.status !== 'delivered' && (
                        <Tooltip content={t('admin.deliver')}>
                          <TouchableOpacity
                            style={[styles.deliverBtn, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }]}
                            onPress={() => handleUpdateStatus(ord.id, 'delivered')}
                            accessibilityLabel={t('admin.deliver')}
                          >
                            <Check size={14} color="#059669" />
                            <Text style={styles.deliverBtnText}>{t('admin.deliver')}</Text>
                          </TouchableOpacity>
                        </Tooltip>
                      )}

                      {ord.status !== 'rejected' && (
                        <Tooltip content={t('admin.reject')}>
                          <TouchableOpacity
                            style={[styles.rejectBtn, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }]}
                            onPress={() => openRejectModal(ord.id)}
                            accessibilityLabel={t('admin.reject')}
                          >
                            <XCircle size={14} color={colors.error} />
                            <Text style={styles.rejectBtnText}>{t('admin.reject')}</Text>
                          </TouchableOpacity>
                        </Tooltip>
                      )}
                    </View>
                  </View>
                </GlassCard>
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
            placeholderTextColor={colors.textMuted}
            value={rejectionReasonInput}
            onChangeText={setRejectionReasonInput}
            multiline
            numberOfLines={3}
          />
          {rejectionError ? (
            <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginVertical: 6 }]}>
              <AlertCircle size={14} color="#D32F2F" />
              <Text style={styles.errorText}>{rejectionError}</Text>
            </View>
          ) : null}

          <Button
            title={t('admin.confirmReject')}
            tooltip={t('admin.confirmReject')}
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
          title={`${t('admin.orderDetailsTitle')}: ${selectedOrder.reference}`}
        >
          <ScrollView contentContainerStyle={styles.detailScroll}>
            <GlassCard variant="dark" elevation="sm" style={styles.detailBox}>
              <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginBottom: 8 }]}>
                <MapPin size={16} color={colors.accentLight} />
                <Text style={styles.detailTitle}>{t('admin.customerInfo')}</Text>
              </View>
              <Text style={styles.detailLine}>{t('app.fullName')}: {selectedOrder.customer.fullName}</Text>
              <Text style={styles.detailLine}>{t('app.phone')}: {selectedOrder.customer.phone}</Text>
              <Text style={styles.detailLine}>{t('app.address')}: {selectedOrder.customer.address}, {selectedOrder.customer.city}</Text>
            </GlassCard>

            <GlassCard variant="dark" elevation="sm" style={styles.detailBox}>
              <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginBottom: 8 }]}>
                <BookOpen size={16} color={colors.accentLight} />
                <Text style={styles.detailTitle}>{t('admin.orderItems')}</Text>
              </View>
              {selectedOrder.items.map((item, i) => (
                <View key={i} style={[styles.itemRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Text style={styles.itemName}>{item.name[language] || item.name.ar} × {item.quantity}</Text>
                  <Text style={styles.itemVal}>{item.subtotal.toFixed(2)} {t('app.currency')}</Text>
                </View>
              ))}
            </GlassCard>

            <GlassCard variant="dark" elevation="sm" style={styles.detailBox}>
              <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginBottom: 8 }]}>
                <DollarSign size={16} color={colors.accentLight} />
                <Text style={styles.detailTitle}>{t('admin.financialSummary')}</Text>
              </View>
              <Text style={styles.detailLine}>{t('app.subtotal')}: {selectedOrder.subtotal.toFixed(2)} {t('app.currency')}</Text>
              <Text style={styles.detailLine}>{t('app.delivery')}: {selectedOrder.deliveryFee.toFixed(2)} {t('app.currency')}</Text>
              <Text style={[styles.detailLine, { fontWeight: typography.fontWeight.bold, color: colors.accentLight }]}>
                {t('app.total')}: {selectedOrder.total.toFixed(2)} {t('app.currency')}
              </Text>
            </GlassCard>
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
    gap: 8,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  refreshBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(229, 193, 88, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.md,
  },
  refreshBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
  },
  tabsRow: {
    gap: 8,
    flexWrap: 'wrap',
  },
  tabPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(229, 193, 88, 0.25)',
    borderWidth: 1,
  },
  tabPillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accentLight,
  },
  tabPillText: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
  },
  tabPillTextActive: {
    color: colors.primaryDark,
    fontWeight: typography.fontWeight.bold,
  },
  searchInput: {
    backgroundColor: colors.cardBg,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.borderDark,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
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
    padding: 14,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.25)',
  },
  cardHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentLight,
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
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 10,
    borderRadius: layout.borderRadius.sm,
    gap: 2,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.15)',
  },
  customerName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
  },
  customerDetail: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.75)',
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
    borderTopColor: 'rgba(229, 193, 88, 0.2)',
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  totalVal: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentLight,
  },
  actionBtns: {
    gap: 8,
  },
  detailsBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(229, 193, 88, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.sm,
  },
  detailsBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
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
    backgroundColor: colors.cardBg,
    borderColor: colors.borderDark,
    borderWidth: 1,
    borderRadius: layout.borderRadius.sm,
    padding: 10,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
  },
  detailScroll: {
    gap: 12,
  },
  detailBox: {
    padding: 12,
    borderRadius: layout.borderRadius.sm,
    gap: 4,
  },
  detailTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentLight,
    marginBottom: 4,
  },
  detailLine: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
  },
  itemRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  itemName: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
  },
  itemVal: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentLight,
  },
});
