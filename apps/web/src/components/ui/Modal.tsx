import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal as RNModal, Platform } from 'react-native';
import { colors, layout, shadows, typography } from '../../theme/tokens';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: number;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  maxWidth = 700,
}) => {
  useEffect(() => {
    if (!visible || Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, onClose]);

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.modalContent, { maxWidth }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            {title ? <Text style={styles.title}>{title}</Text> : <View />}
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close dialog"
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.body}>{children}</View>
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 35, 25, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: colors.cardBg,
    borderRadius: layout.borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  closeBtn: {
    padding: 6,
    borderRadius: layout.borderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  closeText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
  },
  body: {
    padding: 20,
    flexShrink: 1,
  },
});
