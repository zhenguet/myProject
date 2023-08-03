import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import Square from './Square'
import { num } from './constant'

export default function Clock() {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(
        4 * Math.PI,
        {
          duration: 8000,
          easing: Easing.linear,
        },
        // finish => {
        //   console.log(finish)
        // },
      ),
      -1,
    )
  }, [])

  return (
    <View style={styles.container}>
      {new Array(num).fill(0).map((item, index) => {
        return <Square key={index} progress={progress} index={index} />
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444',
  },
})
