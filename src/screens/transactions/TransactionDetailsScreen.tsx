import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../types';
import { colors, fontSize, fontWeight, radius, spacing } from '../../constants';
import { getCategoryByName } from '../../constants/categories';
import { Header, CustomButton, CategoryIcon } from '../../components';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { useAppDispatch, useAppSelector } from '../../store';
import { deleteTransaction } from '../../store/slices/transactionSlice';

type TransactionDetailsNavProp = NativeStackNavigationProp<
  MainStackParamList,
  'TransactionDetails'
>;
type TransactionDetailsRouteProp = RouteProp<
  MainStackParamList,
  'TransactionDetails'
>;

interface TransactionDetailsScreenProps {
  navigation: TransactionDetailsNavProp;
  route: TransactionDetailsRouteProp;
}

export const TransactionDetailsScreen: React.FC<TransactionDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const { transactionId } = route.params;

  const transaction = useAppSelector(state =>
    state.transactions.transactions.find(t => t.id === transactionId)
  );

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Transaction" showBack onBack={() => navigation.goBack()} />
        <View style={styles.notFoundBox}>
          <Text style={styles.notFoundText}>Transaction not found</Text>
          <CustomButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            variant="secondary"
            size="md"
          />
        </View>
      </SafeAreaView>
    );
  }

  const isIncome = transaction.type === 'income';
  const categoryConfig = getCategoryByName(transaction.category, transaction.type);

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteTransaction(transaction.id)).unwrap();
              navigation.goBack();
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Failed to delete transaction');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('AddTransaction', {
      transactionToEdit: transaction,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title="Transaction Details"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Hero Section */}
        <View style={styles.heroCard}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: categoryConfig.bgColor },
            ]}
          >
            <CategoryIcon
              category={transaction.category}
              type={transaction.type}
              size={32}
              color={categoryConfig.color}
            />
          </View>

          <Text
            style={[
              styles.amountText,
              isIncome ? styles.incomeText : styles.expenseText,
            ]}
          >
            {formatCurrency(transaction.amount, true, transaction.type)}
          </Text>

          <View
            style={[
              styles.typeBadge,
              isIncome ? styles.incomeBadge : styles.expenseBadge,
            ]}
          >
            <Text
              style={[
                styles.typeBadgeText,
                isIncome ? styles.incomeBadgeText : styles.expenseBadgeText,
              ]}
            >
              {isIncome ? 'Income' : 'Expense'}
            </Text>
          </View>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{transaction.category}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>
              {formatDate(transaction.date)} ({transaction.date})
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Note</Text>
            <Text style={styles.detailValue}>
              {transaction.note ? transaction.note : '—'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <Text style={[styles.detailValue, styles.idValue]} numberOfLines={1}>
              {transaction.id}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <CustomButton
            title="Edit Transaction"
            onPress={handleEdit}
            variant="outline"
            size="lg"
            style={styles.editBtn}
          />

          <CustomButton
            title="Delete Transaction"
            onPress={handleDelete}
            variant="danger"
            size="lg"
            style={styles.deleteBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl * 2,
  },
  notFoundBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  notFoundText: {
    fontSize: fontSize.subtitle,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconText: {
    fontSize: 32,
  },
  amountText: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  incomeText: {
    color: colors.income,
  },
  expenseText: {
    color: colors.expense,
  },
  typeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs + 2,
    borderRadius: radius.pill,
  },
  incomeBadge: {
    backgroundColor: colors.incomeLight,
  },
  expenseBadge: {
    backgroundColor: colors.expenseLight,
  },
  typeBadgeText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  incomeBadgeText: {
    color: colors.incomeDark,
  },
  expenseBadgeText: {
    color: colors.expenseDark,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
  },
  detailLabel: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  detailValue: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    maxWidth: '60%',
    textAlign: 'right',
  },
  idValue: {
    fontSize: fontSize.caption,
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  actionsContainer: {
    gap: spacing.sm,
  },
  editBtn: {
    marginBottom: spacing.xs,
  },
  deleteBtn: {
    marginTop: 0,
  },
});
