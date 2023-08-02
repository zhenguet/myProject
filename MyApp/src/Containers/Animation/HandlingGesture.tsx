import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export default function HandlingGesture({ navigation }: any) {
  const pressed = useSharedValue(false);

  const uas = useAnimatedStyle(() => ({
    backgroundColor: pressed.value ? '#FEEF86' : '#001972',
    transform: [{ scale: withSpring(pressed.value ? 1.2 : 1) }],
  }));

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
        <TapGestureHandler
          onGestureEvent={useAnimatedGestureHandler({
            onStart: (event, ctx) => {
              pressed.value = true;
            },
            onEnd: (event, ctx) => {
              pressed.value = false;
            },
          })}
        >
          <Animated.View style={[styles.ball, uas]} />
        </TapGestureHandler>
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
