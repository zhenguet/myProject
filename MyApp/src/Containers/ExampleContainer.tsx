import React, { useRef, useEffect } from 'react'
import { View, Animated } from 'react-native'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import Svg, { Circle } from 'react-native-svg'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const ExampleContainer = () => {
  const cameraRef = useRef(null)
  const animatedValue = useRef(new Animated.Value(0)).current
  const devices = useCameraDevices()
  const device = devices.front

  useEffect(() => {
    Camera.requestCameraPermission()
    startAnimation()
  }, [])

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }

  const circleSize = 100
  const animatedSize = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circleSize, circleSize * 2], // Tăng kích thước từ circleSize lên gấp đôi
  })

  if (device == null) return <View />
  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={cameraRef}
        style={{
          flex: 1,
          borderRadius: 100,
        }}
        device={device}
        isActive={true}
      />
      <Svg
        height="100%"
        width="100%"
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AnimatedCircle
          cx="50%"
          cy="50%"
          r={animatedSize}
          fill="transparent"
          stroke="red"
          strokeWidth="2"
        />
      </Svg>
    </View>
  )
}

export default ExampleContainer
