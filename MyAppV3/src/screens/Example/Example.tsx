import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

type dataType = {
  screenName: string;
};

const data: Array<dataType> = [
  {
    screenName: 'ScrollView',
  },
  {
    screenName: 'Chrome',
  },
  {
    screenName: 'Draglist',
  },
  {
    screenName: 'Eup',
  },
];

const Example = (props: any) => {
  const { navigation } = props;

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={data}
        keyExtractor={(item: any) => item.screenName}
        renderItem={({ item }: { item: dataType }) => (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate(item.screenName);
            }}
          >
            <Text style={{ textAlign: 'center' }}>{item.screenName}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default Example;

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: '#D7F0FA',
  },
});
