import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  Package,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  MapPin,
  Calendar,
} from 'lucide-react-native';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { GlassCard } from './ui/GlassCard';
import { useLanguage } from '../context/LanguageContext';
import { getApiUrl } from '../services/api';
import { colors, layout, shadows, typography } from '../theme/tokens';

export interface OrderLookupModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface LookedUpOrder {
  id: string;
  reference: string;
  customer: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
  };
  items: Array<{
    name: { ar: string; fr?: string; en?: string };
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

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({
  visible,
  onClose,
}) => {
  const { isRTL, language, t } = useLanguage();
  const [reference, setReference] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [order, setOrder] = useState<LookedUpOrder | null>(null);

  const handleLookup = async () => {
    setErrorMsg(null);
    setOrder(null);

    if (!reference.trim() || !phone.trim()) {
      setErrorMsg(t('app.lookupRequiredFields'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        getApiUrl(
          `/orders/lookup?reference=${encodeURIComponent(
            reference.trim(),
          )}&phone=${encodeURIComponent(phone.trim())}`,
        ),
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || t('app.orderNotFound'));
      }

      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setErrorMsg(err.message || t('app.orderNotFound'));
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = (status: LookedUpOrder['status']) => {
    switch (status) {
      case 'pending':
        return <Badge label={t('admin.pending')} variant="discount" />;
      case 'in_progress':
        return <Badge label={t('admin.inProgress')} variant="secondary" />;
      case 'delivered':
        return <Badge label={t('admin.delivered')} variant="primary" />;
      case 'rejected':
        return <Badge label={t('admin.rejected')} variant="discount" />;
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} title={t('app.lookupOrderTitle')}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.searchSection}>
          <Text style={[styles.infoText, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('app.lookupOrderDesc')}
          </Text>

          {errorMsg && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('app.orderRefPlaceholder')}
            placeholderTextColor={colors.textMuted}
            value={reference}
            onChangeText={setReference}
            autoCapitalize="characters"
          />

          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('app.phonePlaceholder')}
            placeholderTextColor={colors.textMuted}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Button
            title={loading ? '...' : t('app.lookupBtn')}
            icon={<Search size={16} color={colors.primaryDark} />}
            tooltip={t('app.lookupBtn')}
            onPress={handleLookup}
            variant="accent"
            size="md"
            disabled={loading}
          />
        </View>

        {order && (
          <GlassCard variant="dark" elevation="md" style={styles.resultCard}>
            <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View>
                <Text style={styles.refText}>{order.reference}</Text>
                <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4, marginTop: 4 }]}>
                  <Calendar size={13} color={colors.textMuted} />
                  <Text style={styles.dateText}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              {renderStatusBadge(order.status)}
            </View>

            {order.status === 'rejected' && order.rejectionReason && (
              <View style={styles.rejectNotice}>
                <Text style={styles.rejectNoticeText}>
                  {t('admin.rejectionReasonLabel')}: {order.rejectionReason}
                </Text>
              </View>
            )}

            <View style={styles.sectionDivider} />

            <View style={[styles.customerRow, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Text style={styles.customerName}>{order.customer.fullName}</Text>
              <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4, marginTop: 2 }]}>
                <MapPin size={13} color={colors.accentLight} />
                <Text style={styles.customerAddress}>
                  {order.customer.address}, {order.customer.city}
                </Text>
              </View>
            </View>

            <View style={styles.itemsList}>
              <Text style={[styles.itemsHeading, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('admin.orderItems')}:
              </Text>
              {order.items.map((it, idx) => (
                <View key={idx} style={[styles.itemLine, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Text style={styles.itemName}>
                    {it.name[language] || it.name.ar} × {it.quantity}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {it.subtotal.toFixed(2)} {t('app.currency')}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.sectionDivider} />

            <View style={[styles.totalRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={styles.totalLabel}>{t('app.total')}:</Text>
              <Text style={styles.totalValue}>
                {order.total.toFixed(2)} {t('app.currency')}
              </Text>
            </View>
          </GlassCard>
        )}
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    gap: 16,
  },
  searchSection: {
    gap: 12,
  },
  infoText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: layout.borderRadius.sm,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  input: {
    backgroundColor: colors.cardBg,
    borderColor: colors.borderDark,
    borderWidth: 1,
    borderRadius: layout.borderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  resultCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.35)',
    gap: 10,
  },
  headerRow: {
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
  rejectNotice: {
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: layout.borderRadius.sm,
  },
  rejectNoticeText: {
    color: '#C62828',
    fontSize: typography.fontSize.xs,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(229, 193, 88, 0.25)',
    marginVertical: 4,
  },
  customerRow: {
    gap: 2,
  },
  customerName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
  },
  customerAddress: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  itemsList: {
    gap: 6,
    marginTop: 4,
  },
  itemsHeading: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentLight,
  },
  itemLine: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
  },
  itemPrice: {
    fontSize: typography.fontSize.xs,
    color: colors.accentLight,
    fontWeight: typography.fontWeight.bold,
  },
  totalRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
  },
  totalValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentLight,
  },
});
