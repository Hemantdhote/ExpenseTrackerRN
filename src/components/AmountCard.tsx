import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing, shadows } from '../constants';
import { formatCurrency } from '../utils/helpers';

interface AmountCardProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

export const AmountCard: React.FC<AmountCardProps> = ({
  totalBalance,
  totalIncome,
  totalExpense,
}) => {
  return (
    <View style={[styles.container, shadows.md]}>
      {/* Balance Section */}
      <View style={styles.balanceSection}>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeText}>TOTAL BALANCE</Text>
        </View>
        <Text
          style={[
            styles.balanceAmount,
            totalBalance < 0 && styles.negativeBalance,
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {formatCurrency(totalBalance)}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Income & Expense Breakdown */}
      <View style={styles.statsRow}>
        {/* Income Card */}
        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <View style={[styles.arrowCircle, styles.incomeCircle]}>
              <Text style={styles.arrowIcon}>↓</Text>
            </View>
            <Text style={styles.statLabel}>Income</Text>
          </View>
          <Text style={[styles.statValue, styles.incomeValue]} numberOfLines={1}>
            {formatCurrency(totalIncome)}
          </Text>
        </View>

        <View style={styles.verticalDivider} />

        {/* Expense Card */}
        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <View style={[styles.arrowCircle, styles.expenseCircle]}>
              <Text style={styles.arrowIcon}>↑</Text>
            </View>
            <Text style={styles.statLabel}>Expenses</Text>
          </View>
          <Text style={[styles.statValue, styles.expenseValue]} numberOfLines={1}>
            {formatCurrency(totalExpense)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardDark,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardDarkSecondary,
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  badgeRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xxs + 2,
    borderRadius: radius.pill,
    marginBottom: spacing.xs + 2,
  },
  badgeText: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.bold,
    color: colors.cardDarkSubtext,
    letterSpacing: 1.2,
  },
  balanceAmount: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.cardDarkText,
    letterSpacing: -0.5,
  },
  negativeBalance: {
    color: colors.expenseBorder,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    paddingHorizontal: spacing.xs,
  },
  verticalDivider: {
    width: 1,
    height: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginHorizontal: spacing.sm,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  arrowCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  incomeCircle: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
  },
  expenseCircle: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
  },
  arrowIcon: {
    fontSize: 12,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
    lineHeight: 14,
  },
  statLabel: {
    fontSize: fontSize.caption,
    color: colors.cardDarkSubtext,
    fontWeight: fontWeight.medium,
  },
  statValue: {
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  incomeValue: {
    color: '#34D399',
  },
  expenseValue: {
    color: '#F87171',
  },
});
