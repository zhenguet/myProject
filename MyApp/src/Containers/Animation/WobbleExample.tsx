import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Button, StyleSheet, View } from 'react-native';

export default function WobbleExample({ navigation }: any) {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View style={[styles.box, animatedStyle]} />
      </View>
      <Button
        onPress={() => {
          rotation.value = rotation.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withRepeat(withTiming(10, { duration: 100 }), 6, true),
            withTiming(0, { duration: 50 }),
          );
        }}
        title="Wobble"
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
