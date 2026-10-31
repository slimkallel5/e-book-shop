import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors, layout, typography } from '../../theme/tokens';
import { Tooltip } from './Tooltip';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
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
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: colors.secondary };
      case 'accent':
        return { backgroundColor: colors.accent };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary,
        };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      case 'primary':
      default:
        return { backgroundColor: colors.primary };
    }
  };

  const getTextColor = () => {
    if (variant === 'outline' || variant === 'ghost') {
      return colors.primary;
    }
    if (variant === 'accent') {
      return colors.primaryDark;
    }
    return colors.textLight;
  };

  const getSizeStyle = () => {
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
