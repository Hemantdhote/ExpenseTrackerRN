import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../store';
import { SplashScreen } from '../screens/splash/SplashScreen';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { colors } from '../constants';

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isInitializing } = useAppSelector(state => state.auth);

  return (
    <View style={styles.container}>
      <NavigationContainer>
        {isInitializing ? (
          <SplashScreen />
        ) : isAuthenticated ? (
          <MainNavigator />
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
