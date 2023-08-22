import {
  Bedtime,
  BottomSheet,
  Camera,
  Clock,
  Countdown,
  Duolingo,
  Example,
  HandlingContinuous,
  HandlingGesture,
  InvertedFlatListExample,
  Slider,
  SpringBox,
  Switch,
  TimingBox,
  WobbleExample,
} from '@/Containers'
import CircleProcess from '@/Containers/Animation/CircleProcess'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

const Stack = createStackNavigator()

// @refresh reset
const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Example} />
      <Stack.Screen name="SpringBox" component={SpringBox} />
      <Stack.Screen name="TimingBox" component={TimingBox} />
      <Stack.Screen name="WobbleExample" component={WobbleExample} />
      <Stack.Screen name="HandlingGesture" component={HandlingGesture} />
      <Stack.Screen name="HandlingContinuous" component={HandlingContinuous} />
      <Stack.Screen
        name="InvertedFlatListExample"
        component={InvertedFlatListExample}
      />
      <Stack.Screen name="Slider" component={Slider} />
      <Stack.Screen name="Switch" component={Switch} />
      <Stack.Screen name="Duolingo" component={Duolingo} />
      <Stack.Screen name="BottomSheet" component={BottomSheet} />
      <Stack.Screen name="Countdown" component={Countdown} />
      <Stack.Screen name="Bedtime" component={Bedtime} />
      <Stack.Screen name="Clock" component={Clock} />
      <Stack.Screen name="Camera" component={Camera} />
      <Stack.Screen name="CircleProcess" component={CircleProcess} />
    </Stack.Navigator>
  )
}

export default MainNavigator
