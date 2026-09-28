import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '../constants';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const isInteractive = !disabled && !isLoading;

  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'danger':
        return styles.dangerContainer;
      case 'ghost':
        return styles.ghostContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'danger':
        return styles.dangerText;
      case 'ghost':
        return styles.ghostText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return styles.smSize;
      case 'lg':
        return styles.lgSize;
      case 'md':
      default:
        return styles.mdSize;
    }
  };

  const getTextSizeStyle = (): TextStyle => {
    switch (size) {
      case 'sm':
        return styles.smText;
      case 'lg':
        return styles.lgText;
      case 'md':
      default:
        return styles.mdText;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={!isInteractive}
      style={[
        styles.base,
        getSizeStyle(),
        getContainerStyle(),
        disabled && styles.disabledContainer,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline' || variant === 'ghost'
              ? colors.primary
              : colors.textInverse
          }
        />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconWrapper}>{icon}</View> : null}
          <Text
            style={[
              styles.baseText,
              getTextSizeStyle(),
              getTextStyle(),
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: spacing.sm,
  },
  baseText: {
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },

  // Sizes
  smSize: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  mdSize: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  lgSize: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 54,
  },

  smText: {
    fontSize: fontSize.caption,
  },
  mdText: {
    fontSize: fontSize.input,
  },
  lgText: {
    fontSize: fontSize.subtitle,
  },

  // Variants
  primaryContainer: {
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: colors.textInverse,
  },

  secondaryContainer: {
    backgroundColor: colors.surfaceSecondary,
  },
  secondaryText: {
    color: colors.textPrimary,
  },

  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  outlineText: {
    color: colors.primary,
  },

  dangerContainer: {
    backgroundColor: colors.expense,
  },
  dangerText: {
    color: colors.textInverse,
  },

  ghostContainer: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: colors.primary,
  },

  // Disabled
  disabledContainer: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
    opacity: 0.6,
  },
  disabledText: {
    color: colors.textSecondary,
  },
});
