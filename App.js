import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import TokenGeneratorScreen from './screens/TokenValidatorScreen';
import TokenValidatorScreen from './screens/TokenValidatorScreen';
import ViewTokensScreen from './screens/ViewTokensScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="GenerateToken" component={TokenGeneratorScreen} />
        <Stack.Screen name="ValidateToken" component={TokenValidatorScreen} />
        <Stack.Screen name="ViewTokens" component={ViewTokensScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
