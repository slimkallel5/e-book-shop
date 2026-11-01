import React from 'react';
import { StyleSheet, View, ViewProps, Platform } from 'react-native';
import { colors, layout, shadows } from '../../theme/tokens';

export interface GlassCardProps extends ViewProps {
  children?: React.ReactNode;
  variant?: 'light' | 'dark' | 'ultraDark' | 'goldGlow';
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'glow';
  hasBorder?: boolean;
  isInteractive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'dark',
  elevation = 'md',
  hasBorder = true,
  isInteractive = false,
  style,
  ...rest
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'light':
        return colors.glassBg;
      case 'ultraDark':
        return colors.glassBgUltraDark;
      case 'goldGlow':
        return 'rgba(25, 48, 38, 0.9)';
      case 'dark':
      default:
        return colors.glassBgDark;
    }
  };

  const getBorderColor = () => {
    if (!hasBorder) return 'transparent';
    switch (variant) {
      case 'goldGlow':
        return colors.accentLight;
      case 'light':
        return colors.glassBorder;
      case 'dark':
      case 'ultraDark':
      default:
        return colors.glassBorderDark;
    }
  };

  const getShadowStyle = () => {
    switch (elevation) {
      case 'none':
        return {};
      case 'sm':
        return shadows.sm;
      case 'lg':
        return shadows.lg;
      case 'glow':
        return shadows.goldGlow;
      case 'md':
      default:
        return shadows.md;
    }
  };

  const webStyles = Platform.OS === 'web' ? ({
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    ...(isInteractive ? {
      transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease',
      cursor: 'pointer',
    } : {}),
  } as any) : undefined;

  return (
    <View
      style={[
        styles.cardBase,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
        getShadowStyle(),
        webStyles,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  cardBase: {
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
