import React from 'react';
import { Pressable, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { styles } from './Eup';
import { calPosition, move, setPosition } from './Layout';
const { width } = Dimensions.get('window');

const containerWidth = width * 0.75;
const INNER_MARGIN = 10;

const itemWidth = containerWidth / 4 - INNER_MARGIN;

const Item = ({ item, ready, offsets, index, scrollRef, translateX }: any) => {
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

  const onHandleScroll = (options: {
    x?: number;
    y?: number;
    animated?: boolean;
  }) => {
    scrollRef.current.scrollTo(options);
  };

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

      if (offset.x.value < 0 && translateX.value > 0) {
        runOnJS(onHandleScroll)({
          x:
            (Math.round(translateX.value / containerWidth) - 1) *
            containerWidth,
          y: 0,
          animated: true,
        });
      }

      if (offset.x.value > containerWidth - itemWidth) {
        runOnJS(onHandleScroll)({
          x:
            translateX.value > 0
              ? (Math.round(translateX.value / containerWidth) + 1) *
                containerWidth
              : containerWidth,
          y: 0,
          animated: true,
        });
      }
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

export default Item;
