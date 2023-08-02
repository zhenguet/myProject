import { useTheme } from '@/Hooks'
import React from 'react'
import { Button, Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

export default function Switch({ navigation }: any) {
  const { Layout, Gutters, Images } = useTheme()

  const [state, setState] = React.useState(false)
  const timingOffset = useSharedValue(0)

  const lightAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withSpring(state ? 0 : 1),
      transform: [
        {
          translateX: timingOffset.value,
        },
      ],
    }
  })

  const nightAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withSpring(state ? 1 : 0),
      transform: [
        {
          translateX: timingOffset.value,
        },
      ],
    }
  })

  return (
    <>
      <Button
        onPress={() => {
          navigation.goBack()
        }}
        title="Back"
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Pressable
          onPress={() => {
            const offset = state ? 0 : 80 - 40
            setState(!state)
            timingOffset.value = withTiming(offset, {
              duration: 500,
              easing: Easing.out(Easing.exp),
            })
          }}
          style={{
            borderRadius: 9999,
            height: 40,
            width: 80,
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: 'silver',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Animated.Image
            source={Images.light}
            style={[styles.box, lightAnimatedStyles]}
          />
          <Animated.Image
            source={Images.night}
            style={[styles.box, nightAnimatedStyles]}
          />
        </Pressable>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#1F5A99',
    borderRadius: 20,
    height: 34,
    width: 34,
    margin: 2,
    position: 'absolute',
  },
})
