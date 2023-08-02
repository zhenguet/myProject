import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Button, StyleSheet, View } from 'react-native';

export default function TimingBox({ navigation }: any) {
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: offset.value * 255,
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
        <Animated.View style={[styles.box, animatedStyles]} />
      </View>
      <Button
        onPress={() => {
          offset.value = withTiming(Math.random(), {
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
