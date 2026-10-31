import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal as RNModal } from 'react-native';
import { X } from 'lucide-react-native';
import { colors, layout, shadows, typography } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';
import { Tooltip } from './Tooltip';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
}) => {
  const { isRTL, t } = useLanguage();

  if (!visible) return null;

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop dismiss */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Modal Window Container */}
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
              {title}
            </Text>
            <Tooltip content={t('app.close')}>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeBtn}
                accessibilityRole="button"
                accessibilityLabel={t('app.closeConfirmation')}
                activeOpacity={0.7}
              >
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </Tooltip>
          </View>

          {/* Body Content */}
          <View style={styles.content}>
            {children}
          </View>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: layout.borderRadius.xl,
    width: '100%',
    maxWidth: 650,
    maxHeight: '90%',
    ...shadows.lg,
    overflow: 'hidden',
    zIndex: 1001,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryDark,
    flex: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: layout.borderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  content: {
    padding: 20,
  },
});
