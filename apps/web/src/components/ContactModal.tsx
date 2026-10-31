import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { getApiUrl } from '../services/api';
import { colors, layout, typography } from '../theme/tokens';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';
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
        throw new Error(t('app.sendError'));
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || t('app.sendError'));
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
    <Modal visible={visible} onClose={handleClose} title={t('app.contactModalTitle')}>
      <ScrollView contentContainerStyle={styles.container}>
        {success ? (
          <View style={styles.successBox}>
            <CheckCircle2 size={50} color="#059669" style={{ alignSelf: 'center', marginBottom: 12 }} />

            <Text style={styles.successTitle}>{t('app.messageSuccessTitle')}</Text>
            <Text style={styles.successSub}>
              {t('app.messageSuccessSub')}
            </Text>
            <Button
              title={t('app.closeConfirmation')}
              tooltip={t('app.closeConfirmation')}
              onPress={handleClose}
              variant="accent"
              size="md"
              style={{ marginTop: 16 }}
            />
          </View>
        ) : (
          <View style={styles.form}>
            {errorMsg && (
              <View style={[styles.errorBox, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }]}>
                <AlertCircle size={16} color="#D32F2F" />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            <Input
              label={`${t('app.fullName')} *`}
              value={name}
              onChangeText={setName}
              placeholder="Ali Ben Salem"
            />

            <View style={styles.twoColRow}>
              <View style={{ flex: 1 }}>
                <Input
                  label={`${t('app.email')} *`}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@domain.tn"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Input
                  label={t('app.optionalPhone')}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="98 123 456"
                  keyboardType="phone-pad"
                  inputStyle={{ textAlign: 'left' }}
                  style={{ textAlign: 'left' }}
                />
              </View>
            </View>

            <Input
              label={`${t('app.subject')} *`}
              value={subject}
              onChangeText={setSubject}
              placeholder={t('app.subjectPlaceholder')}
            />

            <Input
              label={`${t('app.message')} *`}
              value={message}
              onChangeText={setMessage}
              placeholder={t('app.messagePlaceholder')}
              multiline
              numberOfLines={4}
              style={{ height: 100 }}
            />

            <Button
              title={loading ? t('app.sending') : t('app.sendMessage')}
              icon={<Send size={18} color={colors.primaryDark} />}
              tooltip={t('app.sendMessage')}
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
