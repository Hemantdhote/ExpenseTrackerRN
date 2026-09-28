import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList, TransactionType } from '../../types';
import { colors, fontSize, fontWeight, radius, spacing } from '../../constants';
import { Header, CustomButton, CustomInput, CategorySelector } from '../../components';
import { validateAmount, validateCategory } from '../../utils/validation';
import { useAppDispatch, useAppSelector } from '../../store';
import { addTransaction, updateTransaction } from '../../store/slices/transactionSlice';

type AddTransactionNavProp = NativeStackNavigationProp<
  MainStackParamList,
  'AddTransaction'
>;
type AddTransactionRouteProp = RouteProp<MainStackParamList, 'AddTransaction'>;

interface AddTransactionScreenProps {
  navigation: AddTransactionNavProp;
  route: AddTransactionRouteProp;
}

export const AddTransactionScreen: React.FC<AddTransactionScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const { isSubmitting } = useAppSelector(state => state.transactions);

  const transactionToEdit = route.params?.transactionToEdit;
  const isEditing = Boolean(transactionToEdit);

  const [type, setType] = useState<TransactionType>(
    transactionToEdit?.type || 'expense'
  );
  const [amount, setAmount] = useState<string>(
    transactionToEdit ? transactionToEdit.amount.toString() : ''
  );
  const [category, setCategory] = useState<string>(
    transactionToEdit?.category || ''
  );
  const [note, setNote] = useState<string>(transactionToEdit?.note || '');
  const [date, setDate] = useState<string>(
    transactionToEdit?.date || new Date().toISOString().split('T')[0]
  );

  const [errors, setErrors] = useState<{
    amount?: string;
    category?: string;
  }>({});

  const handleTypeChange = (newType: TransactionType) => {
    if (newType !== type) {
      setType(newType);
      setCategory(''); // reset category when type changes
      setErrors(prev => ({ ...prev, category: undefined }));
    }
  };

  const handleSubmit = async () => {
    const amountErr = validateAmount(amount);
    const categoryErr = validateCategory(category);

    if (amountErr || categoryErr) {
      setErrors({
        amount: amountErr || undefined,
        category: categoryErr || undefined,
      });
      return;
    }

    setErrors({});
    const numericAmount = parseFloat(amount);

    try {
      if (isEditing && transactionToEdit) {
        await dispatch(
          updateTransaction({
            id: transactionToEdit.id,
            type,
            amount: numericAmount,
            category,
            note: note.trim() || undefined,
            date,
          })
        ).unwrap();
        Alert.alert('Success', 'Transaction updated successfully!');
      } else {
        await dispatch(
          addTransaction({
            type,
            amount: numericAmount,
            category,
            note: note.trim() || undefined,
            date,
          })
        ).unwrap();
        Alert.alert('Success', 'Transaction added successfully!');
      }
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to save transaction');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={isEditing ? 'Edit Transaction' : 'Add Transaction'}
        showBack
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Type Toggle: Expense / Income */}
          <View style={styles.typeSelectorRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleTypeChange('expense')}
              style={[
                styles.typeButton,
                type === 'expense' && styles.typeExpenseActive,
              ]}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'expense' && styles.typeActiveText,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleTypeChange('income')}
              style={[
                styles.typeButton,
                type === 'income' && styles.typeIncomeActive,
              ]}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === 'income' && styles.typeActiveText,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount Hero Input */}
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>AMOUNT</Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.amountCurrency}>₹</Text>
              <CustomInput
                value={amount}
                onChangeText={text => {
                  // Only allow digits and dot
                  const filtered = text.replace(/[^0-9.]/g, '');
                  setAmount(filtered);
                  if (errors.amount) setErrors(prev => ({ ...prev, amount: undefined }));
                }}
                placeholder="0.00"
                keyboardType="decimal-pad"
                error={errors.amount}
                style={styles.amountInputWrapper}
                inputStyle={styles.amountTextInput}
              />
            </View>
          </View>

          {/* Category Selector */}
          <CategorySelector
            type={type}
            selectedCategory={category}
            onSelectCategory={catName => {
              setCategory(catName);
              if (errors.category) setErrors(prev => ({ ...prev, category: undefined }));
            }}
            error={errors.category}
          />

          {/* Date Field */}
          <CustomInput
            label="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
          />

          {/* Optional Note Field */}
          <CustomInput
            label="Note / Description (Optional)"
            value={note}
            onChangeText={setNote}
            placeholder="e.g. Dinner with friends, Freelance gig"
            multiline
            numberOfLines={2}
          />

          {/* Submit Button */}
          <CustomButton
            title={isEditing ? 'Save Changes' : 'Add Transaction'}
            onPress={handleSubmit}
            isLoading={isSubmitting}
            variant="primary"
            size="lg"
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl * 2,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.pill,
    padding: spacing.xxs + 1,
    marginBottom: spacing.md,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  typeExpenseActive: {
    backgroundColor: colors.expense,
  },
  typeIncomeActive: {
    backgroundColor: colors.income,
  },
  typeButtonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  typeActiveText: {
    color: '#FFFFFF',
    fontWeight: fontWeight.bold,
  },
  amountCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  amountCurrency: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginRight: spacing.xs,
  },
  amountInputWrapper: {
    flex: 1,
    marginBottom: 0,
  },
  amountTextInput: {
    fontSize: fontSize.hero - 4,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  submitBtn: {
    marginTop: spacing.md,
  },
});
