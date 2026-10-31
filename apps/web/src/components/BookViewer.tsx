import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  ZoomIn,
  ZoomOut,
  X,
  ChevronLeft,
  ChevronRight,
  FileQuestion,
} from 'lucide-react-native';
import { Book } from '../mock/data';
import { useLanguage } from '../context/LanguageContext';
import { colors, layout, shadows, typography } from '../theme/tokens';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';

interface BookViewerProps {
  book: Book | null;
  visible: boolean;
  onClose: () => void;
}

// Global helper to load PDF.js dynamically on web
let pdfjsPromise: Promise<any> | null = null;
function loadPdfJs(): Promise<any> {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return Promise.reject(new Error('PDF.js is only supported on web'));
  }

  const win = window as any;
  if (win.pdfjsLib) {
    return Promise.resolve(win.pdfjsLib);
  }

  if (pdfjsPromise) {
    return pdfjsPromise;
  }

  pdfjsPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-pdfjs-lib]');
    if (existing) {
      existing.addEventListener('load', () => resolve((window as any).pdfjsLib));
      existing.addEventListener('error', (err) => reject(err));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.setAttribute('data-pdfjs-lib', 'true');
    script.onload = () => {
      const pdfjs = (window as any).pdfjsLib;
      if (pdfjs) {
        pdfjs.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(pdfjs);
      } else {
        reject(new Error('PDF.js failed to initialize'));
      }
    };
    script.onerror = (e) => reject(new Error('Failed to load PDF.js script: ' + e));
    document.head.appendChild(script);
  });

  return pdfjsPromise;
}

function isPdfUrl(url?: string): boolean {
  if (!url) return false;
  const cleanUrl = url.split('?')[0].toLowerCase();
  return cleanUrl.endsWith('.pdf');
}

