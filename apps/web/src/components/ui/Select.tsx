import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, layout, typography } from '../../theme/tokens';
import { useLanguage } from '../../context/LanguageContext';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  error,
  disabled = false,
  containerStyle,
  labelStyle,
}) => {
  const { isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  // For Web platform, provide standard native select element for seamless accessibility and keyboard handling
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }, labelStyle]}>
            {label}
          </Text>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '10px 14px',
            backgroundColor: colors.background,
            border: `1px solid ${error ? '#D32F2F' : colors.borderDark}`,
            borderRadius: layout.borderRadius.sm,
            fontSize: typography.fontSize.sm,
            color: colors.textPrimary,
            direction: isRTL ? 'rtl' : 'ltr',
            textAlign: isRTL ? 'right' : 'left',
            outline: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            boxSizing: 'border-box',
          }}
        >
          {placeholder && !value && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <Text style={[styles.errorText, { textAlign: isRTL ? 'right' : 'left' }]}>
            {error}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }, labelStyle]}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.trigger,
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
          error ? styles.triggerError : null,
          disabled ? styles.triggerDisabled : null,
        ]}
        onPress={() => !disabled && setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.selectedText,
            { textAlign: isRTL ? 'right' : 'left' },
            !selectedOption ? styles.placeholderText : null,
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.arrowIcon}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          <ScrollView nestedScrollEnabled style={styles.optionsList}>
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.optionItem,
                    isSelected ? styles.optionItemSelected : null,
                    { flexDirection: isRTL ? 'row-reverse' : 'row' },
                  ]}
                  onPress={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected ? styles.optionLabelSelected : null,
                      { textAlign: isRTL ? 'right' : 'left' },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && <Text style={styles.checkIcon}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {error && (
        <Text style={[styles.errorText, { textAlign: isRTL ? 'right' : 'left' }]}>
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
  trigger: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: layout.borderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  triggerError: {
    borderColor: '#D32F2F',
  },
  triggerDisabled: {
    opacity: 0.6,
  },
  selectedText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    flex: 1,
  },
  placeholderText: {
    color: colors.textMuted,
  },
  arrowIcon: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
    marginRight: 6,
  },
  dropdown: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: layout.borderRadius.sm,
    marginTop: 4,
    maxHeight: 180,
    zIndex: 1000,
  },
  optionsList: {
    maxHeight: 180,
  },
  optionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionItemSelected: {
    backgroundColor: 'rgba(18, 59, 43, 0.08)',
  },
  optionLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    flex: 1,
  },
  optionLabelSelected: {
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  checkIcon: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: '#D32F2F',
    marginTop: 4,
  },
});
