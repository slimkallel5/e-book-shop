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
  Star,
  RefreshCw,
  User,
  Calendar,
  EyeOff,
  CheckCircle2,
} from 'lucide-react-native';
import { useLanguage } from '../context/LanguageContext';
import { getApiUrl } from '../services/api';
import { colors, layout, shadows, typography } from '../theme/tokens';
import { Badge } from './ui/Badge';
import { Tooltip } from './ui/Tooltip';

export interface AdminReview {
  id: string;
  articleId?: string;
  rating: number;
  authorName: string;
  comment: string;
  published: boolean;
  createdAt: string;
}

interface ReviewAdminProps {
  token?: string;
}

export const ReviewAdmin: React.FC<ReviewAdminProps> = ({ token }) => {
  const { t, isRTL } = useLanguage();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'published' | 'pending'>('all');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/reviews'), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch {
      // Mock fallback state if endpoint unreachable in standalone preview
      setReviews([
        {
          id: 'rev-1',
          articleId: 'art-1',
          rating: 5,
          authorName: 'أيمن الماجري / Aymen',
          comment: 'كتاب ممتاز وشرح مبسط جداً للرياضيات. التوصيل كان سريعاً.',
          published: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'rev-2',
          rating: 4,
          authorName: 'سارة التونسية / Sarah',
          comment: 'تجربة شراء ممتازة للكتب المدرسية التونسية.',
          published: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [token]);

  const togglePublish = async (reviewId: string, currentPublishedStatus: boolean) => {
    try {
      const res = await fetch(getApiUrl(`/reviews/${reviewId}/publish`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ published: !currentPublishedStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setReviews((prev) => prev.map((r) => (r.id === reviewId ? updated : r)));
      }
    } catch (err: any) {
      alert(err.message || 'Error updating review');
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'published') return r.published;
    if (filter === 'pending') return !r.published;
    return true;
  });

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.topRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View>
          <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }]}>
            <Star size={22} color={colors.accent} fill={colors.accent} />
            <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('admin.reviewsManagementTitle')}
            </Text>
          </View>
          <Text style={[styles.subtitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('admin.reviewsManagementSub')}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.refreshBtn, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }]}
          onPress={fetchReviews}
        >
          <RefreshCw size={14} color={colors.primary} />
          <Text style={styles.refreshBtnText}>{t('admin.refresh')}</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={[styles.tabsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {[
          { key: 'all', label: t('admin.all') },
          { key: 'pending', label: t('admin.underReview') },
          { key: 'published', label: t('admin.published') },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabPill, filter === tab.key && styles.tabPillActive]}
            onPress={() => setFilter(tab.key as any)}
          >
            <Text style={[styles.tabPillText, filter === tab.key && styles.tabPillTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={styles.list}>
          {filteredReviews.length === 0 ? (
            <Text style={styles.emptyText}>{t('admin.noReviews')}</Text>
          ) : (
            filteredReviews.map((rev) => (
              <View key={rev.id} style={styles.card}>
                <View style={[styles.cardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View>
                    <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }]}>
                      <User size={15} color={colors.primary} />
                      <Text style={styles.authorName}>{rev.authorName}</Text>
                    </View>
                    <Text style={styles.starsText}>{renderStars(rev.rating)} ({rev.rating}/5)</Text>
                  </View>
                  <Badge
                    label={rev.published ? t('admin.publishedSingle') : t('admin.underReview')}
                    variant={rev.published ? 'primary' : 'discount'}
                  />
                </View>

                <Text style={[styles.commentText, { textAlign: isRTL ? 'right' : 'left' }]}>
                  "{rev.comment}"
                </Text>

                <View style={[styles.cardFooter, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }]}>
                    <Calendar size={13} color={colors.textMuted} />
                    <Text style={styles.dateText}>
                      {new Date(rev.createdAt).toLocaleDateString()} {rev.articleId ? `| ${t('admin.bookId')}: ${rev.articleId}` : `| ${t('admin.storeReview')}`}
                    </Text>
                  </View>

                  <Tooltip content={rev.published ? t('admin.hide') : t('admin.approveAndPublish')}>
                    <TouchableOpacity
                      style={[styles.actionBtn, rev.published ? styles.hideBtn : styles.publishBtn, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }]}
                      onPress={() => togglePublish(rev.id, rev.published)}
                      accessibilityLabel={rev.published ? t('admin.hide') : t('admin.approveAndPublish')}
                    >
                      {rev.published ? <EyeOff size={14} color="#6B7280" /> : <CheckCircle2 size={14} color="#FFFFFF" />}
                      <Text style={[styles.actionBtnText, rev.published ? styles.hideBtnText : styles.publishBtnText]}>
                        {rev.published ? t('admin.hide') : t('admin.approveAndPublish')}
                      </Text>
                    </TouchableOpacity>
                  </Tooltip>
                </View>
              </View>
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
    backgroundColor: colors.cardBg,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: layout.borderRadius.md,
    padding: 14,
    marginBottom: 12,
    gap: 8,
    ...shadows.sm,
  },
  cardHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  starsText: {
    fontSize: typography.fontSize.xs,
    color: colors.secondary,
    marginTop: 2,
  },
  commentText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  cardFooter: {
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    marginTop: 4,
  },
  dateText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.sm,
  },
  publishBtn: {
    backgroundColor: '#D1FAE5',
  },
  publishBtnText: {
    color: '#059669',
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.xs,
  },
  hideBtn: {
    backgroundColor: '#F3F4F6',
  },
  hideBtnText: {
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.xs,
  },
  actionBtnText: {
    fontSize: typography.fontSize.xs,
  },
});
