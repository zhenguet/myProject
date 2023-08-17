import React, { useEffect } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  useDerivedValue,
} from 'react-native-reanimated'

const defaultCornerStyle = {
  height: 32,
  width: 32,
  borderWidth: 8,
  borderColor: '#1A6DD5',
}
interface IScannerRectView {
  maskColor?: string
  rectStyle?: StyleProp<ViewStyle> | undefined

  cornerStyle?: StyleProp<ViewStyle> | undefined
  cornerOffsetSize?: number
  isShowCorner?: boolean

  isShowScanBar?: boolean
  scanBarAnimateTime?: number
  scanBarAnimateReverse?: boolean
  scanBarImage?: any
  scanBarStyle?: StyleProp<ViewStyle> | undefined

  hintText?: string
}

export function ScannerRectView(props: IScannerRectView) {
  const progress = useSharedValue(0)
  const animationConfig = {
    duration: 3000,
    easing: Easing.linear,
  }

  useEffect(() => {
    progress.value = withRepeat(withTiming(200, animationConfig), -1)
  }, [])

  const translateY = useDerivedValue(() => {
    return withTiming(progress.value)
  })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    }
  })

  return (
    <View style={[styles.container, { bottom: 0 }]}>
      <Animated.View style={[animatedStyle]}>
        <View style={[{ height: 4 }, styles.scanBarStyle]} />
      </Animated.View>
      <View style={styles.topLeftCorner} />
      <View style={styles.topRightCorner} />
      <View style={styles.bottomLeftCorner} />
      <View style={styles.bottomRightCorner} />
    </View>
  )
}

ScannerRectView.defaultProps = {
  maskColor: '#0000004D',
  cornerOffsetSize: 0,
  isShowScanBar: true,
  isShowCorner: true,
  scanBarAnimateTime: 3000,
  hintText: '',
}

const styles = StyleSheet.create({
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    height: 200,
    width: 200,
    borderRadius: 15,
  },
  viewfinder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBarStyle: {
    marginHorizontal: 8,
    borderRadius: 2,
    backgroundColor: '#1A6DD5',
  },
  topLeftCorner: {
    ...defaultCornerStyle,
    position: 'absolute',
    top: -4,
    left: -4,
    borderTopLeftRadius: 15,
    zIndex: 9,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRightCorner: {
    ...defaultCornerStyle,
    position: 'absolute',
    top: -4,
    right: -4,
    borderTopRightRadius: 15,
    zIndex: 9,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeftCorner: {
    ...defaultCornerStyle,
    position: 'absolute',
    bottom: -4,
    left: -4,
    borderBottomLeftRadius: 15,
    zIndex: 9,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRightCorner: {
    ...defaultCornerStyle,
    position: 'absolute',
    bottom: -4,
    right: -4,
    borderBottomRightRadius: 15,
    zIndex: 9,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
})
