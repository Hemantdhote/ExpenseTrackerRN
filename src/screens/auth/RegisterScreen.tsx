import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { colors, fontSize, fontWeight, radius, spacing } from '../../constants';
import { CustomButton, CustomInput } from '../../components';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../../utils/validation';
import { useAppDispatch, useAppSelector } from '../../store';
import { registerUser, clearAuthError } from '../../store/slices/authSlice';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Register'
>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleRegister = () => {
    dispatch(clearAuthError());

    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, confirmPassword);

    if (nameErr || emailErr || passwordErr || confirmErr) {
      setErrors({
        name: nameErr || undefined,
        email: emailErr || undefined,
        password: passwordErr || undefined,
        confirmPassword: confirmErr || undefined,
      });
      return;
    }

    setErrors({});
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBox}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Start tracking and mastering your personal finances
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.formCard}>
          <CustomInput
            label="Full Name"
            value={name}
            onChangeText={text => {
              setName(text);
              if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
            }}
            placeholder="Hemant Dhote"
            autoCapitalize="words"
            error={errors.name}
          />

          <CustomInput
            label="Email Address"
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
            }}
            placeholder="hemant@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <CustomInput
            label="Password"
            value={password}
            onChangeText={text => {
              setPassword(text);
              if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
            }}
            placeholder="At least 6 characters"
            secureTextEntry
            error={errors.password}
          />

          <CustomInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
              if (errors.confirmPassword)
                setErrors(prev => ({ ...prev, confirmPassword: undefined }));
            }}
            placeholder="Re-enter password"
            secureTextEntry
            error={errors.confirmPassword}
          />

          <CustomButton
            title="Create Account"
            onPress={handleRegister}
            isLoading={isLoading}
            variant="primary"
            size="lg"
            style={styles.submitBtn}
          />
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  headerBox: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.heading,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  errorBanner: {
    backgroundColor: colors.expenseLight,
    borderWidth: 1,
    borderColor: colors.expenseBorder,
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  errorBannerText: {
    color: colors.expenseDark,
    fontSize: fontSize.body,
    textAlign: 'center',
    fontWeight: fontWeight.medium,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  submitBtn: {
    marginTop: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
});
