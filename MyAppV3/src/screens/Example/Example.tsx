/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { between } from 'react-native-redash';
import { Colors } from 'react-native/Libraries/NewAppScreen';

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
];

// const MARGIN_TOP = 20;
const MARGIN_LEFT = 20;
const { width, height } = Dimensions.get('window');
const containerWidth = width - MARGIN_LEFT * 2;
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedItem, setSelectedItem] = useState(null);

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const panContainerLayout = useRef<any>();
  const modalVisible = useSharedValue(false);
  const openModal = () => {
    modalVisible.value = true;
  };
  const closeModal = () => {
    'worklet';
    modalVisible.value = false;
  };
  const modalStyles = useAnimatedStyle(() => {
    return {
      top: withTiming(modalVisible.value ? 0 : height),
    };
  });

  const ready = useSharedValue(true);
  const offsets = words.map((item, index) => ({
    originalOrder: useSharedValue(index),
    order: useSharedValue(index),
    width: useSharedValue(50),
    height: useSharedValue(50),
    x: useSharedValue((index % 4) * 55),
    y: useSharedValue(Math.floor(index / 4) * 55),
    originalX: useSharedValue((index % 4) * 55),
    originalY: useSharedValue(Math.floor(index / 4) * 55),
  }));

  const onCheck = () => setSelectedItem(null);

  return (
    <SafeAreaView style={backgroundStyle}>
      <GestureHandlerRootView style={styles.container}>
        <View
          onLayout={({ nativeEvent: { layout } }) => {
            panContainerLayout.current = layout;
          }}
          style={styles.panContainer}
        />
        <TouchableOpacity
          onPress={openModal}
          style={{ width: 50, height: 50, backgroundColor: 'green' }}
        />
        <Animated.View style={[styles.modalContainer, modalStyles]}>
          <Pressable style={styles.modalBackdrop} onPress={closeModal} />
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={selectedItem && onCheck}
          >
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 5,
              }}
            >
              {words.map((item, index) => (
                <Item
                  item={item}
                  closeModal={closeModal}
                  offsets={offsets}
                  ready={ready}
                  index={index}
                  key={item.id}
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                />
              ))}
            </View>
          </View>
        </Animated.View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