export const BookViewer: React.FC<BookViewerProps> = ({ book, visible, onClose }) => {
  const { language, isRTL, t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // PDF rendering state
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pdfTotalPages, setPdfTotalPages] = useState<number>(0);
  const [pdfRenderedPages, setPdfRenderedPages] = useState<Record<number, string>>({});
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const prefersReducedMotion =
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const rawSamplePages = book?.samplePages || [];
  const firstSample = rawSamplePages[0];
  const isPdf = isPdfUrl(firstSample);

  // If it's a PDF, total pages is determined by pdfDoc (or fallback to 1 while loading)
  const totalPages = isPdf ? (pdfTotalPages || 1) : rawSamplePages.length;
  const hasPages = rawSamplePages.length > 0;
  const title = book ? (book.title[language] || book.title.ar) : '';

  // Reset state when book or visible modal state changes
  useEffect(() => {
    setCurrentPage(0);
    setIsZoomed(false);
    setPdfDoc(null);
    setPdfTotalPages(0);
    setPdfRenderedPages({});
    setPdfError(null);
    setIsLoadingPdf(false);
  }, [book?.id, visible]);

  // Load PDF Document when modal opens with a PDF sample
  useEffect(() => {
    if (!visible || !book || !firstSample || !isPdf) {
      return;
    }

    let isCancelled = false;
    setIsLoadingPdf(true);
    setPdfError(null);

    loadPdfJs()
      .then((pdfjs) => {
        if (isCancelled) return;
        return pdfjs.getDocument(firstSample).promise;
      })
      .then((loadedDoc) => {
        if (isCancelled || !loadedDoc) return;
        if (isMountedRef.current) {
          setPdfDoc(loadedDoc);
          setPdfTotalPages(loadedDoc.numPages);
          setIsLoadingPdf(false);
        }
      })
      .catch((err) => {
        if (isCancelled) return;
        console.warn('PDF loading error:', err);
        if (isMountedRef.current) {
          setPdfError(err?.message || 'Error loading PDF sample');
          setIsLoadingPdf(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [visible, book?.id, firstSample, isPdf]);

  // Render the current PDF page to data URL when currentPage or pdfDoc changes
  useEffect(() => {
    if (!pdfDoc || !isPdf) return;

    const pageNumber = currentPage + 1; // PDF.js is 1-indexed
    if (pageNumber > pdfDoc.numPages || pageNumber < 1) return;

    // Check if we already rendered this page
    if (pdfRenderedPages[currentPage]) return;

    let isCancelled = false;

    pdfDoc
      .getPage(pageNumber)
      .then(async (page: any) => {
        if (isCancelled) return;
        // Standard high-DPI rendering for clarity
        const scale = 2.0;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;
        await page.render({ canvasContext: ctx, viewport }).promise;

        if (isCancelled) return;
        const dataUrl = canvas.toDataURL('image/png');
        if (isMountedRef.current) {
          setPdfRenderedPages((prev) => ({
            ...prev,
            [currentPage]: dataUrl,
          }));
        }
      })
      .catch((err: any) => {
        if (!isCancelled) {
          console.warn(`Error rendering PDF page ${pageNumber}:`, err);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, currentPage, isPdf, pdfRenderedPages]);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
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

  useEffect(() => {
    if (!visible || !book || Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onLeftArrow();
      } else if (e.key === 'ArrowRight') {
        onRightArrow();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, book, currentPage, isRTL, totalPages]);

  if (!book) return null;

  // Active page image uri: if PDF, use rendered dataUrl; otherwise image URL
  const activeImageUri = isPdf
    ? pdfRenderedPages[currentPage]
    : rawSamplePages[currentPage];

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
                {hasPages ? `${t('app.page')} ${currentPage + 1} ${t('app.of')} ${totalPages}` : t('app.noPreview')}
              </Text>
            </View>

            <View style={[styles.actionsGroup, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {hasPages && (
                <Tooltip content={isZoomed ? t('app.zoomOut') : t('app.zoomIn')}>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => setIsZoomed(!isZoomed)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={isZoomed ? t('app.zoomOut') : t('app.zoomIn')}
                  >
                    {isZoomed ? (
                      <ZoomOut size={18} color={colors.textLight} />
                    ) : (
                      <ZoomIn size={18} color={colors.textLight} />
                    )}
                  </TouchableOpacity>
                </Tooltip>
              )}
              <Tooltip content={t('app.close')}>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={onClose}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={t('app.closeConfirmation')}
                >
                  <X size={18} color={colors.textLight} />
                </TouchableOpacity>
              </Tooltip>
            </View>
          </View>

          {/* 3D Realistic Book Stage */}
          <View style={styles.stage}>
            {hasPages ? (
              <View style={styles.book3DWrapper}>
                {/* Left Navigation Arrow */}
                <Tooltip content={isRTL ? t('app.nextPage') : t('app.prevPage')}>
                  <TouchableOpacity
                    style={[styles.navArrow, styles.navArrowLeft]}
                    onPress={onLeftArrow}
                    disabled={isRTL ? currentPage === totalPages - 1 : currentPage === 0}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={isRTL ? t('app.nextPage') : t('app.prevPage')}
                  >
                    {isRTL ? (
                      <ChevronRight size={24} color={colors.textLight} />
                    ) : (
                      <ChevronLeft size={24} color={colors.textLight} />
                    )}
                  </TouchableOpacity>
                </Tooltip>

                {/* Simulated Interactive 3D Open Page Spread */}
                <View style={[styles.spreadContainer, isZoomed && (prefersReducedMotion ? styles.zoomedContainerReduced : styles.zoomedContainer)]}>
                  {/* Spine Depth Shadow */}
                  <View style={styles.spineShadow} />

                  {isLoadingPdf && !activeImageUri ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color={colors.accent} />
                      <Text style={styles.loadingText}>
                        {isRTL ? 'جاري تحميل عينة الكتاب...' : 'Loading sample preview...'}
                      </Text>
                    </View>
                  ) : pdfError && !activeImageUri ? (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyStateIcon}>⚠️</Text>
                      <Text style={styles.emptyStateText}>{pdfError}</Text>
                    </View>
                  ) : activeImageUri ? (
                    <Image
                      source={{ uri: activeImageUri }}
                      style={styles.pageImage}
                      resizeMode="contain"
                      accessibilityLabel={`${title} - ${t('app.page')} ${currentPage + 1}`}
                    />
                  ) : (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color={colors.accent} />
                    </View>
                  )}
                </View>

                {/* Right Navigation Arrow */}
                <Tooltip content={isRTL ? t('app.prevPage') : t('app.nextPage')}>
                  <TouchableOpacity
                    style={[styles.navArrow, styles.navArrowRight]}
                    onPress={onRightArrow}
                    disabled={isRTL ? currentPage === 0 : currentPage === totalPages - 1}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={isRTL ? t('app.prevPage') : t('app.nextPage')}
                  >
                    {isRTL ? (
                      <ChevronLeft size={24} color={colors.textLight} />
                    ) : (
                      <ChevronRight size={24} color={colors.textLight} />
                    )}
                  </TouchableOpacity>
                </Tooltip>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <FileQuestion size={48} color={colors.textMuted} style={styles.emptyStateIcon} />
                <Text style={styles.emptyStateText}>{t('app.noPreview')}</Text>
              </View>
            )}
          </View>

          {/* Footer Page Turning Bar */}
          {hasPages && (
            <View style={[styles.footerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Button
                title={t('app.prevPage')}
                icon={isRTL ? <ChevronRight size={16} color={colors.primary} /> : <ChevronLeft size={16} color={colors.primary} />}
                tooltip={t('app.prevPage')}
                onPress={handlePrevPage}
                disabled={currentPage === 0}
                variant="outline"
                size="sm"
              />
              <Text style={styles.footerPageInfo}>
                {currentPage + 1} / {totalPages}
              </Text>
              <Button
                title={t('app.nextPage')}
                icon={isRTL ? <ChevronLeft size={16} color={colors.textLight} /> : <ChevronRight size={16} color={colors.textLight} />}
                tooltip={t('app.nextPage')}
                onPress={handleNextPage}
                disabled={currentPage === totalPages - 1}
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
  closeBtn: {
    backgroundColor: colors.error,
    width: 32,
    height: 32,
    borderRadius: layout.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
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
  zoomedContainerReduced: {
    borderWidth: 3,
    borderColor: colors.accent,
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  loadingText: {
    color: colors.textLight,
    fontSize: typography.fontSize.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateIcon: {
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
