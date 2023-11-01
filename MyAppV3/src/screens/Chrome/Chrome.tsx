import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MARGIN } from './Config';
import Tile from './Tile';
import SortableList from './SortableList';

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
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'black', paddingHorizontal: MARGIN }}
    >
      <SortableList
        editing={true}
        onDragEnd={positions => console.log(JSON.stringify(positions, null, 2))}
      >
        {tiles.map(tile => (
          <Tile
            onLongPress={() => true}
            key={tile.id.toString()}
            id={tile.id}
            uri={tile.uri}
          />
        ))}
      </SortableList>
    </SafeAreaView>
  );
};

export default Chrome;
