import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { RootNavigator } from './src/navigation';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <RootNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
