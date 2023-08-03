import React from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { SIZE, num } from './constant'

const AView = Animated.View
interface ISquare {
  index: number
  progress: Animated.SharedValue<number>
}

export default function Square(props: ISquare) {
  const { index, progress } = props
  const offsetAngle = (2 * Math.PI) / num
  const finalAngle = offsetAngle * (num - 1 - index)

  const rotate = useDerivedValue(() => {
    if (progress.value <= 2 * Math.PI) {
      return Math.min(finalAngle, progress.value)
    }
    if (progress.value - 2 * Math.PI < finalAngle) {
      return finalAngle
    }

    return progress.value
  })

  const translateY = useDerivedValue(() => {
    if (rotate.value === finalAngle) {
      return withTiming(-num * SIZE)
    }

    if (progress.value > 2 * Math.PI) {
      return withTiming((index - num) * SIZE)
    }

    return withTiming(-index * SIZE)
  })

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotate.value}rad` },
        { translateY: translateY.value },
      ],
    }
  })

  return <AView style={[styles.squareItem, rStyle]} />
}

const styles = StyleSheet.create({
  squareItem: {
    backgroundColor: '#fff',
    height: SIZE,
    aspectRatio: 1,
    borderBottomWidth: 0.5,
    position: 'absolute',
  },
})
