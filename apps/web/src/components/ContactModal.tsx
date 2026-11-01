import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { GlassCard } from './ui/GlassCard';
import { useLanguage } from '../context/LanguageContext';
import { getApiUrl } from '../services/api';
import { colors, layout, typography } from '../theme/tokens';

export interface ContactModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  visible,
  onClose,
}) => {
  const { isRTL, t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorMsg(t('app.requiredError'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/contact'), {
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
        throw new Error('Error sending contact message');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending contact message');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setErrorMsg(null);
    onClose();
  };

  return (
    <Modal visible={visible} onClose={handleClose} title={t('app.contactUs')}>
      <ScrollView contentContainerStyle={styles.container}>
        {success ? (
          <GlassCard variant="dark" elevation="sm" style={styles.successBox}>
            <CheckCircle2 size={42} color="#059669" style={{ alignSelf: 'center', marginBottom: 12 }} />
            <Text style={styles.successTitle}>{t('app.contactSuccessTitle')}</Text>
            <Text style={styles.successSub}>{t('app.contactSuccessSub')}</Text>
            <Button
              title={t('app.closeConfirmation')}
              onPress={handleClose}
              variant="accent"
              size="md"
              style={{ marginTop: 16 }}
            />
          </GlassCard>
        ) : (
          <View style={styles.formContent}>
            {errorMsg && (
              <View style={[styles.errorBox, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }]}>
                <AlertCircle size={16} color="#D32F2F" />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            <Text style={[styles.fieldLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('app.fullName')} *:
            </Text>
            <TextInput
              style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder="Sami Ben Ali"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />

            <Text style={[styles.fieldLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('app.email')} *:
            </Text>
            <TextInput
              style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder="sami@example.tn"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={[styles.fieldLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('app.phone')}:
            </Text>
            <TextInput
              style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder="20 123 456"
              placeholderTextColor={colors.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text style={[styles.fieldLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('app.subject')} *:
            </Text>
            <TextInput
              style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder="..."
              placeholderTextColor={colors.textMuted}
              value={subject}
              onChangeText={setSubject}
            />

            <Text style={[styles.fieldLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('app.message')} *:
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder="..."
              placeholderTextColor={colors.textMuted}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
            />

            <Button
              title={loading ? '...' : t('app.sendBtn')}
              icon={<Send size={16} color={colors.primaryDark} />}
              tooltip={t('app.sendBtn')}
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
    paddingVertical: 12,
  },
  formContent: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: 4,
  },
  input: {
    backgroundColor: colors.cardBg,
    borderColor: colors.borderDark,
    borderWidth: 1,
    borderRadius: layout.borderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  textArea: {
    height: 90,
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: layout.borderRadius.sm,
    marginBottom: 6,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: typography.fontSize.xs,
  },
  successBox: {
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  successTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
  },
  successSub: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
