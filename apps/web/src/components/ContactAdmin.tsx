import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Mail,
  RefreshCw,
  User,
  Phone,
  Pin,
  Calendar,
  CheckCircle2,
} from 'lucide-react-native';
import { useLanguage } from '../context/LanguageContext';
import { getApiUrl } from '../services/api';
import { colors, layout, shadows, typography } from '../theme/tokens';
import { Badge } from './ui/Badge';
import { Tooltip } from './ui/Tooltip';
import { GlassCard } from './ui/GlassCard';

export interface AdminContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface ContactAdminProps {
  token?: string;
}

export const ContactAdmin: React.FC<ContactAdminProps> = ({ token }) => {
  const { isRTL, t } = useLanguage();
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/contact'), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch {
      // Mock fallback state if endpoint unreachable in standalone preview
      setMessages([
        {
          id: 'msg-1',
          name: 'محمد التونسي / Mohamed',
          email: 'mohamed@gmail.com',
          phone: '20 123 456',
          subject: 'استفسار عن كتب السنة الرابعة ثانوي',
          message: 'السلام عليكم، هل متوفر برنامج الرياضيات كاملاً لثلاثيات السنة الحالية؟ وشكراً.',
          read: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(getApiUrl(`/contact/${id}/read`), {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const updated = await res.json();
        setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
      }
    } catch (err: any) {
      alert(err.message || 'Error marking message as read');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header Card */}
      <GlassCard variant="dark" elevation="sm" style={styles.topRowCard}>
        <View style={[styles.topRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View>
            <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }]}>
              <Mail size={22} color={colors.accentLight} />
              <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('admin.contactMessagesTitle')}
              </Text>
            </View>
            <Text style={[styles.subtitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('admin.contactMessagesSub')}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.refreshBtn, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }]}
            onPress={fetchMessages}
          >
            <RefreshCw size={14} color={colors.accentLight} />
            <Text style={styles.refreshBtnText}>{t('admin.refresh')}</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>

      {loading ? (
        <ActivityIndicator size="large" color={colors.accentLight} style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={styles.list}>
          {messages.length === 0 ? (
            <Text style={styles.emptyText}>{t('admin.noNewMessages')}</Text>
          ) : (
            messages.map((msg) => (
              <GlassCard
                key={msg.id}
                variant={msg.read ? 'dark' : 'goldGlow'}
                elevation="sm"
                style={[styles.card, !msg.read && styles.unreadCard]}
              >
                <View style={[styles.cardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View>
                    <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }]}>
                      <User size={15} color={colors.accentLight} />
                      <Text style={styles.senderName}>{msg.name}</Text>
                    </View>
                    <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginTop: 2 }]}>
                      <Mail size={13} color={colors.textMuted} />
                      <Text style={styles.contactDetails}>{msg.email}</Text>
                      {msg.phone ? (
                        <>
                          <Text style={styles.contactDetails}> | </Text>
                          <Phone size={13} color={colors.textMuted} />
                          <Text style={styles.contactDetails}>{msg.phone}</Text>
                        </>
                      ) : null}
                    </View>
                  </View>
                  <Badge
                    label={msg.read ? t('admin.readStatus') : t('admin.newStatus')}
                    variant={msg.read ? 'outline' : 'primary'}
                  />
                </View>

                <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginVertical: 4 }]}>
                  <Pin size={14} color={colors.accent} />
                  <Text style={[styles.subjectText, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {t('app.subject')}: {msg.subject}
                  </Text>
                </View>

                <Text style={[styles.messageText, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {msg.message}
                </Text>

                <View style={[styles.cardFooter, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }]}>
                    <Calendar size={13} color={colors.textMuted} />
                    <Text style={styles.dateText}>
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </Text>
                  </View>

                  {!msg.read && (
                    <Tooltip content={t('admin.markAsRead')}>
                      <TouchableOpacity
                        style={[styles.readBtn, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }]}
                        onPress={() => markAsRead(msg.id)}
                        accessibilityLabel={t('admin.markAsRead')}
                      >
                        <CheckCircle2 size={14} color="#059669" />
                        <Text style={styles.readBtnText}>{t('admin.markAsRead')}</Text>
                      </TouchableOpacity>
                    </Tooltip>
                  )}
                </View>
              </GlassCard>
            ))
          )}
        </ScrollView>
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
  list: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 20,
  },
  card: {
    padding: 14,
    marginBottom: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.25)',
  },
  unreadCard: {
    borderColor: colors.accent,
    borderWidth: 1.5,
  },
  cardHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  senderName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
  },
  contactDetails: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  subjectText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentLight,
  },
  messageText: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
    lineHeight: 20,
  },
  cardFooter: {
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 193, 88, 0.2)',
    paddingTop: 8,
    marginTop: 4,
  },
  dateText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  readBtn: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.sm,
  },
  readBtnText: {
    color: '#059669',
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.xs,
  },
});
