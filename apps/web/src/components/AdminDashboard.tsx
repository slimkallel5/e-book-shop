import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {
  BarChart3,
  Package,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  DollarSign,
} from 'lucide-react-native';
import { useLanguage } from '../context/LanguageContext';
import { getApiUrl } from '../services/api';
import { colors, layout, shadows, typography } from '../theme/tokens';
import { GlassCard } from './ui/GlassCard';

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
      <GlassCard variant="dark" elevation="sm" style={styles.headerBanner}>
        <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }]}>
          <BarChart3 size={24} color={colors.accentLight} />
          <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('admin.dashboardTitle')}
          </Text>
        </View>
      </GlassCard>

      {/* KPI Cards Grid using GlassCard */}
      <View style={[styles.kpiGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <GlassCard variant="dark" elevation="sm" style={styles.kpiCard}>
          <Package size={20} color={colors.accentLight} style={{ marginBottom: 6 }} />
          <Text style={styles.kpiValue}>{stats.totalArticles}</Text>
          <Text style={styles.kpiLabel}>{t('admin.totalArticles')}</Text>
        </GlassCard>

        <GlassCard variant="dark" elevation="sm" style={styles.kpiCard}>
          <Package size={20} color={colors.accentLight} style={{ marginBottom: 6 }} />
          <Text style={styles.kpiValue}>{stats.totalPacks}</Text>
          <Text style={styles.kpiLabel}>{t('admin.totalPacks')}</Text>
        </GlassCard>

        <GlassCard variant="dark" elevation="sm" style={styles.kpiCard}>
          <ShoppingCart size={20} color={colors.accentLight} style={{ marginBottom: 6 }} />
          <Text style={styles.kpiValue}>{stats.totalOrders}</Text>
          <Text style={styles.kpiLabel}>{t('admin.totalOrders')}</Text>
        </GlassCard>

        <GlassCard variant="goldGlow" elevation="md" style={styles.kpiCard}>
          <TrendingUp size={20} color={colors.accentLight} style={{ marginBottom: 6 }} />
          <Text style={styles.kpiValueAccent}>
            {stats.orderValue.toFixed(2)} {t('app.currency')}
          </Text>
          <Text style={styles.kpiLabel}>{t('admin.orderValue')}</Text>
        </GlassCard>

        <GlassCard variant="dark" elevation="sm" style={[styles.kpiCard, styles.kpiCardSuccess]}>
          <DollarSign size={20} color={colors.success} style={{ marginBottom: 6 }} />
          <Text style={styles.kpiValueSuccess}>
            {stats.collectedRevenue.toFixed(2)} {t('app.currency')}
          </Text>
          <Text style={styles.kpiLabel}>{t('admin.collectedRevenue')}</Text>
        </GlassCard>
      </View>

      {/* Order Status Breakdown Section */}
      <GlassCard variant="dark" elevation="sm" style={styles.sectionCard}>
        <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, marginBottom: 12 }]}>
          <Package size={20} color={colors.accentLight} />
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('admin.statusBreakdown')}
          </Text>
        </View>
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
      </GlassCard>

      {/* Low-Stock Alerts Section */}
      <GlassCard variant="dark" elevation="sm" style={styles.sectionCard}>
        <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, marginBottom: 12 }]}>
          <AlertTriangle size={20} color="#D97706" />
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('admin.lowStockAlerts')}
          </Text>
        </View>
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
      </GlassCard>

      {/* Recent Orders Section */}
      <GlassCard variant="dark" elevation="sm" style={styles.sectionCard}>
        <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, marginBottom: 12 }]}>
          <ShoppingCart size={20} color={colors.accentLight} />
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('admin.recentOrders')}
          </Text>
        </View>
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
      </GlassCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  headerBanner: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.3)',
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
  },
  kpiGrid: {
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    minWidth: 160,
    padding: 16,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.25)',
    alignItems: 'center',
    ...shadows.sm,
  },
  kpiCardSuccess: {
    borderColor: colors.success,
  },
  kpiValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
  },
  kpiValueAccent: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentLight,
  },
  kpiValueSuccess: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
  },
  kpiLabel: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionCard: {
    padding: 16,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(229, 193, 88, 0.25)',
    gap: 12,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
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
    borderBottomColor: 'rgba(229, 193, 88, 0.2)',
    gap: 8,
  },
  skuText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentLight,
    width: 80,
  },
  artName: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
  },
  stockChip: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  stockChipText: {
    fontSize: typography.fontSize.xs,
    color: '#EF4444',
    fontWeight: typography.fontWeight.bold,
  },
  refText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentLight,
    width: 100,
  },
  customerText: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
  },
  orderTotal: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentLight,
  },
  emptyText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
});
