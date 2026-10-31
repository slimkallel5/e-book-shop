import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  CheckCircle2,
  AlertCircle,
  User,
  Truck,
  Banknote,
  Copy,
  Check,
} from 'lucide-react-native';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';
import { useLanguage } from '../context/LanguageContext';
import { CartItem } from '../context/StoreContext';
import { getApiUrl } from '../services/api';
import { colors, layout, shadows, typography } from '../theme/tokens';

export interface CheckoutModalProps {
  visible: boolean;
  onClose: () => void;
  cart: CartItem[];
  subtotal: number;
  onSuccess: (orderReference: string) => void;
}

export interface CreatedOrder {
  id: string;
  reference: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  visible,
  onClose,
  cart,
  subtotal,
  onSuccess,
}) => {
  const { isRTL, t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');

  const [deliveryFee, setDeliveryFee] = useState<number>(7.0);
  const [isFreeDelivery, setIsFreeDelivery] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<CreatedOrder | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch server delivery rules to compute delivery fee dynamically
  useEffect(() => {
    if (visible) {
      fetch(getApiUrl('/delivery-rules?activeOnly=true'))
        .then((res) => res.json())
        .then((rules) => {
          if (Array.isArray(rules) && rules.length > 0) {
            let appliedFee = 7.0;
            let free = false;
            for (const rule of rules) {
              if (
                subtotal >= rule.minSubtotal &&
                (rule.maxSubtotal === undefined || rule.maxSubtotal === null || subtotal <= rule.maxSubtotal)
              ) {
                appliedFee = rule.isFree ? 0 : rule.fee;
                free = rule.isFree;
                break;
              }
            }
            setDeliveryFee(appliedFee);
            setIsFreeDelivery(free);
          } else {
            setIsFreeDelivery(subtotal >= 100);
            setDeliveryFee(subtotal >= 100 ? 0 : 7.0);
          }
        })
        .catch(() => {
          setIsFreeDelivery(subtotal >= 100);
          setDeliveryFee(subtotal >= 100 ? 0 : 7.0);
        });
    }
  }, [visible, subtotal]);

  const validateTunisianPhone = (p: string) => {
    const clean = p.replace(/[\s\-\+]/g, '');
    return /^(216)?\d{8}$/.test(clean);
  };

  const handleSubmit = async () => {
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      setErrorMsg(t('app.requiredError'));
      return;
    }

    if (!validateTunisianPhone(phone)) {
      setErrorMsg(t('app.phoneError'));
      return;
    }

    setLoading(true);

    try {
      const orderItems = cart.map((item) => ({
        type: item.book.isPack ? ('pack' as const) : ('article' as const),
        itemId: item.book.id,
        quantity: item.quantity,
      }));

      const res = await fetch(getApiUrl('/orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            fullName: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            city: city.trim(),
            address: address.trim(),
            instructions: instructions.trim() || undefined,
          },
          items: orderItems,
          recaptchaToken: 'dev-recaptcha-token',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || t('app.orderProcessingError'));
      }

      const createdOrder: CreatedOrder = await res.json();
      setConfirmedOrder(createdOrder);
      onSuccess(createdOrder.reference);
    } catch (err: any) {
      setErrorMsg(err.message || t('app.orderProcessingError'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmedOrder(null);
    setErrorMsg(null);
    setCopied(false);
    onClose();
  };

  const totalAmount = subtotal + deliveryFee;

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title={confirmedOrder ? t('app.orderSuccessTitle') : t('app.checkout')}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {confirmedOrder ? (
          /* Order Confirmation Screen */
          <View style={styles.successContainer}>
            <CheckCircle2 size={54} color="#059669" style={{ alignSelf: 'center', marginBottom: 12 }} />
            <Text style={styles.successTitle}>{t('app.orderSuccessTitle')}</Text>
            <Text style={styles.successSub}>{t('app.orderSuccessSub')}</Text>

            <View style={styles.referenceBox}>
              <Text style={styles.referenceLabel}>{t('app.orderRefLabel')}:</Text>
              <Text style={styles.referenceCode}>{confirmedOrder.reference}</Text>
              <Tooltip content={copied ? t('app.copied') : t('app.copyRef')}>
                <TouchableOpacity
                  style={[styles.copyBtn, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}
                  onPress={() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  accessibilityLabel={t('app.copyRef')}
                >
                  {copied ? <Check size={14} color={colors.primaryDark} /> : <Copy size={14} color={colors.primaryDark} />}
                  <Text style={styles.copyBtnText}>
                    {copied ? t('app.copied') : t('app.copyRef')}
                  </Text>
                </TouchableOpacity>
              </Tooltip>
            </View>

            <View style={styles.orderSummaryBox}>
              <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.summaryLabel}>{t('app.subtotal')}:</Text>
                <Text style={styles.summaryVal}>{confirmedOrder.subtotal.toFixed(2)} {t('app.currency')}</Text>
              </View>
              <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.summaryLabel}>{t('app.delivery')}:</Text>
                <Text style={styles.summaryVal}>{confirmedOrder.deliveryFee.toFixed(2)} {t('app.currency')}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.totalLabel}>{t('app.total')}:</Text>
                <Text style={styles.totalVal}>{confirmedOrder.total.toFixed(2)} {t('app.currency')}</Text>
              </View>
            </View>

            <Button
              title={t('app.closeConfirmation')}
              tooltip={t('app.closeConfirmation')}
              onPress={handleClose}
              variant="accent"
              size="lg"
              style={{ width: '100%', marginTop: 20 }}
            />
          </View>
        ) : (
          /* Customer Checkout Form */
          <View style={styles.formContent}>
            {errorMsg && (
              <View style={[styles.errorBox, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }]}>
                <AlertCircle size={16} color="#D32F2F" />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            {/* Customer Details */}
            <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginBottom: 12 }]}>
              <User size={18} color={colors.primary} />
              <Text style={[styles.sectionHeading, { textAlign: isRTL ? 'right' : 'left', marginBottom: 0 }]}>
                {t('app.customerDetails')}
              </Text>
            </View>

            <Input
              label={t('app.fullName')}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Sami Ben Ali"
            />

            <View style={styles.twoColRow}>
              <View style={{ flex: 1 }}>
                <Input
                  label={t('app.email')}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@domain.tn"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Input
                  label={t('app.phone')}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="20 123 456"
                  keyboardType="phone-pad"
                  inputStyle={{ textAlign: 'left' }}
                  style={{ textAlign: 'left' }}
                />
              </View>
            </View>

            <Input
              label={t('app.city')}
              value={city}
              onChangeText={setCity}
              placeholder="Tunis / Ariana / Sousse / Sfax"
            />

            <Input
              label={t('app.address')}
              value={address}
              onChangeText={setAddress}
              placeholder="Av. Habib Bourguiba, App. 4"
            />

            <Input
              label={t('app.instructions')}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="..."
            />

            {/* Payment & Delivery Summary */}
            <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginTop: 16, marginBottom: 8 }]}>
              <Truck size={18} color={colors.primary} />
              <Text style={[styles.sectionHeading, { textAlign: isRTL ? 'right' : 'left', marginBottom: 0 }]}>
                {t('app.paymentMethodLabel')}
              </Text>
            </View>

            <View style={styles.paymentMethodBox}>
              <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }]}>
                <Banknote size={18} color={colors.primaryDark} />
                <Text style={styles.paymentMethodTitle}>{t('app.cashOnDelivery')}</Text>
              </View>
              <Text style={styles.paymentMethodSub}>
                {t('app.cashOnDeliverySub')}
              </Text>
            </View>

            {/* Financial Breakdown */}
            <View style={styles.breakdownCard}>
              <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.summaryLabel}>{t('app.subtotal')}:</Text>
                <Text style={styles.summaryVal}>{subtotal.toFixed(2)} {t('app.currency')}</Text>
              </View>

              <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.summaryLabel}>{t('app.delivery')}:</Text>
                <Text style={[styles.summaryVal, isFreeDelivery && styles.freeBadge]}>
                  {isFreeDelivery ? t('app.freeDeliveryBadge') : `${deliveryFee.toFixed(2)} ${t('app.currency')}`}
                </Text>
              </View>

              <View style={[styles.summaryRow, styles.totalRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.totalLabel}>{t('app.total')}:</Text>
                <Text style={styles.totalVal}>{totalAmount.toFixed(2)} {t('app.currency')}</Text>
              </View>
            </View>

            <Button
              title={loading ? t('app.submittingOrder') : t('app.submitOrder')}
              icon={<Truck size={18} color={colors.primaryDark} />}
              tooltip={t('app.submitOrder')}
              onPress={handleSubmit}
              variant="accent"
              size="lg"
              disabled={loading}
              style={{ marginTop: 20 }}
            />
          </View>
        )}
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  formContent: {
    gap: 12,
  },
  sectionHeading: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: 4,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
    borderWidth: 1,
    borderRadius: layout.borderRadius.md,
    padding: 12,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  paymentMethodBox: {
    backgroundColor: colors.cardBg,
    borderColor: colors.accent,
    borderWidth: 1.5,
    borderRadius: layout.borderRadius.md,
    padding: 14,
    ...shadows.sm,
  },
  paymentMethodTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryDark,
  },
  paymentMethodSub: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 4,
  },
  breakdownCard: {
    backgroundColor: colors.background,
    borderColor: colors.borderDark,
    borderWidth: 1,
    borderRadius: layout.borderRadius.md,
    padding: 14,
    marginTop: 12,
    gap: 8,
  },
  summaryRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  summaryVal: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  freeBadge: {
    color: colors.secondary,
    fontWeight: typography.fontWeight.bold,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.borderDark,
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  totalVal: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successBadge: {
    fontSize: 48,
    marginBottom: 12,
  },
  successTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSub: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  referenceBox: {
    backgroundColor: colors.primaryDark,
    padding: 16,
    borderRadius: layout.borderRadius.lg,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    ...shadows.md,
  },
  referenceLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.accentLight,
    marginBottom: 4,
  },
  referenceCode: {
    fontSize: 24,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
    letterSpacing: 2,
    marginBottom: 12,
  },
  copyBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.full,
  },
  copyBtnText: {
    color: colors.primaryDark,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.xs,
  },
  orderSummaryBox: {
    width: '100%',
    backgroundColor: colors.cardBg,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: layout.borderRadius.md,
    padding: 14,
    gap: 8,
  },
});
