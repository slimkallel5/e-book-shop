import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, layout, typography } from '../../theme/tokens';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...rest }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={colors.textMuted}
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.cardBg,
    borderColor: colors.borderDark,
    borderWidth: 1,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
});
