import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export default function HandlingContinuous({ navigation }: any) {
  const pressed = useSharedValue(false);
  const startingPosition = 0;
  const x = useSharedValue(startingPosition);
  const y = useSharedValue(startingPosition);

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx: any) => {
      pressed.value = true;
      ctx.startX = x.value;
      ctx.startY = y.value;
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
      y.value = ctx.startY + event.translationY;
    },
    onEnd: (event, ctx) => {
      pressed.value = false;
      x.value = withSpring(ctx.startX + event.translationX);
      y.value = withSpring(ctx.startY + event.translationY);
    },
  });

  const uas = useAnimatedStyle(() => {
    return {
      backgroundColor: pressed.value ? '#FEEF86' : '#001972',
      transform: [
        { translateX: x.value },
        { translateY: y.value },
        { scale: withSpring(pressed.value ? 1.2 : 1) },
      ],
    };
  });

  return (
    <>
      <Button
        onPress={() => {
          navigation.goBack();
        }}
        title="Back"
      />
      <View
        style={{
          flex: 1,
          padding: 15,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <PanGestureHandler onGestureEvent={eventHandler}>
          <Animated.View style={[styles.ball, uas]} />
        </PanGestureHandler>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  ball: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
});
