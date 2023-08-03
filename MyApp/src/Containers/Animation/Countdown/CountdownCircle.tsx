import React from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
  Easing,
  multiply,
  useAnimatedStyle,
} from 'react-native-reanimated'

const {
  set,
  cond,
  startClock,
  stopClock,
  clockRunning,
  block,
  timing,
  debug,
  Value,
  Clock,
  divide,
  sub,
} = Animated

const CountdownCircle = ({ timeInSeconds }: any) => {
  const clock = new Clock()
  const progress = new Value(0)
  const duration = timeInSeconds * 1000 // Chuyển đổi thành milliseconds

  const state = {
    finished: new Value(0),
    position: new Value(0),
    frameTime: new Value(0),
    time: new Value(0),
  }

  const config = {
    duration: duration,
    toValue: new Value(1),
    easing: Easing.linear,
  }

  const uas = useAnimatedStyle(() => ({
    transform: [{ rotate: multiply(360, progress) }],
  }))

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, uas]} />
      {timing(clock, state, config)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'gray',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'blue',
  },
})

export default CountdownCircle
