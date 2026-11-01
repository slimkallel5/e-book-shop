import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  Platform,
} from 'react-native';
import { colors, layout, typography, shadows } from '../../theme/tokens';
import { Tooltip } from './Tooltip';

export interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  tooltip?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  tooltip,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: colors.secondary, ...shadows.sm };
      case 'accent':
        return { backgroundColor: colors.accent, ...shadows.sm };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.accentLight,
        };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      case 'glass':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.25)',
          ...shadows.sm,
        };
      case 'primary':
      default:
        return { backgroundColor: colors.primary, ...shadows.sm };
    }
  };

  const getTextColor = () => {
    if (variant === 'glass') {
      return colors.textLight;
    }
    if (variant === 'outline') {
      return colors.accentLight;
    }
    if (variant === 'ghost') {
      return colors.primary;
    }
    if (variant === 'accent') {
      return colors.primaryDark;
    }
    return colors.textLight;
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'icon':
        return { padding: 8, borderRadius: layout.borderRadius.md };
      case 'sm':
        return { paddingVertical: 6, paddingHorizontal: 12, borderRadius: layout.borderRadius.sm };
      case 'lg':
        return { paddingVertical: 14, paddingHorizontal: 24, borderRadius: layout.borderRadius.lg };
      case 'md':
      default:
        return { paddingVertical: 10, paddingHorizontal: 18, borderRadius: layout.borderRadius.md };
    }
  };

  const accessibleText = accessibilityLabel || title || tooltip || 'button';

  const webButtonStyle = Platform.OS === 'web' ? ({
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  } as any) : undefined;

  const buttonElement = (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibleText}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        webButtonStyle,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={[styles.iconContainer, !title && styles.iconOnlyContainer]}>{icon}</View>}
          {title ? (
            <Text
              style={[
                styles.text,
                { color: getTextColor() },
                size === 'sm' && styles.textSm,
                size === 'lg' && styles.textLg,
                textStyle,
              ]}
            >
              {title}
            </Text>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{buttonElement}</Tooltip>;
  }

  return buttonElement;
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 6,
    marginLeft: 6,
  },
  iconOnlyContainer: {
    marginRight: 0,
    marginLeft: 0,
  },
  text: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  textSm: {
    fontSize: typography.fontSize.sm,
  },
  textLg: {
    fontSize: typography.fontSize.lg,
  },
});
