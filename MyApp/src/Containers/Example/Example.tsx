import React from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native'

type dataType = {
  screenName: string
}

const data: Array<dataType> = [
  {
    screenName: 'SpringBox',
  },
  {
    screenName: 'TimingBox',
  },
  {
    screenName: 'WobbleExample',
  },
  {
    screenName: 'HandlingGesture',
  },
  {
    screenName: 'HandlingContinuous',
  },
  {
    screenName: 'InvertedFlatListExample',
  },
  {
    screenName: 'Slider',
  },
  {
    screenName: 'Switch',
  },
  {
    screenName: 'Duolingo',
  },
  {
    screenName: 'BottomSheet',
  },
  {
    screenName: 'Countdown',
  },
  {
    screenName: 'Bedtime',
  },
  {
    screenName: 'Clock',
  },{
    screenName: 'Camera',
  },
]

const Example = (props: any) => {
  const { navigation } = props

  return (
    <FlatList
      data={data}
      keyExtractor={(item: any) => item.screenName}
      renderItem={({ item }: { item: dataType }) => (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate(item.screenName)
          }}
        >
          <Text style={{ textAlign: 'center' }}>{item.screenName}</Text>
        </TouchableOpacity>
      )}
    />
  )
}

export default Example

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: '#D7F0FA',
  },
})
