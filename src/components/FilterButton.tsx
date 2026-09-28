import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '../constants';
import { TransactionFilter } from '../types';

interface FilterButtonProps {
  selectedFilter: TransactionFilter;
  onSelectFilter: (filter: TransactionFilter) => void;
  counts?: {
    all?: number;
    income?: number;
    expense?: number;
  };
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  selectedFilter,
  onSelectFilter,
  counts,
}) => {
  const options: { label: string; value: TransactionFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
  ];

  return (
    <View style={styles.container}>
      {options.map(opt => {
        const isSelected = selectedFilter === opt.value;
        const count = counts ? counts[opt.value] : undefined;

        return (
          <TouchableOpacity
            key={opt.value}
            activeOpacity={0.8}
            onPress={() => onSelectFilter(opt.value)}
            style={[styles.pill, isSelected && styles.activePill]}
          >
            <Text
              style={[styles.pillText, isSelected && styles.activePillText]}
            >
              {opt.label}
              {count !== undefined ? ` (${count})` : ''}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.pill,
    padding: spacing.xxs + 1,
    marginVertical: spacing.sm,
  },
  pill: {
    flex: 1,
    paddingVertical: spacing.sm - 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  activePill: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pillText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  activePillText: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
});
