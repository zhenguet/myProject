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

const words = [
  { id: 1, text: 'Thiên' },
  { id: 2, text: 'địa' },
  { id: 3, text: 'bất' },
  { id: 4, text: 'nhân' },
  { id: 5, text: 'dĩ' },
  { id: 6, text: 'vạn' },
  { id: 7, text: 'vật' },
  { id: 8, text: 'vi' },
  { id: 9, text: 'sô' },
  { id: 10, text: 'cẩu' },
  { id: 11, text: 'Thiên' },
  { id: 12, text: 'địa' },
  { id: 13, text: 'bất' },
  { id: 14, text: 'nhân' },
  { id: 15, text: 'dĩ' },
  { id: 16, text: 'vạn' },
  { id: 17, text: 'vật' },
  { id: 18, text: 'vi' },
  { id: 19, text: 'sô' },
  { id: 20, text: 'cẩu' },
];

const itemPerPage = 12;

const images = Array.from(Array(Math.ceil(words.length / itemPerPage)).keys());

const { width, height } = Dimensions.get('window');
const containerWidth = width * 0.75;
const INNER_MARGIN = 10;
function Eup(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const ready = useSharedValue(true);
  const translateX = useSharedValue(0);

  // giá trị original để đánh dấu, sẽ chỉ cập nhật sau khi quá trình thả
  const offsets = words.map((item, index) => ({
    originalOrder: useSharedValue(0),
    order: useSharedValue(index), // thứ tự trong list
    width: useSharedValue(0),
    height: useSharedValue(0),
    x: useSharedValue(0), // toạ độ phía trên cùng bên trái
    y: useSharedValue(0), // toạ độ phía trên cùng bên trái
    originalX: useSharedValue(0),
    originalY: useSharedValue(0),
  }));

  const [loading, setLoading] = useState(true);
  useLayoutEffect(() => {
    if (!loading) {
      // vòng lặp theo dòng
      for (let gIndex = 0; gIndex < offsets.length / 3; gIndex++) {
        const first = offsets[gIndex]; // phần tử đầu tiên của dòng
        // set giá trị heiht của dòng bằng nhau, theo phần tử cao nhất
        let maxHeight = first.height.value;
        for (let i = 1; i < 3; i++) {
          if (offsets[gIndex * 3 + i]) {
            maxHeight = Math.max(
              first.height.value,
              offsets[gIndex * 3 + i].height.value,
            );
          }
        }

        // tính vị trí bắt đầu theo trục Y của dòng, trục X bắt đầu luôn là 0
        let yValue = 0;
        if (gIndex > 0) {
          for (let i = 0; i < gIndex; i++) {
            yValue += offsets[i * 3].height.value;
          }
        }

        // set giá trị từng phần tử
        for (let i = 0; i < 3; i++) {
          if (offsets[gIndex * 3 + i]) {
            const item = offsets[gIndex * 3 + i];
            item.height.value = maxHeight;
            item.x.value = item.width.value * i;
            item.originalX.value = item.width.value * i;
            item.y.value = yValue;
            item.originalY.value = yValue;
            item.originalOrder.value = gIndex * 3 + i;
          }
        }
      }
    }
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
              onScroll={scrollHandler}
              pagingEnabled
              scrollEventThrottle={16}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {images.map((image, imageIndex) => {
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
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                );
              })}
            </Animated.ScrollView>
            <View style={styles.indicatorContainer}>
              {images.map((image, imageIndex) => {
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
