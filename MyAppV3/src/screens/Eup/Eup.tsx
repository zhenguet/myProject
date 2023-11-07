import React, { useLayoutEffect, useState } from 'react';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { calPosition, move, setPosition } from './Layout';

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

const { width, height } = Dimensions.get('window');
const INNER_MARGIN = 10;
function Eup(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const ready = useSharedValue(true);

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
      for (let gIndex = 0; gIndex < offsets.length / 4; gIndex++) {
        const first = offsets[gIndex]; // phần tử đầu tiên của dòng
        // set giá trị heiht của dòng bằng nhau, theo phần tử cao nhất
        let maxHeight = first.height.value;
        for (let i = 1; i < 4; i++) {
          if (offsets[gIndex * 4 + i]) {
            maxHeight = Math.max(
              first.height.value,
              offsets[gIndex * 4 + i].height.value,
            );
          }
        }

        // tính vị trí bắt đầu theo trục Y của dòng, trục X bắt đầu luôn là 0
        let yValue = 0;
        if (gIndex > 0) {
          for (let i = 0; i < gIndex; i++) {
            yValue += offsets[i * 4].height.value;
          }
        }

        // set giá trị từng phần tử
        for (let i = 0; i < 4; i++) {
          if (offsets[gIndex * 4 + i]) {
            const item = offsets[gIndex * 4 + i];
            item.height.value = maxHeight;
            item.x.value = item.width.value * i;
            item.originalX.value = item.width.value * i;
            item.y.value = yValue;
            item.originalY.value = yValue;
            item.originalOrder.value = gIndex * 4 + i;
          }
        }
      }
    }
  }, [loading]);

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
          <ScrollView style={{ height: 100 }}>
            <View
              style={[styles.innerPanContainer]}
              onLayout={() => setLoading(false)}
            >
              {words.map((item, index) => (
                <View
                  style={[styles.itemWrap, { opacity: 0 }]}
                  onLayout={({ nativeEvent: { layout } }) => {
                    const offset = offsets[index];
                    offset.width.value = layout.width + 5;
                    offset.height.value = layout.height + 5;
                  }}
                  key={index}
                >
                  <Text style={styles.itemText}>{item.text}</Text>
                </View>
              ))}
            </View>
            <View style={{ position: 'absolute' }}>
              {words.map((item, index) => (
                <Item
                  item={item}
                  offsets={offsets}
                  ready={ready}
                  index={index}
                  key={item.id}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
const Item = ({ item, ready, offsets, index }: any) => {
  // phần tử hiện tại
  const offset = offsets[index];

  // đánh dấu đang thao tác
  const isSelected = useSharedValue(false);

  // hiển thị delete button
  const isShowDelBtn = useSharedValue(false);

  // lưu giá trị ban đầu của item với vị trí trên cùng của list
  const start = useSharedValue({ x: offset.x.value, y: offset.y.value });

  /** trigger cập nhật giá trị theo `originalOrder` của tất cả các item khi kết thúc */
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
        isShowDelBtn.value = false;
      }
    },
  );

  // pan gesture
  const pan = Gesture.Pan()
    .onStart(() => {
      isSelected.value = true;
      isShowDelBtn.value = true;
      ready.value = false;
    })
    .onUpdate(e => {
      isShowDelBtn.value = false;
      // di chuyển item
      offset.x.value = e.translationX + start.value.x;
      offset.y.value = e.translationY + start.value.y;

      const newIndex = calPosition(offset, offsets);

      move(offset.originalOrder.value, newIndex, offsets);
    })
    .onFinalize(() => {
      isSelected.value = false;
      ready.value = true;

      setPosition(offset, offsets);
    });
  pan.config = { activateAfterLongPress: 500, minDist: 10 };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: isSelected.value
            ? offset.x.value
            : withTiming(offset.x.value, { duration: 200 }),
        },
        {
          translateY: isSelected.value
            ? offset.y.value
            : withTiming(offset.y.value, { duration: 200 }),
        },
        { scale: withSpring(isSelected.value ? 1.2 : 1) },
      ],
      backgroundColor: ready.value
        ? 'red'
        : isSelected.value
        ? 'gray'
        : 'white',
      zIndex: isSelected.value ? 100000 : 1,
    };
  });

  const animatedText = useAnimatedStyle(() => {
    return {
      color: !ready.value && !isSelected.value ? 'gray' : 'white',
    };
  });

  const animatedDelBtn = useAnimatedStyle(() => ({
    display: isShowDelBtn.value ? 'flex' : 'none',
  }));
  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[styles.itemWrap, { position: 'absolute' }, animatedStyles]}
      >
        <Animated.Text style={[styles.itemText, animatedText]}>
          {item.text}
        </Animated.Text>
        <Pressable style={{ position: 'absolute' }}>
          <Animated.View
            style={[
              {
                width: 10,
                height: 10,
                backgroundColor: 'white',
                borderRadius: 10,
              },
              animatedDelBtn,
            ]}
          />
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
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
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemWrap: {
    backgroundColor: 'red',
    padding: 5,
    width: width / 6 - 10,
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
    width: (width * 2) / 3,
    backgroundColor: 'white',
  },
  innerPanContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    alignItems: 'center',
  },
});

export default Eup;
