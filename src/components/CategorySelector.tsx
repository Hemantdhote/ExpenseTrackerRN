import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, CategoryConfig } from '../constants/categories';
import { colors, fontSize, fontWeight, radius, spacing } from '../constants';
import { TransactionType } from '../types';

interface CategorySelectorProps {
  type: TransactionType;
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
  error?: string | null;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  type,
  selectedCategory,
  onSelectCategory,
  error,
}) => {
  const categories: CategoryConfig[] =
    type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Category</Text>
      <View style={styles.grid}>
        {categories.map(cat => {
          const isSelected =
            selectedCategory.toLowerCase() === cat.name.toLowerCase();

          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.7}
              onPress={() => onSelectCategory(cat.name)}
              style={[
                styles.categoryCard,
                { backgroundColor: isSelected ? cat.bgColor : colors.surface },
                isSelected && [styles.selectedCard, { borderColor: cat.color }],
              ]}
            >
              <View
                style={[
                  styles.iconWrap,
                  isSelected
                    ? styles.iconWrapSelected
                    : { backgroundColor: cat.bgColor },
                ]}
              >
                <Text style={styles.iconText}>{cat.icon}</Text>
              </View>
              <Text
                style={[
                  styles.categoryName,
                  isSelected && [styles.selectedCategoryName, { color: cat.color }],
                ]}
                numberOfLines={1}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    width: '100%',
  },
  label: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  categoryCard: {
    width: '22%',
    margin: '1.5%',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xxs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  selectedCard: {
    borderWidth: 1.5,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  iconWrapSelected: {
    backgroundColor: '#FFFFFF',
  },
  iconText: {
    fontSize: 18,
  },
  categoryName: {
    fontSize: fontSize.caption - 1,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  selectedCategoryName: {
    fontWeight: fontWeight.bold,
  },
  errorText: {
    fontSize: fontSize.caption,
    color: colors.expense,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
