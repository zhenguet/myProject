import React, { useState } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import 'react-native-gesture-handler'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import MainScreen from './MainScreen'
import { ACCENT_COLOR, BACKDROP_COLOR, BACKGROUND_COLOR } from './misc/colors'
import { HEIGHT, OVERDRAG } from './misc/consts'
import AccentPicker from './AccentPicker'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

function BottomSheet() {
  const [isOpen, setOpen] = useState(false)

  const accent = useSharedValue(ACCENT_COLOR)
  const offset = useSharedValue(0)

  const toggleSheet = () => {
    setOpen(!isOpen)
    offset.value = 0
  }

  const pan = Gesture.Pan()
    .onChange(event => {
      const offsetDelta = event.changeY + offset.value

      const clamp = Math.max(-OVERDRAG, offsetDelta)
      offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp)
    })
    .onFinalize(() => {
      if (offset.value < HEIGHT / 3) {
        offset.value = withSpring(0)
      } else {
        offset.value = withTiming(HEIGHT, {}, () => {
          runOnJS(toggleSheet)()
        })
      }
    })

  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }))

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <MainScreen onPress={toggleSheet} />
        {isOpen && (
          <>
            <AnimatedPressable
              style={styles.backdrop}
              entering={FadeIn}
              exiting={FadeOut}
              onPress={toggleSheet}
            />
            <GestureDetector gesture={pan}>
              <Animated.View
                style={[styles.sheet, translateY]}
                entering={SlideInDown.springify().damping(15)}
                exiting={SlideOutDown}
              >
                <AccentPicker
                  onPick={(color: any) => {
                    accent.value = color
                    toggleSheet()
                  }}
                />
              </Animated.View>
            </GestureDetector>
          </>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  sheet: {
    backgroundColor: 'white',
    padding: 16,
    height: HEIGHT,
    width: '100%',
    position: 'absolute',
    bottom: -OVERDRAG * 1.1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BACKDROP_COLOR,
    zIndex: 1,
  },
})

export default BottomSheet
