import React from 'react';
import { Example, Chrome, Draglist, ScrollView } from '../screens';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// @refresh reset
const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ScrollView" component={ScrollView} />
      <Stack.Screen name="Home" component={Example} />
      <Stack.Screen name="Chrome" component={Chrome} />
      <Stack.Screen name="Draglist" component={Draglist} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
