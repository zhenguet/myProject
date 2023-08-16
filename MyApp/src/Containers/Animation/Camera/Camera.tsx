import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BarcodeScanner, QRScanner } from '@/Components'

export default function Camera() {
  return (
    <View>
      <Text>Camera</Text>
      <QRScanner />
    </View>
  )
}

const styles = StyleSheet.create({})
