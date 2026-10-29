import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { colors, layout, shadows, typography } from '../theme/tokens';

export interface OrderLookupModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface LookupOrderDetails {
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
  items: Array<{
    type: string;
    name: { ar: string; fr?: string; en?: string };
    unitPrice: number;
    discountPrice?: number;
    quantity: number;
    subtotal: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'in_progress' | 'delivered' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({ visible, onClose }) => {
  const { language, isRTL, t } = useLanguage();

  const [referenceInput, setReferenceInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<LookupOrderDetails | null>(null);

  const handleSearch = async () => {
    setErrorMsg(null);
    setOrderData(null);

    const ref = referenceInput.trim();
    if (!ref) {
      setErrorMsg(t('app.enterOrderRef'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/v1/orders/lookup/${encodeURIComponent(ref)}`);
      if (res.status === 404) {
        throw new Error(t('app.orderNotFound'));
      }
      if (!res.ok) {
        throw new Error('Failed to retrieve order status');
      }

      const data: LookupOrderDetails = await res.json();
      setOrderData(data);
    } catch (err: any) {
      setErrorMsg(err.message || t('app.orderNotFound'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: t('admin.pending'), color: '#E65100', bg: '#FFF3E0' };
      case 'in_progress':
        return { label: t('admin.inProgress'), color: '#0288D1', bg: '#E1F5FE' };
      case 'delivered':
        return { label: t('admin.delivered'), color: '#2E7D32', bg: '#E8F5E9' };
      case 'rejected':
        return { label: t('admin.rejected'), color: '#C62828', bg: '#FFEBEE' };
      default:
        return { label: status, color: colors.textSecondary, bg: colors.background };
    }
  };

  const handleClose = () => {
    setReferenceInput('');
    setErrorMsg(null);
    setOrderData(null);
    onClose();
  };

  return (
    <Modal visible={visible} onClose={handleClose} title={t('app.lookupOrderTitle')}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.searchBox}>
          <Input
            label={t('app.enterOrderRef')}
            value={referenceInput}
            onChangeText={setReferenceInput}
            placeholder="TN-123456-789"
            autoCapitalize="characters"
          />
          <Button
            title={loading ? 'جاري البحث...' : t('app.searchOrder')}
            onPress={handleSearch}
            variant="accent"
            size="md"
            disabled={loading}
          />
        </View>

        {errorMsg && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
          </View>
        )}

        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        )}

        {orderData && (
          <View style={styles.orderCard}>
            {/* Order Header */}
            <View style={[styles.orderHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View>
                <Text style={styles.refLabel}>{t('app.orderRefLabel')}</Text>
                <Text style={styles.refCode}>{orderData.reference}</Text>
              </View>

              {(() => {
                const badge = getStatusBadge(orderData.status);
                return (
                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: badge.color }]}>
                      {badge.label}
                    </Text>
                  </View>
                );
              })()}
            </View>

            {orderData.status === 'rejected' && orderData.rejectionReason && (
              <View style={styles.rejectionBox}>
                <Text style={styles.rejectionText}>
                  ❌ سبب الرفض: {orderData.rejectionReason}
                </Text>
              </View>
            )}

            {/* Delivery Details */}
            <View style={styles.detailsBox}>
              <Text style={[styles.detailsHeading, { textAlign: isRTL ? 'right' : 'left' }]}>
                📍 {t('app.customerDetails')}
              </Text>
              <Text style={[styles.detailText, { textAlign: isRTL ? 'right' : 'left' }]}>
                {orderData.customer.fullName} ({orderData.customer.phone})
              </Text>
              <Text style={[styles.detailText, { textAlign: isRTL ? 'right' : 'left' }]}>
                {orderData.customer.address}, {orderData.customer.city}
              </Text>
            </View>

            {/* Items Summary */}
            <View style={styles.itemsBox}>
              {orderData.items.map((item, idx) => (
                <View
                  key={idx}
                  style={[styles.itemRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                >
                  <Text style={[styles.itemName, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {item.name[language] || item.name.ar} × {item.quantity}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {item.subtotal.toFixed(2)} {t('app.currency')}
                  </Text>
                </View>
              ))}
            </View>

            {/* Order Breakdown */}
            <View style={styles.breakdownBox}>
              <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.summaryLabel}>{t('app.subtotal')}:</Text>
                <Text style={styles.summaryVal}>{orderData.subtotal.toFixed(2)} {t('app.currency')}</Text>
              </View>

              <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.summaryLabel}>{t('app.delivery')}:</Text>
                <Text style={styles.summaryVal}>{orderData.deliveryFee.toFixed(2)} {t('app.currency')}</Text>
              </View>

              <View style={[styles.summaryRow, styles.totalRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.totalLabel}>{t('app.total')}:</Text>
                <Text style={styles.totalVal}>{orderData.total.toFixed(2)} {t('app.currency')}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  searchBox: {
    gap: 12,
    marginBottom: 16,
  },
  loadingBox: {
    padding: 20,
    alignItems: 'center',
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
    borderWidth: 1,
    borderRadius: layout.borderRadius.md,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: typography.fontSize.sm,
  },
  orderCard: {
    backgroundColor: colors.cardBg,
    borderColor: colors.borderDark,
    borderWidth: 1,
    borderRadius: layout.borderRadius.lg,
    padding: 16,
    gap: 12,
    ...shadows.sm,
  },
  orderHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  refCode: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.full,
  },
  statusBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  rejectionBox: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: layout.borderRadius.md,
  },
  rejectionText: {
    color: '#C62828',
    fontSize: typography.fontSize.xs,
  },
  detailsBox: {
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: layout.borderRadius.md,
    gap: 4,
  },
  detailsHeading: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  detailText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  itemsBox: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    gap: 6,
  },
  itemRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
    flex: 1,
  },
  itemPrice: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  breakdownBox: {
    gap: 6,
  },
  summaryRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  summaryVal: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.borderDark,
    paddingTop: 6,
    marginTop: 2,
  },
  totalLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  totalVal: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});
