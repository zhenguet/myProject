import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MARGIN } from './Config';
import SortableList from './SortableList';
import { Text, View } from 'react-native';

const tiles = [
  {
    id: 'google',
    uri: 'https://google.com',
  },

  {
    id: 'expo',
    uri: 'https://expo.io',
  },
  {
    id: 'facebook',
    uri: 'https://facebook.com',
  },
  {
    id: 'reanimated',
    uri: 'https://docs.swmansion.com/react-native-reanimated/',
  },
  {
    id: 'github',
    uri: 'https://github.com',
  },
  {
    id: 'rnnavigation',
    uri: 'https://reactnavigation.org/',
  },
  {
    id: 'youtube',
    uri: 'https://youtube.com',
  },
  {
    id: 'twitter',
    uri: 'https://twitter.com',
  },
];

const Chrome = () => {
  const [editing, setEditing] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: MARGIN }}>
      <SortableList
        editing={editing}
        setEditing={setEditing}
        onDragEnd={positions => console.log(JSON.stringify(positions, null, 2))}
      >
        {tiles.map(tile => (
          <View
            id={tile.id}
            key={tile.id.toString()}
            style={{
              backgroundColor: 'aqua',
              flex: 1,
              margin: MARGIN,
              borderRadius: MARGIN,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ textAlign: 'center' }}>{tile.id}</Text>
          </View>
        ))}
      </SortableList>
    </SafeAreaView>
  );
};

export default Chrome;
