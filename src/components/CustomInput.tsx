import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardTypeOptions,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '../constants';

interface CustomInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string | null;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  prefix?: string;
  editable?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  rightElement?: React.ReactNode;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
  prefix,
  editable = true,
  style,
  inputStyle,
  rightElement,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  const hasError = Boolean(error);

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
          !editable && styles.inputDisabled,
          multiline && styles.multilineContainer,
        ]}
      >
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textPlaceholder}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
        />

        {secureTextEntry ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={togglePasswordVisibility}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeText}>
              {isPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        ) : rightElement ? (
          <View style={styles.rightElementContainer}>{rightElement}</View>
        ) : null}
      </View>

      {hasError ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs + 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.2,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: colors.expense,
  },
  inputDisabled: {
    backgroundColor: colors.surfaceSecondary,
    borderColor: colors.borderLight,
  },
  multilineContainer: {
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    minHeight: 88,
  },
  prefix: {
    fontSize: fontSize.input,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: fontSize.input,
    color: colors.textPrimary,
    paddingVertical: 0,
    includeFontPadding: false,
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 68,
  },
  eyeButton: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  eyeText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  rightElementContainer: {
    marginLeft: spacing.xs,
  },
  errorText: {
    fontSize: fontSize.caption,
    color: colors.expense,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
