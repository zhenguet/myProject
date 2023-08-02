import React from 'react';
import { View, StyleSheet } from 'react-native';

import WordList from './WordList';
import Word from './Word';
import Header from './components/Header';
import Footer from './components/Footer';

const words = [
  { id: 1, word: 'Xin' },
  { id: 7, word: 'mừng' },
  { id: 2, word: 'chào' },
  { id: 5, word: ',' },
  { id: 3, word: 'Việt' },
  { id: 9, word: 'đến' },
  { id: 4, word: 'Nam' },
  { id: 6, word: 'bạn' },
  { id: 8, word: 'chào' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

const Duolingo = () => {
  return (
    <View style={styles.container}>
      <Header />
      <WordList>
        {words.map(word => (
          <Word key={word.id} {...word} />
        ))}
      </WordList>
      <Footer />
    </View>
  );
};

export default Duolingo;
