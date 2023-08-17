import React, { useEffect, useState } from 'react'
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

const defaultRectStyle = {
  height: 200,
  width: 200,
  borderWidth: 0,
  borderColor: '#000000',
  marginBottom: 0,
}
const defaultCornerStyle = {
  height: 32,
  width: 32,
  borderWidth: 8,
  borderColor: '#1A6DD5',
}
const defaultScanBarStyle = {
  marginHorizontal: 8,
  borderRadius: 2,
  backgroundColor: '#1A6DD5',
}
const defaultHintTextStyle = {
  color: '#fff',
  fontSize: 14,
  backgroundColor: 'transparent',
  marginTop: 32,
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
  hintTextStyle?: StyleProp<ViewStyle> | undefined
}

export function ScannerRectView(props: IScannerRectView) {
  const {
    cornerOffsetSize,
    isShowScanBar,
    rectStyle,
    cornerStyle,
    scanBarStyle,
    hintTextStyle,
    scanBarAnimateTime,
  } = props

  const innerRectStyle: any = Object.assign(defaultRectStyle, rectStyle)
  const innerCornerStyle: any = Object.assign(defaultCornerStyle, cornerStyle)
  const innerScanBarStyle: any = Object.assign(
    defaultScanBarStyle,
    scanBarStyle,
  )
  const innerHintTextStyle: any = Object.assign(
    defaultHintTextStyle,
    hintTextStyle,
  )
  const animatedValue = new Animated.Value(0)
  const animatedStyle = {
    transform: [{ translateY: animatedValue }],
  }

  useEffect(() => {
    scanBarMove()
  }, [])

  const scanBarMove = () => {
    const scanBarHeight = isShowScanBar ? innerScanBarStyle.height || 4 : 0
    const startValue = innerCornerStyle.borderWidth
    const endValue =
      innerRectStyle.height -
      (innerRectStyle.borderWidth +
        cornerOffsetSize +
        innerCornerStyle.borderWidth) -
      scanBarHeight

    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: endValue,
          duration: scanBarAnimateTime,
          easing: Easing.linear,
          isInteraction: false,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: startValue,
          duration: scanBarAnimateTime,
          easing: Easing.linear,
          isInteraction: false,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: 4,
      },
    ).start(() => scanBarMove())
  }

  return (
    <View style={[styles.container, { bottom: 0 }]}>
      <Animated.View style={[animatedStyle]}>
        <View style={[{ height: 4 }, innerScanBarStyle]} />
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
