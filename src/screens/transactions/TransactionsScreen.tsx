import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList, Transaction, TransactionFilter } from '../../types';
import { colors, fontSize, fontWeight, radius, spacing } from '../../constants';
import {
  Header,
  FilterButton,
  TransactionCard,
  EmptyState,
} from '../../components';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchTransactions } from '../../store/slices/transactionSlice';
import { formatMonthYear } from '../../utils/helpers';

type TransactionsScreenNavProp = NativeStackNavigationProp<
  MainStackParamList,
  'Transactions'
>;
type TransactionsScreenRouteProp = RouteProp<MainStackParamList, 'Transactions'>;

interface TransactionsScreenProps {
  navigation: TransactionsScreenNavProp;
  route: TransactionsScreenRouteProp;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const { transactions, isLoading } = useAppSelector(state => state.transactions);

  const initialFilter = route.params?.filterType || 'all';
  const [filterType, setFilterType] = useState<TransactionFilter>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchTransactions());
    setRefreshing(false);
  };

  // Filter and search logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Type filter
      if (filterType !== 'all' && t.type !== filterType) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesCategory = t.category.toLowerCase().includes(query);
        const matchesNote = t.note ? t.note.toLowerCase().includes(query) : false;
        const matchesAmount = t.amount.toString().includes(query);
        if (!matchesCategory && !matchesNote && !matchesAmount) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, filterType, searchQuery]);

  // Counts for filter pills
  const counts = useMemo(() => {
    const incomeCount = transactions.filter(t => t.type === 'income').length;
    const expenseCount = transactions.filter(t => t.type === 'expense').length;
    return {
      all: transactions.length,
      income: incomeCount,
      expense: expenseCount,
    };
  }, [transactions]);

  // Group transactions by month
  const groupedData = useMemo(() => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const groups: { month: string; data: Transaction[] }[] = [];
    const map = new Map<string, Transaction[]>();

    for (const t of sorted) {
      const month = formatMonthYear(t.date);
      if (!map.has(month)) {
        map.set(month, []);
      }
      map.get(month)!.push(t);
    }

    map.forEach((items, month) => {
      groups.push({ month, data: items });
    });

    return groups;
  }, [filteredTransactions]);

  return (
    <View style={styles.container}>
      <Header
        title="Transactions"
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('AddTransaction', {})}
            style={styles.headerAddBtn}
          >
            <Text style={styles.headerAddText}>+ Add</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.filterSection}>
        {/* Search Input */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search note, category, or amount..."
            placeholderTextColor={colors.textPlaceholder}
            style={styles.searchInput}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Pills */}
        <FilterButton
          selectedFilter={filterType}
          onSelectFilter={setFilterType}
          counts={counts}
        />
      </View>

      <FlatList
        data={groupedData}
        keyExtractor={item => item.month}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isLoading}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={searchQuery ? '🔎' : '💳'}
            title={searchQuery ? 'No Results Found' : 'No Transactions Found'}
            description={
              searchQuery
                ? `No transactions matching "${searchQuery}"`
                : 'No transactions found under this category'
            }
            actionTitle={searchQuery ? 'Clear Search' : '+ Add Transaction'}
            onAction={
              searchQuery
                ? () => setSearchQuery('')
                : () => navigation.navigate('AddTransaction', {})
            }
          />
        }
        renderItem={({ item }) => (
          <View style={styles.groupContainer}>
            <View style={styles.monthHeader}>
              <Text style={styles.monthHeaderText}>{item.month}</Text>
              <Text style={styles.monthCountText}>
                {item.data.length} {item.data.length === 1 ? 'item' : 'items'}
              </Text>
            </View>

            {item.data.map(tx => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                onPress={() =>
                  navigation.navigate('TransactionDetails', {
                    transactionId: tx.id,
                  })
                }
              />
            ))}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerAddBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md - 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
  },
  headerAddText: {
    color: '#FFFFFF',
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
  },
  filterSection: {
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    paddingBottom: spacing.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 46,
    marginTop: spacing.xs,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.body,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearSearch: {
    fontSize: 14,
    color: colors.textMuted,
    padding: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl * 2,
    paddingTop: spacing.xs,
  },
  groupContainer: {
    marginBottom: spacing.md,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  monthHeaderText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  monthCountText: {
    fontSize: fontSize.caption,
    color: colors.textMuted,
  },
});
