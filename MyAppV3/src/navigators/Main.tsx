import React from 'react';
import { Example, Chrome, Draglist, ScrollView, Eup } from '../screens';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// @refresh reset
const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Example} />
      <Stack.Screen name="ScrollView" component={ScrollView} />
      <Stack.Screen name="Chrome" component={Chrome} />
      <Stack.Screen name="Draglist" component={Draglist} />
      <Stack.Screen name="Eup" component={Eup} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
