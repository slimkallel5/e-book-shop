import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, useWindowDimensions } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Book3D } from './Book3D';
import { colors, typography, layout, spacing } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';
import { Book } from '../../mock/data';
import { Eye, Sparkles, Box, ShieldCheck } from 'lucide-react-native';

export interface ThreeDPreviewDemonstratorProps {
  sampleBooks?: Book[];
  onClose?: () => void;
}

export const ThreeDPreviewDemonstrator: React.FC<ThreeDPreviewDemonstratorProps> = ({
  sampleBooks = [],
  onClose,
}) => {
  const { language, isRTL, t } = useLanguage();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [selectedBookIndex, setSelectedBookIndex] = useState(0);
  const activeBook = sampleBooks[selectedBookIndex] || sampleBooks[0];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <GlassCard variant="goldGlow" elevation="glow" style={styles.bannerCard}>
        <View style={[styles.bannerHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={styles.iconBadge}>
            <Sparkles size={24} color={colors.accentLight} />
          </View>
          <View style={styles.headerTextCol}>
            <Text style={[styles.bannerTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {language === 'ar' ? 'معاينة البيئة ثلاثية الأبعاد (3D Digital Library)' : 'Interactive 3D Digital Library Preview'}
            </Text>
            <Text style={[styles.bannerSubtitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {language === 'ar'
                ? 'نموذج إثبات المفهوم التأسيسي: إضاءة مكتبية واقعية، كتب ثلاثية الأبعاد متفاعلة مع المؤشر، وأسطح زجاجية بلورية'
                : 'Foundational 3D Environment: realistic library lighting, pointer-interactive 3D books, and glassmorphic surfaces'}
            </Text>
          </View>
          {onClose && (
            <Button
              title={language === 'ar' ? 'إغلاق المعاينة' : 'Exit Preview'}
              variant="outline"
              size="sm"
              onPress={onClose}
            />
          )}
        </View>
      </GlassCard>

      <View style={[styles.showcaseRow, { flexDirection: isMobile ? 'column' : (isRTL ? 'row-reverse' : 'row') }]}>
        <GlassCard variant="ultraDark" elevation="lg" style={styles.bookStageCard}>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {language === 'ar' ? 'مجسم الكتاب ثلاثي الأبعاد' : 'Interactive 3D Mesh'}
          </Text>
          <View style={styles.book3DStage}>
            {activeBook ? (
              <Book3D
                coverUrl={activeBook.coverUrl}
                width={isMobile ? 180 : 220}
                height={(isMobile ? 180 : 220) * layout.a4AspectRatio}
                interactive
              />
            ) : (
              <Text style={styles.placeholderText}>No book selected</Text>
            )}
          </View>
          <Text style={styles.hintText}>
            {language === 'ar'
              ? 'حرّك مؤشر الفأرة فوق الكتاب للتدوير الديناميكي بزوايا ثلاثية الأبعاد'
              : 'Hover and move mouse over the book to inspect realistic 3D angles'}
          </Text>
        </GlassCard>

        <View style={styles.detailsCol}>
          {activeBook && (
            <GlassCard variant="dark" style={styles.metaCard}>
              <Text style={[styles.bookTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                {activeBook.title[language] || activeBook.title.ar}
              </Text>
              <Text style={[styles.bookDesc, { textAlign: isRTL ? 'right' : 'left' }]}>
                {activeBook.description[language] || activeBook.description.ar}
              </Text>
              <View style={[styles.priceRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.priceValue}>
                  {activeBook.discountPrice || activeBook.price} {t('app.currency')}
                </Text>
                {activeBook.discountPrice && (
                  <Text style={styles.oldPrice}>
                    {activeBook.price} {t('app.currency')}
                  </Text>
                )}
              </View>

              <View style={[styles.switcherRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                {sampleBooks.slice(0, 4).map((book, idx) => (
                  <Button
                    key={book.id}
                    title={`${idx + 1}`}
                    variant={selectedBookIndex === idx ? 'accent' : 'glass'}
                    size="sm"
                    onPress={() => setSelectedBookIndex(idx)}
                    style={styles.switchBtn}
                  />
                ))}
              </View>
            </GlassCard>
          )}

          <GlassCard variant="dark" style={styles.metaCard}>
            <View style={[styles.featureRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <ShieldCheck size={20} color={colors.accentLight} />
              <Text style={styles.featureText}>
                {language === 'ar'
                  ? 'دعم كامل للغة العربية (RTL) مع الفرنسية والإنجليزية (LTR)'
                  : 'True structural Arabic RTL and French/English LTR'}
              </Text>
            </View>
            <View style={[styles.featureRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Box size={20} color={colors.accentLight} />
              <Text style={styles.featureText}>
                {language === 'ar'
                  ? 'تراجع تلقائي آمن (2D Fallback) عند عدم دعم WebGL'
                  : 'Graceful 2D fallback for devices without WebGL'}
              </Text>
            </View>
            <View style={[styles.featureRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Eye size={20} color={colors.accentLight} />
              <Text style={styles.featureText}>
                {language === 'ar'
                  ? 'احترام تفضيلات تقليل الحركة (prefers-reduced-motion)'
                  : 'Respects prefers-reduced-motion accessibility preferences'}
              </Text>
            </View>
          </GlassCard>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
    gap: spacing.lg,
  },
  bannerCard: {
    padding: spacing.lg,
  },
  bannerHeader: {
    alignItems: 'center',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: layout.borderRadius.full,
    backgroundColor: 'rgba(229, 193, 88, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
    minWidth: 260,
  },
  bannerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textLightSecondary,
  },
  showcaseRow: {
    gap: spacing.lg,
    alignItems: 'flex-start',
  },
  bookStageCard: {
    flex: 1,
    minWidth: 320,
    padding: spacing.lg,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textGold,
    marginBottom: spacing.md,
    width: '100%',
  },
  book3DStage: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 340,
  },
  hintText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  placeholderText: {
    color: colors.textLight,
  },
  detailsCol: {
    flex: 1,
    minWidth: 320,
    gap: spacing.md,
  },
  metaCard: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  bookTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
  },
  bookDesc: {
    fontSize: typography.fontSize.sm,
    color: colors.textLightSecondary,
    lineHeight: 22,
  },
  priceRow: {
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.xs,
  },
  priceValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentLight,
  },
  oldPrice: {
    fontSize: typography.fontSize.md,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  switcherRow: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  switchBtn: {
    minWidth: 40,
  },
  featureRow: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 6,
  },
  featureText: {
    fontSize: typography.fontSize.sm,
    color: colors.textLightSecondary,
    flex: 1,
  },
});
