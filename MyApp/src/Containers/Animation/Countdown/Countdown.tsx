import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import CountdownCircle from './CountdownCircle'

const Countdown = () => {
  useEffect(() => {
    // Start the countdown here, e.g., using useState and useEffect hooks
    // You can set a timer to decrement the timeInSeconds every second
    // When the timeInSeconds reaches 0, you can handle the finished event.
  }, [])

  return (
    <View style={styles.container}>
      <CountdownCircle timeInSeconds={60} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Countdown