const Item = ({
  item,
  closeModal,
  ready,
  offsets,
  index,
  selectedItem,
  setSelectedItem,
}: any) => {
  const isLongPressed = useSharedValue(false);
  const offset = offsets[index];

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: isLongPressed.value
            ? offset.x.value
            : withTiming(offset.x.value, {
                easing: Easing.inOut(Easing.ease),
                duration: 350,
              }),
        },
        {
          translateY: isLongPressed.value
            ? offset.y.value
            : withTiming(offset.y.value, {
                easing: Easing.inOut(Easing.ease),
                duration: 350,
              }),
        },
        { scale: withSpring(isLongPressed.value ? 1.2 : 1) },
      ],
      backgroundColor: ready.value
        ? 'red'
        : isLongPressed.value
        ? 'gray'
        : 'white',
      zIndex: isLongPressed.value ? 100000 : 1,
    };
  });

  const animatedText = useAnimatedStyle(() => {
    return {
      color: !ready.value && !isLongPressed.value ? 'gray' : 'white',
    };
  });
  const start = useSharedValue({ x: offset.x.value, y: offset.y.value });

  useAnimatedReaction(
    () => {
      return offset.originalOrder.value;
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        start.value = {
          x: offset.x.value,
          y: offset.y.value,
        };

        offset.originalX.value = offset.x.value;
        offset.originalY.value = offset.y.value;
      }
    },
  );

  const pan = Gesture.Pan()
    .manualActivation(true)
    .onTouchesMove((event, stateManager) => {
      if (isLongPressed.value) {
        stateManager.activate();
      } else {
        stateManager.fail();
      }
    })
    .onUpdate(e => {
      runOnJS(setSelectedItem)(null);

      offset.x.value = e.translationX + start.value.x;
      offset.y.value = e.translationY + start.value.y;
      const newIndex = calPosition(offset, offsets);
      move(offset.originalOrder.value, newIndex, offsets);
    })
    .onFinalize(() => {
      isLongPressed.value = false;
      ready.value = true;
      const oldIndex = offset.originalOrder.value;
      const newIndex = offset.order.value;
      offsets.forEach((item: any) => {
        let originalOrder = item.originalOrder.value;
        if (originalOrder != oldIndex) {
          if (
            (originalOrder <= newIndex &&
              originalOrder > oldIndex &&
              newIndex > oldIndex) ||
            (originalOrder >= newIndex &&
              originalOrder < oldIndex &&
              newIndex < oldIndex)
          ) {
            if (originalOrder < oldIndex) {
              originalOrder += 1;
            } else {
              originalOrder -= 1;
            }
          }
          item.originalOrder.value = originalOrder;
        }
      });
      offset.originalOrder.value = newIndex;
      offset.x.value = (newIndex % 4) * 55;
      offset.y.value = Math.floor(newIndex / 4) * 55;
      // console.log(offsets);
    });

  const longPress = Gesture.LongPress()
    .minDuration(350)
    .onStart(() => {
      isLongPressed.value = true;
      runOnJS(setSelectedItem)(item);
      ready.value = false;
    });
  // .onEnd(() => {
  //   isLongPressed.value = false;
  // });

  const composed = Gesture.Simultaneous(pan, longPress);

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.itemWrap, animatedStyles]}>
        <Animated.Text style={[styles.itemText, animatedText]}>
          {item.id}
        </Animated.Text>

        {selectedItem?.id === item.id && (
          <Pressable
            onPress={() => {
              setSelectedItem(null);
              console.log(item);
            }}
            style={{
              position: 'absolute',
              top: -50,
              width: width * 0.6,
              backgroundColor: 'aqua',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 100000,
              padding: 8,
              borderRadius: 5,
            }}
          >
            <Animated.Text>Thêm vào danh sách yêu thích</Animated.Text>
          </Pressable>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const calPosition = (offset: any, offsets: Array<any>) => {
  'worklet';
  const _offsets = [...offsets].sort(
    (first, second) => first.originalX.value - second.originalX.value,
  );

  let _offset = _offsets.find(
    os =>
      (between(
        offset.x.value,
        os.originalX.value,
        os.originalX.value + os.width.value,
      ) ||
        between(
          offset.x.value + offset.width.value,
          os.originalX.value,
          os.originalX.value + os.width.value,
        )) &&
      (between(
        offset.y.value,
        os.originalY.value,
        os.originalY.value + os.height.value,
      ) ||
        between(
          offset.y.value + offset.height.value,
          os.originalY.value,
          os.originalY.value + os.height.value,
        )),
  );
  if (!_offset) {
    _offset = _offsets.find(
      os =>
        offset.x.value < os.originalX.value &&
        between(
          offset.y.value,
          os.originalY.value,
          os.originalY.value + os.height.value,
        ),
    );
  }

  if (_offset) return _offset.originalOrder.value;

  if (
    offset.x.value < _offsets[0].originalX.value &&
    offset.y.value < _offsets[0].originalY.value
  )
    return 0;

  return _offsets.length - 1;
};

const move = (oldIndex: number, newIndex: number, offsets: Array<any>) => {
  'worklet';
  const selecting = offsets.find(x => x.originalOrder.value === oldIndex);
  selecting.order.value = newIndex;
  offsets.forEach(item => {
    let originalOrder = item.originalOrder.value;
    if (originalOrder != oldIndex) {
      if (
        (originalOrder <= newIndex &&
          originalOrder > oldIndex &&
          newIndex > oldIndex) ||
        (originalOrder >= newIndex &&
          originalOrder < oldIndex &&
          newIndex < oldIndex)
      ) {
        if (originalOrder < oldIndex) {
          originalOrder += 1;
        } else {
          originalOrder -= 1;
        }
      }
      // item.originalOrder.value = originalOrder;
      item.x.value = (originalOrder % 4) * 55;
      item.y.value = Math.floor(originalOrder / 4) * 55;
    }
  });
};

const styles = StyleSheet.create({
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
  },
  itemWrap: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    position: 'absolute',
    margin: 5,
  },
  itemText: {
    fontSize: 20,
  },
  panContainer: {
    backgroundColor: 'yellow',
    padding: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginHorizontal: MARGIN_LEFT,
    width: containerWidth,
    minHeight: 100,
  },
  modalContainer: {
    position: 'absolute',
    width,
    height,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    width,
    height,
    backgroundColor: '#000',
    opacity: 0.3,
  },
  modalContent: {
    width: 220,
    height: 400,
    backgroundColor: 'white',
  },
});

export default App;
