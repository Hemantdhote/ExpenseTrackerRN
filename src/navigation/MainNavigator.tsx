import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types';
import { HomeScreen } from '../screens/home/HomeScreen';
import { TransactionsScreen } from '../screens/transactions/TransactionsScreen';
import { AddTransactionScreen } from '../screens/transactions/AddTransactionScreen';
import { TransactionDetailsScreen } from '../screens/transactions/TransactionDetailsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
      <Stack.Screen
        name="TransactionDetails"
        component={TransactionDetailsScreen}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};
