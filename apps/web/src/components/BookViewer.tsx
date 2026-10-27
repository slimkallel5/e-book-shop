import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Book } from '../mock/data';
import { useLanguage } from '../context/LanguageContext';
import { colors, layout, shadows, typography } from '../theme/tokens';
import { Button } from './ui/Button';

interface BookViewerProps {
  book: Book | null;
  visible: boolean;
  onClose: () => void;
}

export const BookViewer: React.FC<BookViewerProps> = ({ book, visible, onClose }) => {
  const { language, isRTL, t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!book) return null;

  const samplePages = book.samplePages || [];
  const hasPages = samplePages.length > 0;
  const title = book.title[language] || book.title.ar;

  const handleNextPage = () => {
    if (currentPage < samplePages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // In RTL mode (Arabic), next page goes left-to-right structurally
  const onRightArrow = isRTL ? handlePrevPage : handleNextPage;
  const onLeftArrow = isRTL ? handleNextPage : handlePrevPage;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.viewerContainer}>
          {/* Header Controls */}
          <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={styles.titleCol}>
              <Text style={[styles.bookTitle, { textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.pageCounter}>
                {hasPages ? `${t('app.page')} ${currentPage + 1} ${t('app.of')} ${samplePages.length}` : t('app.noPreview')}
              </Text>
            </View>

            <View style={[styles.actionsGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {hasPages && (
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => setIsZoomed(!isZoomed)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.iconBtnText}>{isZoomed ? '🔍-' : '🔍+'}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3D Realistic Book Stage */}
          <View style={styles.stage}>
            {hasPages ? (
              <View style={styles.book3DWrapper}>
                {/* Left Navigation Arrow */}
                <TouchableOpacity
                  style={[styles.navArrow, styles.navArrowLeft]}
                  onPress={onLeftArrow}
                  disabled={isRTL ? currentPage === samplePages.length - 1 : currentPage === 0}
                  activeOpacity={0.7}
                >
                  <Text style={styles.navArrowText}>{isRTL ? '▶' : '◀'}</Text>
                </TouchableOpacity>

                {/* Simulated Interactive 3D Open Page Spread */}
                <View style={[styles.spreadContainer, isZoomed && styles.zoomedContainer]}>
                  {/* Spine Depth Shadow */}
                  <View style={styles.spineShadow} />

                  <Image
                    source={{ uri: samplePages[currentPage] }}
                    style={styles.pageImage}
                    resizeMode="contain"
                  />
                </View>

                {/* Right Navigation Arrow */}
                <TouchableOpacity
                  style={[styles.navArrow, styles.navArrowRight]}
                  onPress={onRightArrow}
                  disabled={isRTL ? currentPage === 0 : currentPage === samplePages.length - 1}
                  activeOpacity={0.7}
                >
                  <Text style={styles.navArrowText}>{isRTL ? '◀' : '▶'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📭</Text>
                <Text style={styles.emptyStateText}>{t('app.noPreview')}</Text>
              </View>
            )}
          </View>

          {/* Footer Page Turning Bar */}
          {hasPages && (
            <View style={[styles.footerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Button
                title={t('app.prevPage')}
                onPress={handlePrevPage}
                disabled={currentPage === 0}
                variant="outline"
                size="sm"
              />
              <Text style={styles.footerPageInfo}>
                {currentPage + 1} / {samplePages.length}
              </Text>
              <Button
                title={t('app.nextPage')}
                onPress={handleNextPage}
                disabled={currentPage === samplePages.length - 1}
                variant="primary"
                size="sm"
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 35, 25, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  viewerContainer: {
    width: '100%',
    maxWidth: 900,
    height: '88%',
    backgroundColor: colors.background,
    borderRadius: layout.borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
    flexDirection: 'column',
  },
  headerRow: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleCol: {
    flex: 1,
    marginRight: 10,
    marginLeft: 10,
  },
  bookTitle: {
    color: colors.textLight,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  pageCounter: {
    color: colors.accent,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  actionsGroup: {
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.sm,
  },
  iconBtnText: {
    color: colors.textLight,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  closeBtn: {
    backgroundColor: colors.error,
    width: 32,
    height: 32,
    borderRadius: layout.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: colors.textLight,
    fontWeight: typography.fontWeight.bold,
  },
  stage: {
    flex: 1,
    backgroundColor: '#1E2923',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    position: 'relative',
  },
  book3DWrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navArrow: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 44,
    height: 44,
    borderRadius: layout.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  navArrowLeft: {
    marginRight: 8,
  },
  navArrowRight: {
    marginLeft: 8,
  },
  navArrowText: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: typography.fontWeight.bold,
  },
  spreadContainer: {
    flex: 1,
    height: '100%',
    backgroundColor: colors.cardBg,
    borderRadius: layout.borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.borderDark,
  },
  zoomedContainer: {
    transform: [{ scale: 1.2 }],
  },
  spineShadow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 16,
    marginLeft: -8,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    zIndex: 10,
  },
  pageImage: {
    width: '100%',
    height: '100%',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateText: {
    color: colors.textLight,
    fontSize: typography.fontSize.md,
  },
  footerRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerPageInfo: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});
