import React from 'react';
import { Dimensions, Pressable } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  itemPerPage,
  itemPerRow,
  marginLeft,
  marginTop,
  rowPerPage,
  styles,
} from './Eup';
import { useLayout } from './Layout';
const { width, height } = Dimensions.get('window');

const containerWidth = width * 0.75;
const INNER_MARGIN = 10;

const itemWidth = containerWidth / 3 - INNER_MARGIN;

const Item = ({ item, ready, offsets, index, scrollRef, translateX }: any) => {
  // phần tử hiện tại
  const offset = offsets[index];
  const pageQty = Math.floor(offsets.length / itemPerPage);

  const { calIndex, move, setPosition } = useLayout({
    itemPerRow,
    rowPerPage,
    marginLeft,
    marginTop,
    pageWidth: containerWidth,
  });
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

  const onEdgeTs = useSharedValue<number>(0);
  const onHandleScroll = (x: number) => {
    scrollRef.current.scrollTo({ x, animated: true });
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
      let offsetX =
        e.translationX +
        start.value.x +
        (offset.page.value - offset.originalPage.value) * containerWidth;

      offset.y.value = e.translationY + start.value.y;
      if (offsetX < containerWidth * offset.page.value - itemWidth / 4) {
        const now = new Date().getTime();
        if (!onEdgeTs.value) onEdgeTs.value = new Date().getTime();
        else if (now - onEdgeTs.value >= 1000) {
          onEdgeTs.value = 0;
          const pageIndex = Math.round(translateX.value / containerWidth) - 1;
          console.log('down', offsetX, pageIndex);
          if (pageIndex < 0 || pageIndex > pageQty) return;
          if (pageIndex != offset.page.value) {
            offset.page.value = pageIndex;
            offsetX -= containerWidth;
            const x = pageIndex * containerWidth;
            runOnJS(onHandleScroll)(x);
          }
        }
      } else if (
        offsetX >
        containerWidth * (offset.page.value + 1) - (itemWidth * 3) / 4
      ) {
        const now = new Date().getTime();
        if (!onEdgeTs.value) onEdgeTs.value = new Date().getTime();
        else if (now - onEdgeTs.value >= 1000) {
          onEdgeTs.value = 0;
          const pageIndex = Math.round(translateX.value / containerWidth) + 1;
          console.log('up', offsetX, pageIndex);
          if (pageIndex < 0 || pageIndex > pageQty) return;
          if (pageIndex != offset.page.value) {
            offset.page.value = pageIndex;
            offsetX += containerWidth;
            const x = pageIndex * containerWidth;
            runOnJS(onHandleScroll)(x);
          }
        }
      } else {
        onEdgeTs.value = 0;
      }
      offset.x.value = offsetX;

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
          />
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

export default Item;
