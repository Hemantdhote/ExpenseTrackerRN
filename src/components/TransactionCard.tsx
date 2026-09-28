import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction } from '../types';
import { getCategoryByName } from '../constants/categories';
import { colors, fontSize, fontWeight, radius, spacing, shadows } from '../constants';
import { formatCurrency, formatDate } from '../utils/helpers';
import { CategoryIcon } from './CategoryIcon';

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onPress,
}) => {
  const isIncome = transaction.type === 'income';
  const categoryConfig = getCategoryByName(transaction.category, transaction.type);

  const displayTitle = transaction.note?.trim()
    ? transaction.note.trim()
    : transaction.category;

  const displaySubtitle = transaction.note?.trim()
    ? `${transaction.category} • ${formatDate(transaction.date)}`
    : formatDate(transaction.date);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      style={[styles.card, shadows.sm]}
    >
      <View style={styles.leftRow}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: categoryConfig.bgColor },
          ]}
        >
          <CategoryIcon
            category={transaction.category}
            type={transaction.type}
            size={22}
            color={categoryConfig.color}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {displayTitle}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {displaySubtitle}
          </Text>
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amountText,
            isIncome ? styles.incomeText : styles.expenseText,
          ]}
        >
          {formatCurrency(transaction.amount, true, transaction.type)}
        </Text>
        <Text style={styles.typeLabel}>
          {isIncome ? 'Income' : 'Expense'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md - 2,
  },
  iconText: {
    fontSize: 20,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.body + 1,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: fontSize.input,
    fontWeight: fontWeight.bold,
    marginBottom: 2,
  },
  incomeText: {
    color: colors.income,
  },
  expenseText: {
    color: colors.expense,
  },
  typeLabel: {
    fontSize: fontSize.tiny,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
