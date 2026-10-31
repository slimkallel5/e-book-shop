import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, ViewStyle, TextStyle } from 'react-native';
import { colors, layout, shadows, typography } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';

export interface TooltipProps {
  content?: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  style?: ViewStyle;
  tooltipStyle?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  style,
  tooltipStyle,
  textStyle,
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);
  const { isRTL } = useLanguage();

  if (!content || disabled) {
    return <View style={style}>{children}</View>;
  }

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  const webHoverProps =
    Platform.OS === 'web'
      ? {
          onMouseEnter: showTooltip,
          onMouseLeave: hideTooltip,
          onFocus: showTooltip,
          onBlur: hideTooltip,
          title: content, // Native accessibility / fallback tooltip
        }
      : {};

  const getPositionStyle = (): ViewStyle => {
    switch (position) {
      case 'bottom':
        return {
          top: '100%',
          marginTop: 6,
          left: '50%',
          transform: [{ translateX: -50 }],
        };
      case 'left':
        return {
          right: '100%',
          marginRight: 6,
          top: '50%',
          transform: [{ translateY: -50 }],
        };
      case 'right':
        return {
          left: '100%',
          marginLeft: 6,
          top: '50%',
          transform: [{ translateY: -50 }],
        };
      case 'top':
      default:
        return {
          bottom: '100%',
          marginBottom: 6,
          left: '50%',
          transform: [{ translateX: -50 }],
        };
    }
  };

  return (
    <View
      style={[styles.container, style]}
      {...(webHoverProps as any)}
    >
      {children}
      {visible && (
        <View
          pointerEvents="none"
          style={[
            styles.tooltipBox,
            getPositionStyle(),
            tooltipStyle,
          ]}
        >
          <Text
            style={[
              styles.tooltipText,
              { textAlign: isRTL ? 'right' : 'left', direction: isRTL ? 'rtl' : 'ltr' },
              textStyle,
            ]}
          >
            {content}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltipBox: {
    position: 'absolute',
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: layout.borderRadius.sm,
    zIndex: 9999,
    minWidth: 40,
    maxWidth: 220,
    ...shadows.md,
  },
  tooltipText: {
    color: colors.textLight,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 14,
  },
});
