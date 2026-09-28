import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../types';
import { colors, fontSize, fontWeight, radius, spacing } from '../../constants';
import { AmountCard, TransactionCard, EmptyState } from '../../components';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchTransactions } from '../../store/slices/transactionSlice';
import { getGreeting, calculateSummary } from '../../utils/helpers';

type HomeScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { transactions, isLoading } = useAppSelector(state => state.transactions);

  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    await dispatch(fetchTransactions());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const { totalBalance, totalIncome, totalExpense } = calculateSummary(transactions);

  // Recent 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'H';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isLoading}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Top Header Row */}
        <View style={styles.topHeader}>
          <View style={styles.greetingBox}>
            <Text style={styles.greetingText}>{getGreeting(user?.name)}</Text>
            <Text style={styles.subGreetingText}>Track your daily flow</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Profile')}
            style={styles.avatarButton}
          >
            <Text style={styles.avatarText}>{userInitials}</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Amount Card */}
        <AmountCard
          totalBalance={totalBalance}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
        />

        {/* Quick Action Buttons */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AddTransaction', {})}
            style={[styles.actionBtn, styles.primaryActionBtn]}
          >
            <View style={styles.actionIconCircle}>
              <Text style={styles.actionPlusIcon}>+</Text>
            </View>
            <Text style={styles.primaryActionText}>Add Transaction</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Transactions')}
            style={[styles.actionBtn, styles.secondaryActionBtn]}
          >
            <Text style={styles.actionHistoryIcon}>📊</Text>
            <Text style={styles.secondaryActionText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {transactions.length > 0 ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Transactions')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {recentTransactions.length > 0 ? (
          recentTransactions.map(tx => (
            <TransactionCard
              key={tx.id}
              transaction={tx}
              onPress={() =>
                navigation.navigate('TransactionDetails', {
                  transactionId: tx.id,
                })
              }
            />
          ))
        ) : (
          <EmptyState
            title="No Transactions Yet"
            description="Start tracking your expenses by adding your first transaction"
            actionTitle="+ Add Transaction"
            onAction={() => navigation.navigate('AddTransaction', {})}
          />
        )}
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  greetingBox: {
    flex: 1,
  },
  greetingText: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  subGreetingText: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: fontSize.input,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  quickActionsRow: {
    flexDirection: 'row',
    marginVertical: spacing.sm,
    gap: spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.md,
  },
  primaryActionBtn: {
    flex: 2,
    backgroundColor: colors.primary,
  },
  secondaryActionBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  actionIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs + 2,
  },
  actionPlusIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: fontWeight.bold,
    lineHeight: 18,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
  },
  actionHistoryIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  secondaryActionText: {
    color: colors.textPrimary,
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.sm + 2,
  },
  sectionTitle: {
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  viewAllText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
});
