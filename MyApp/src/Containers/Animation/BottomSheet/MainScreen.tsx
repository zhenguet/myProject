import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import SettingsIcon from './icons/SettingsIcon';
import { goBack } from '@/Navigators/utils';

export default function MainScreen(props: any) {
  const { onPress } = props;

  return (
    <SafeAreaView style={styles.headerContainer} edges={['top']}>
      <View style={styles.wrapper}>
        <TouchableOpacity onPress={goBack}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={styles.title}>BottomSheet screen</Text>
        <TouchableOpacity onPress={onPress}>
          <SettingsIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  reverse: {
    flexDirection: 'column-reverse',
  },
  wrapper: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  headerContainer: {
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C1C6E5',
  },
  footerContainer: {
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C1C6E5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001A72',
  },
});
