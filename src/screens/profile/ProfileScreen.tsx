import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../types';
import { colors, fontSize, fontWeight, radius, spacing } from '../../constants';
import { Header, CustomButton, CustomInput } from '../../components';
import { useAppDispatch, useAppSelector } from '../../store';
import { logoutUser, updateProfile } from '../../store/slices/authSlice';
import { isSupabaseConfigured } from '../../services/supabase';
import { formatCurrency, calculateSummary } from '../../utils/helpers';
import { validateName } from '../../utils/validation';

type ProfileScreenNavProp = NativeStackNavigationProp<MainStackParamList, 'Profile'>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavProp;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector(state => state.auth);
  const { transactions } = useAppSelector(state => state.transactions);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [nameError, setNameError] = useState<string | null>(null);

  const { totalBalance } = calculateSummary(transactions);

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'H';

  const handleUpdateName = async () => {
    const error = validateName(newName);
    if (error) {
      setNameError(error);
      return;
    }

    try {
      await dispatch(updateProfile({ name: newName })).unwrap();
      setIsEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of your account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          dispatch(logoutUser());
        },
      },
    ]);
  };

  const isConfigured = isSupabaseConfigured();

  return (
    <View style={styles.container}>
      <Header title="Profile" showBack onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{userInitials}</Text>
          </View>

          <Text style={styles.userName}>{user?.name || 'Hemant Dhote'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'hemant@example.com'}</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setNewName(user?.name || '');
              setNameError(null);
              setIsEditModalVisible(true);
            }}
            style={styles.editNameBtn}
          >
            <Text style={styles.editNameText}>Edit Name</Text>
          </TouchableOpacity>
        </View>

        {/* Account Statistics */}
        <View style={styles.statsCard}>
          <Text style={styles.statsCardTitle}>Overview</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{transactions.length}</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text
                style={[
                  styles.statNumber,
                  totalBalance >= 0 ? styles.positiveText : styles.negativeText,
                ]}
                numberOfLines={1}
              >
                {formatCurrency(totalBalance)}
              </Text>
              <Text style={styles.statLabel}>Net Balance</Text>
            </View>
          </View>
        </View>

        {/* System & Backend Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Backend & Integration</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Authentication</Text>
            <Text style={styles.infoVal}>Supabase Auth / JWT</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Database</Text>
            <Text style={styles.infoVal}>PostgreSQL + RLS</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>State Management</Text>
            <Text style={styles.infoVal}>Redux Toolkit</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Backend Status</Text>
            <View
              style={[
                styles.statusBadge,
                isConfigured ? styles.statusOnline : styles.statusOffline,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isConfigured ? styles.statusOnlineText : styles.statusOfflineText,
                ]}
              >
                {isConfigured ? 'Supabase Connected' : 'Offline / Demo Mode'}
              </Text>
            </View>
          </View>
        </View>

        {/* Portfolio / Resume Note */}
        <View style={styles.portfolioCard}>
          <Text style={styles.portfolioTitle}>About this Project</Text>
          <Text style={styles.portfolioText}>
            Built with React Native, Redux Toolkit, and Supabase. Features complete
            CRUD operations, form validations, session persistence, clean state
            management, and responsive UI architecture.
          </Text>
        </View>

        {/* Logout Button */}
        <CustomButton
          title="Sign Out"
          onPress={handleLogout}
          variant="outline"
          size="lg"
          style={styles.logoutBtn}
          textStyle={styles.logoutBtnText}
        />
      </ScrollView>

      {/* Edit Name Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile Name</Text>

            <CustomInput
              label="Full Name"
              value={newName}
              onChangeText={text => {
                setNewName(text);
                if (nameError) setNameError(null);
              }}
              placeholder="Your Name"
              autoCapitalize="words"
              error={nameError}
            />

            <View style={styles.modalButtonsRow}>
              <CustomButton
                title="Cancel"
                onPress={() => setIsEditModalVisible(false)}
                variant="secondary"
                size="md"
                style={styles.modalBtn}
              />
              <CustomButton
                title="Save"
                onPress={handleUpdateName}
                isLoading={isLoading}
                variant="primary"
                size="md"
                style={styles.modalBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  userCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  userName: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  editNameBtn: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
  },
  editNameText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  statsCardTitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.borderLight,
  },
  statNumber: {
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  positiveText: {
    color: colors.income,
  },
  negativeText: {
    color: colors.expense,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  infoCardTitle: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs + 2,
  },
  infoKey: {
    fontSize: fontSize.body,
    color: colors.textSecondary,
  },
  infoVal: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xxs + 1,
    borderRadius: radius.pill,
  },
  statusOnline: {
    backgroundColor: colors.incomeLight,
  },
  statusOffline: {
    backgroundColor: colors.surfaceSecondary,
  },
  statusText: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.bold,
  },
  statusOnlineText: {
    color: colors.incomeDark,
  },
  statusOfflineText: {
    color: colors.textSecondary,
  },
  portfolioCard: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  portfolioTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.primaryDark,
    marginBottom: spacing.xs,
  },
  portfolioText: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  logoutBtn: {
    borderColor: colors.expense,
  },
  logoutBtnText: {
    color: colors.expense,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.subtitle,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  modalBtn: {
    flex: 1,
  },
});
