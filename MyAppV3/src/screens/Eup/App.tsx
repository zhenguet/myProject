import React, { useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { between } from 'react-native-redash';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Eup from './component/Eup';

const words = [
  { id: 1, text: 'Thiên' },
  { id: 2, text: 'địa, địa, địa' },
  { id: 3, text: 'bất' },
  { id: 4, text: 'nhân, nhân, nhân' },
  { id: 5, text: 'dĩ' },
  { id: 6, text: 'vạn' },
  { id: 7, text: 'vật' },
  { id: 8, text: 'vi' },
  { id: 9, text: 'sô' },
  { id: 10, text: 'cẩu' },
  { id: 11, text: 'Thiên, Thiên, Thiên, Thiên' },
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
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const ready = useSharedValue(true);

  // giá trị original để đánh dấu, sẽ chỉ cập nhật sau khi quá trình thả
  // const offsets = words.map((item, index) => ({
  //   originalOrder: useSharedValue(0),
  //   order: useSharedValue(index), // thứ tự trong list
  //   width: useSharedValue(0),
  //   height: useSharedValue(0),
  //   rowHeight: useSharedValue(0),
  //   x: useSharedValue(0), // toạ độ phía trên cùng bên trái
  //   y: useSharedValue(0), // toạ độ phía trên cùng bên trái
  //   originalX: useSharedValue(0),
  //   originalY: useSharedValue(0),
  // }));

  const [loading, setLoading] = useState(true);
  // useLayoutEffect(() => {
  //   if (!loading) calPosition(offsets);
  // }, [loading]);

  return (
    <Eup />
    // <SafeAreaView style={backgroundStyle}>
    //   <GestureHandlerRootView style={styles.container}>
    //     <View style={[styles.panContainer, { margin: INNER_MARGIN }]}>
    //       <View
    //         style={[styles.innerPanContainer]}
    //         onLayout={() => setLoading(false)}
    //       >
    //         {words.map((item, index) => (
    //           <View
    //             style={[styles.itemWrap, { opacity: 0 }]}
    //             onLayout={({ nativeEvent: { layout } }) => {
    //               const offset = offsets[index];
    //               offset.width.value = layout.width + 5;
    //               offset.height.value = layout.height + 5;
    //             }}
    //             key={index}
    //           >
    //             <Text style={styles.itemText}>{item.text}</Text>
    //           </View>
    //         ))}
    //       </View>
    //       <View style={{ position: "absolute" }}>
    //         {words.map((item, index) => (
    //           <Item
    //             item={item}
    //             offsets={offsets}
    //             ready={ready}
    //             index={index}
    //             key={item.id}
    //           />
    //         ))}
    //       </View>
    //     </View>
    //   </GestureHandlerRootView>
    // </SafeAreaView>
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

      const newIndex = calIndex(offset, offsets);

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
          ></Animated.View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

const itemPerRow = 3;
/** tính index tương đối của phần tử đang thao tác */
const calIndex = (offset: any, offsets: Array<any>) => {
  'worklet';

  // sắp xếp theo order
  const _offsets = [...offsets].sort(
    (first, second) => first.originalOrder.value - second.originalOrder.value,
  );

  const x = offset.x.value;
  const y = offset.y.value;
  const width = offset.width.value;
  const height = offset.rowHeight.value;

  // tìm phần tử đầu tiên trong list có thể đảo vị trí
  let _offset = _offsets.find(
    os =>
      (between(
        x + width / 4,
        os.originalX.value,
        os.originalX.value + os.width.value,
      ) ||
        between(
          x + (width * 3) / 4,
          os.originalX.value,
          os.originalX.value + os.width.value,
        )) &&
      (between(
        y + height / 4,
        os.originalY.value,
        os.originalY.value + os.height.value,
      ) ||
        between(
          y + (height * 3) / 4,
          os.originalY.value,
          os.originalY.value + os.height.value,
        )),
  );

  // nếu ko có thì tìm phần tử đầu tiên trong hàng có thể đảo vị trí
  if (!_offset)
    _offset = _offsets.find(
      os =>
        x < os.originalX.value &&
        between(y, os.originalY.value, os.originalY.value + os.height.value),
    );

  if (_offset) return _offset.originalOrder.value;

  // nếu ko có thì xem item đã di chuyển ra đầu danh sách chưa => index = 0
  if (x < _offsets[0].originalX.value && y < _offsets[0].originalY.value)
    return 0;

  // ko hợp lệ xếp về cuối
  return _offsets.length - 1;
};

/**Tính vị trí {x, y} của tất cả phần tử
 * Nếu có ignoreIndex tức là đang trong quá trình kéo, sẽ bỏ qua phần tử đang kéo và ko set giá trị original
 */
const calPosition = (offsets: Array<any>, ignoreIndex?: number) => {
  'worklet';
  for (let gIndex = 0; gIndex < offsets.length / itemPerRow; gIndex++) {
    // tính vị trí bắt đầu theo trục Y của dòng, trục X bắt đầu luôn là 0
    let yValue = 0;
    if (gIndex > 0) {
      for (let i = 0; i < gIndex; i++) {
        const first = offsets[i * itemPerRow]; // phần tử đầu tiên của dòng
        // set giá trị height của dòng bằng nhau, theo phần tử cao nhất
        let maxHeight = first.height.value;
        for (let j = 1; j < itemPerRow; j++) {
          if (offsets[i * itemPerRow + j])
            maxHeight = Math.max(
              maxHeight,
              offsets[i * itemPerRow + j].height.value,
            );
        }
        yValue += maxHeight;
      }
    }

    const first = offsets[gIndex * itemPerRow]; // phần tử đầu tiên của dòng
    // set giá trị heiht của dòng bằng nhau, theo phần tử cao nhất
    let maxHeight = first.height.value;
    for (let j = 1; j < itemPerRow; j++) {
      if (offsets[gIndex * itemPerRow + j])
        maxHeight = Math.max(
          maxHeight,
          offsets[gIndex * itemPerRow + j].height.value,
        );
    }

    // set giá trị từng phần tử
    for (let i = 0; i < itemPerRow; i++) {
      if (offsets[gIndex * itemPerRow + i]) {
        const item = offsets[gIndex * itemPerRow + i];
        if (ignoreIndex && item.originalOrder.value == ignoreIndex) {
          continue;
        }
        item.rowHeight.value = maxHeight;
        item.x.value = item.width.value * i;
        item.y.value = yValue;
        if (!ignoreIndex) {
          item.originalY.value = yValue;
          item.originalX.value = item.width.value * i;
          item.originalOrder.value = item.order.value;
        }
      }
    }
  }
};
/** di chuyển các phần tử khác */
const move = (oldIndex: number, newIndex: number, offsets: Array<any>) => {
  'worklet';

  const selecting = offsets.find(x => x.originalOrder.value === oldIndex);
  // cập nhật order hiện tại
  selecting.order.value = newIndex;

  offsets.forEach(item => {
    let order = item.originalOrder.value;
    // cập nhật order và toạ độ các điểm khác
    if (order != oldIndex) {
      // những phần tử nằm giữa newIndex và oldIndex là bị thay đổi order
      if (
        (order <= newIndex && order > oldIndex && newIndex > oldIndex) ||
        (order >= newIndex && order < oldIndex && newIndex < oldIndex)
      ) {
        if (order < oldIndex) {
          order += 1;
        } else {
          order -= 1;
        }
      }
      item.order.value = order;
    }
  });

  const _offsets = [...offsets].sort(
    (first, second) => first.order.value - second.order.value,
  );

  calPosition(_offsets, oldIndex);
};

/** cập nhật giá trị tất cả */
const setPosition = (offset: any, offsets: Array<any>) => {
  'worklet';
  const oldIndex = offset.originalOrder.value;
  const newIndex = offset.order.value;

  // cập nhật original cho các phần tử khác
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
      item.order.value = originalOrder;
      item.originalOrder.value = originalOrder;
    }
  });

  offset.originalOrder.value = newIndex;
  const _offsets = [...offsets].sort(
    (first, second) => first.originalOrder.value - second.originalOrder.value,
  );
  calPosition(_offsets);
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

export default App;
