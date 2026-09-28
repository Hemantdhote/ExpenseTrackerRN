import React from 'react';
import {
  Utensils,
  ShoppingBag,
  Car,
  Receipt,
  Clapperboard,
  Stethoscope,
  GraduationCap,
  Tag,
  Briefcase,
  Laptop,
  Building,
  TrendingUp,
  Coins,
} from 'lucide-react-native';
import { TransactionType } from '../types';

interface CategoryIconProps {
  category: string;
  type?: TransactionType;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  type = 'expense',
  size = 20,
  color = '#4F46E5',
  strokeWidth = 2.2,
}) => {
  const normalized = category.toLowerCase().trim();

  switch (normalized) {
    // Expense
    case 'food':
      return <Utensils size={size} color={color} strokeWidth={strokeWidth} />;
    case 'shopping':
      return <ShoppingBag size={size} color={color} strokeWidth={strokeWidth} />;
    case 'transport':
      return <Car size={size} color={color} strokeWidth={strokeWidth} />;
    case 'bills':
      return <Receipt size={size} color={color} strokeWidth={strokeWidth} />;
    case 'entertainment':
      return <Clapperboard size={size} color={color} strokeWidth={strokeWidth} />;
    case 'health':
      return <Stethoscope size={size} color={color} strokeWidth={strokeWidth} />;
    case 'education':
      return <GraduationCap size={size} color={color} strokeWidth={strokeWidth} />;

    // Income
    case 'salary':
      return <Briefcase size={size} color={color} strokeWidth={strokeWidth} />;
    case 'freelance':
      return <Laptop size={size} color={color} strokeWidth={strokeWidth} />;
    case 'business':
      return <Building size={size} color={color} strokeWidth={strokeWidth} />;
    case 'investment':
      return <TrendingUp size={size} color={color} strokeWidth={strokeWidth} />;

    // Other / Default
    case 'other':
    default:
      if (type === 'income') {
        return <Coins size={size} color={color} strokeWidth={strokeWidth} />;
      }
      return <Tag size={size} color={color} strokeWidth={strokeWidth} />;
  }
};
