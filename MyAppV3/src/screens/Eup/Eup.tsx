import React, { useLayoutEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Item from './Item';
import { calPosition } from './Layout';

const words = [
  { id: 1, text: 'Thiên1' },
  { id: 2, text: 'địa1' },
  { id: 3, text: 'bất1' },
  { id: 4, text: 'nhân1' },
  { id: 5, text: 'dĩ1' },
  { id: 6, text: 'vạn1' },
  { id: 7, text: 'vật1' },
  { id: 8, text: 'vi1' },
  { id: 9, text: 'sô1' },
  { id: 10, text: 'cẩu1' },
  { id: 11, text: 'Thiên Thiên' },
  { id: 12, text: 'địa2' },
  { id: 13, text: 'bất2' },
  { id: 14, text: 'nhân2' },
  { id: 15, text: 'dĩ2' },
  { id: 16, text: 'vạn2' },
  { id: 17, text: 'vật2' },
  { id: 18, text: 'vi2' },
  { id: 19, text: 'sô2' },
  { id: 20, text: 'cẩu2' },
  { id: 21, text: 'Thiên Thiên Thiên' },
  { id: 22, text: 'địa3' },
  { id: 23, text: 'bất3' },
  { id: 24, text: 'nhân3' },
  { id: 25, text: 'dĩ3' },
  { id: 26, text: 'vạn3' },
  { id: 27, text: 'vật3' },
  { id: 28, text: 'vi3' },
  { id: 29, text: 'sô3' },
  { id: 30, text: 'cẩu3' },
];

const itemPerPage = 12;

const pages = Array.from(Array(Math.ceil(words.length / itemPerPage)).keys());

const { width, height } = Dimensions.get('window');
const containerWidth = width * 0.75;
const INNER_MARGIN = 10;

function Eup(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const scrollRef: any = React.useRef(null);

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const ready = useSharedValue(true);
  const translateX = useSharedValue(0);

  //giá trị original để đánh dấu, sẽ chỉ cập nhật sau khi quá trình thả
  const offsets = words.map((item, index) => ({
    originalOrder: useSharedValue(0),
    order: useSharedValue(index), // thứ tự trong list
    width: useSharedValue(0),
    height: useSharedValue(0),
    rowHeight: useSharedValue(0),
    x: useSharedValue(0), // toạ độ phía trên cùng bên trái
    y: useSharedValue(0), // toạ độ phía trên cùng bên trái
    originalX: useSharedValue(0),
    originalY: useSharedValue(0),
  }));

  const [loading, setLoading] = useState(true);
  useLayoutEffect(() => {
    if (!loading) calPosition(offsets);
  }, [loading]);

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: event => {
        translateX.value = event.contentOffset.x;
      },
      onBeginDrag: () => {},
      onEndDrag: () => {},
    },
    [],
  );

  return (
    <SafeAreaView
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
        },
        backgroundStyle,
      ]}
    >
      <GestureHandlerRootView style={styles.container}>
        <View style={[styles.panContainer, { margin: INNER_MARGIN }]}>
          <View style={styles.scrollContainer}>
            <Animated.ScrollView
              ref={scrollRef}
              onScroll={scrollHandler}
              pagingEnabled
              scrollEventThrottle={16}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {pages.map((image, imageIndex) => {
                const from = itemPerPage * imageIndex;
                const to = from + itemPerPage;

                return (
                  <View style={{ width: containerWidth }} key={imageIndex}>
                    <View style={styles.card}>
                      <View
                        style={[styles.innerPanContainer]}
                        onLayout={() => setLoading(false)}
                      >
                        {words.slice(from, to).map((item, index) => (
                          <View
                            style={[styles.itemWrap, { opacity: 0 }]}
                            onLayout={({ nativeEvent: { layout } }) => {
                              const offset = offsets[index];
                              offset.width.value = layout.width + 5;
                              offset.height.value = layout.height + 5;
                            }}
                            key={`${item.id}_${index}`}
                          >
                            <Text style={styles.itemText}>{item.text}</Text>
                          </View>
                        ))}
                      </View>
                      <View style={{ position: 'absolute' }}>
                        {words.slice(from, to).map((item, index) => (
                          <Item
                            item={item}
                            offsets={offsets}
                            ready={ready}
                            index={index}
                            key={item.id}
                            scrollRef={scrollRef}
                            translateX={translateX}
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                );
              })}
            </Animated.ScrollView>
            <View style={styles.indicatorContainer}>
              {pages.map((image, imageIndex) => {
                return (
                  <Dot
                    key={`${image}_${imageIndex}`}
                    translateX={translateX}
                    inputRange={[
                      containerWidth * (imageIndex - 1),
                      containerWidth * imageIndex,
                      containerWidth * (imageIndex + 1),
                    ]}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const Dot = (props: any) => {
  const { translateX, inputRange } = props;

  const style = useAnimatedStyle(() => {
    return {
      width: interpolate(
        translateX.value,
        inputRange,
        [8, 16, 8],
        Extrapolate.CLAMP,
      ),
      transform: [
        {
          scale: interpolate(
            translateX.value,
            inputRange,
            [1, 1.2, 1],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  return <Animated.View style={[styles.normalDot, style]} />;
};

export const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemWrap: {
    backgroundColor: 'red',
    padding: 5,
    width: containerWidth / 4 - INNER_MARGIN,
    borderWidth: 1,
  },
  itemText: {
    textAlign: 'center',
    color: 'white',
  },
  modalContainer: {
    position: 'absolute',
    width,
    height,
    left: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    width,
    height,
    // backgroundColor: "#000",
    // opacity: 0.3,
  },
  panContainer: {
    width: containerWidth,
    backgroundColor: 'white',
  },
  innerPanContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    alignItems: 'center',
  },
  scrollContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'aqua',
  },
  textContainer: {
    backgroundColor: 'rgba(0,0,0, 0.7)',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 5,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'silver',
    marginHorizontal: 4,
  },
});

export default Eup;
