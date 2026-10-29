import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { colors, layout, typography } from '../theme/tokens';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';

export interface ContactModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ visible, onClose }) => {
  const { isRTL, t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorMsg(t('app.requiredError'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error('فشل في إرسال الرسالة. يرجى إعادة المحاولة.');
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'خطأ في إرسال الرسالة');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
    setErrorMsg(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Modal visible={visible} onClose={handleClose} title="📩 اتصل بنا / Contact Us">
      <ScrollView contentContainerStyle={styles.container}>
        {success ? (
          <View style={styles.successBox}>
            <Text style={styles.successBadge}>✅</Text>

            <Text style={styles.successTitle}>تم إرسال رسالتك بنجاح!</Text>
            <Text style={styles.successSub}>
              شكراً لتواصلك معنا. سيقوم فريق خدمة الحرفاء بالرد عليك عبر البريد أو الهاتف في أقرب وقت.
            </Text>
            <Button
              title={t('app.closeConfirmation')}
              onPress={handleClose}
              variant="accent"
              size="md"
              style={{ marginTop: 16 }}
            />
          </View>
        ) : (
          <View style={styles.form}>
            {errorMsg && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
              </View>
            )}

            <Input
              label="الاسم واللقب / Name *"
              value={name}
              onChangeText={setName}
              placeholder="مثال: علي بن سالم"
            />

            <View style={styles.twoColRow}>
              <View style={{ flex: 1 }}>
                <Input
                  label="البريد الإلكتروني / Email *"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@domain.tn"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Input
                  label="الهاتف / Phone (اختياري)"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="98 123 456"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <Input
              label="الموضوع / Subject *"
              value={subject}
              onChangeText={setSubject}
              placeholder="استفسار عن الكتب، طلب خاص، إلخ..."
            />

            <Input
              label="الرسالة / Message *"
              value={message}
              onChangeText={setMessage}
              placeholder="اكتب تفاصيل استفسارك هنا..."
              multiline
              numberOfLines={4}
              style={{ height: 100 }}
            />

            <Button
              title={loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
              onPress={handleSubmit}
              variant="accent"
              size="lg"
              disabled={loading}
              style={{ marginTop: 12 }}
            />
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
  form: {
    gap: 10,
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
    padding: 10,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: typography.fontSize.xs,
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  successBadge: {
    fontSize: 48,
  },
  successTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  successSub: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
