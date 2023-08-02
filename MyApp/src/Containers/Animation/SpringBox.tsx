import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  Easing,
  withTiming,
} from 'react-native-reanimated';
import { Button, StyleSheet, View } from 'react-native';

export default function SpringBox({ navigation }: any) {
  const springOffset = useSharedValue(0);
  const timingOffset = useSharedValue(0);

  const springAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(springOffset.value * 255, {}, finished => {
            if (finished) {
              console.log('ANIMATION ENDED');
            } else {
              console.log('ANIMATION GOT CANCELLED');
            }
          }),
        },
      ],
    };
  });

  const customSpringStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(springOffset.value * 255, {
            damping: 20,
            stiffness: 90,
          }),
        },
      ],
    };
  });

  const timingAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: timingOffset.value * 255,
        },
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
      <View style={{ flex: 1 }}>
        <Animated.View style={[styles.box, springAnimatedStyles]} />

        <Animated.View style={[styles.box, customSpringStyles]} />

        <Animated.View style={[styles.box, timingAnimatedStyles]} />
      </View>
      <Button
        onPress={() => {
          const offset = Math.random();
          springOffset.value = offset;
          // springOffset.value = withSpring(offset, {}, (finished) => {
          //   if (finished) {
          //     console.log("ANIMATION ENDED");
          //   } else {
          //     console.log("ANIMATION GOT CANCELLED");
          //   }
          // });

          timingOffset.value = withTiming(offset, {
            duration: 500,
            easing: Easing.out(Easing.exp),
          });
        }}
        title="Move"
      />
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#1F5A99',
    borderRadius: 20,
    height: 100,
    width: 100,
    margin: 15,
  },
});
