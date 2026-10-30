import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, layout, typography } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  style,
  ...props
}) => {
  const { isRTL } = useLanguage();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }, labelStyle]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          { textAlign: isRTL ? 'right' : 'left' },
          error ? styles.inputError : null,
          inputStyle,
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        accessibilityLabel={label || props.placeholder}
        {...props}
      />
      {error && (
        <Text style={[styles.errorText, { textAlign: isRTL ? 'right' : 'left' }, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    width: '100%',
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: '#D32F2F',
    marginTop: 4,
  },
});
