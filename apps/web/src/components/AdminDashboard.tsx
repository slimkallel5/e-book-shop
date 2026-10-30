import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { getApiUrl } from '../services/api';
import { colors, layout, shadows, typography } from '../theme/tokens';

interface DashboardStats {
  totalArticles: number;
  totalPacks: number;
  totalOrders: number;
  ordersByStatus: {
    pending: number;
    in_progress: number;
    delivered: number;
    rejected: number;
  };
  orderValue: number;
  collectedRevenue: number;
  lowStockArticles: Array<{
    id: string;
    sku: string;
    name: { ar: string; fr?: string; en?: string };
    stock?: number;
  }>;
  recentOrders: Array<{
    id: string;
    reference: string;
    customer: { fullName: string; phone: string };
    total: number;
    status: string;
  }>;
}

interface AdminDashboardProps {
  token?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ token }) => {
  const { t, language, isRTL } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 12,
    totalPacks: 3,
    totalOrders: 18,
    ordersByStatus: {
      pending: 5,
      in_progress: 4,
      delivered: 8,
      rejected: 1,
    },
    orderValue: 485.5,
    collectedRevenue: 280.0,
    lowStockArticles: [
      {
        id: 'art-low-1',
        sku: 'MATH-P1',
        name: { ar: 'كتاب الرياضيات - السنة الأولى ابتدائي', fr: 'Maths 1ère Année' },
        stock: 4,
      },
      {
        id: 'art-low-2',
        sku: 'ARAB-M2',
        name: { ar: 'كتاب العربية - السنة الثانية إعدادي', fr: 'Arabe 8ème' },
        stock: 2,
      },
    ],
    recentOrders: [
      {
        id: 'ord-1',
        reference: 'TN-849201',
        customer: { fullName: 'أحمد بن علي', phone: '98 123 456' },
        total: 54.0,
        status: 'pending',
      },
      {
        id: 'ord-2',
        reference: 'TN-849200',
        customer: { fullName: 'مريم الصغير', phone: '22 456 789' },
        total: 32.5,
        status: 'delivered',
      },
    ],
  });

  useEffect(() => {
    if (!token) return;
    const fetchStats = async () => {
      try {
        const response = await fetch(getApiUrl('/admin/dashboard/stats'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch {
        // Keep default/mock state if server endpoint is unreachable in standalone web preview
      }
    };
    fetchStats();
  }, [token]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
        📊 {t('admin.dashboardTitle')}
      </Text>

      {/* KPI Cards Grid */}
      <View style={[styles.kpiGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{stats.totalArticles}</Text>
          <Text style={styles.kpiLabel}>{t('admin.totalArticles')}</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{stats.totalPacks}</Text>
          <Text style={styles.kpiLabel}>{t('admin.totalPacks')}</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>{stats.totalOrders}</Text>
          <Text style={styles.kpiLabel}>{t('admin.totalOrders')}</Text>
        </View>

        <View style={[styles.kpiCard, styles.kpiCardAccent]}>
          <Text style={styles.kpiValueAccent}>
            {stats.orderValue.toFixed(2)} {t('app.currency')}
          </Text>
          <Text style={styles.kpiLabel}>{t('admin.orderValue')}</Text>
        </View>

        <View style={[styles.kpiCard, styles.kpiCardSuccess]}>
          <Text style={styles.kpiValueSuccess}>
            {stats.collectedRevenue.toFixed(2)} {t('app.currency')}
          </Text>
          <Text style={styles.kpiLabel}>{t('admin.collectedRevenue')}</Text>
        </View>
      </View>

      {/* Order Status Breakdown Section */}
      <View style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          📦 {t('admin.statusBreakdown')}
        </Text>
        <View style={[styles.statusRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[styles.statusBadge, { backgroundColor: '#FEF3C7' }]}>
            <Text style={[styles.statusText, { color: '#D97706' }]}>
              {t('admin.pending')}: {stats.ordersByStatus.pending}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: '#DBEAFE' }]}>
            <Text style={[styles.statusText, { color: '#2563EB' }]}>
              {t('admin.inProgress')}: {stats.ordersByStatus.in_progress}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: '#D1FAE5' }]}>
            <Text style={[styles.statusText, { color: '#059669' }]}>
              {t('admin.delivered')}: {stats.ordersByStatus.delivered}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: '#FEE2E2' }]}>
            <Text style={[styles.statusText, { color: '#DC2626' }]}>
              {t('admin.rejected')}: {stats.ordersByStatus.rejected}
            </Text>
          </View>
        </View>
      </View>

      {/* Low-Stock Alerts Section */}
      <View style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          ⚠️ {t('admin.lowStockAlerts')}
        </Text>
        {stats.lowStockArticles.length === 0 ? (
          <Text style={styles.emptyText}>جميع الكتب متوفرة بمخزون جيد</Text>
        ) : (
          <View style={styles.table}>
            {stats.lowStockArticles.map((art) => (
              <View
                key={art.id}
                style={[styles.tableRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              >
                <Text style={styles.skuText}>{art.sku}</Text>
                <Text style={[styles.artName, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {art.name[language] || art.name.ar}
                </Text>
                <View style={styles.stockChip}>
                  <Text style={styles.stockChipText}>
                    {art.stock} {t('app.inStock')}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Recent Orders Section */}
      <View style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          🛒 {t('admin.recentOrders')}
        </Text>
        <View style={styles.table}>
          {stats.recentOrders.map((ord) => (
            <View
              key={ord.id}
              style={[styles.tableRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              <Text style={styles.refText}>{ord.reference}</Text>
              <Text style={styles.customerText}>
                {ord.customer.fullName} ({ord.customer.phone})
              </Text>
              <Text style={styles.orderTotal}>
                {ord.total.toFixed(2)} {t('app.currency')}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  kpiGrid: {
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    minWidth: 160,
    backgroundColor: colors.cardBg,
    padding: 16,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    ...shadows.sm,
  },
  kpiCardAccent: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(229, 193, 88, 0.1)',
  },
  kpiCardSuccess: {
    borderColor: colors.success,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
  },
  kpiValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  kpiValueAccent: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.secondary,
  },
  kpiValueSuccess: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
  },
  kpiLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: colors.cardBg,
    padding: 16,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  statusRow: {
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.full,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  table: {
    gap: 8,
  },
  tableRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  skuText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    width: 80,
  },
  artName: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  stockChip: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: layout.borderRadius.sm,
  },
  stockChipText: {
    fontSize: typography.fontSize.xs,
    color: '#DC2626',
    fontWeight: typography.fontWeight.bold,
  },
  refText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    width: 100,
  },
  customerText: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
  },
  orderTotal: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryDark,
  },
  emptyText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
});
