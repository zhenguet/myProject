import React from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const images = new Array(6).fill(
  'https://images.unsplash.com/photo-1556740749-887f6717d7e4',
);

const ScrollView = () => {
  const translateX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: event => {
        translateX.value = event.contentOffset.x;
      },
      onBeginDrag: () => {},
      onEndDrag: () => {},
    },
    [],
  );

  const { width: windowWidth } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollContainer}>
        <Animated.ScrollView
          onScroll={scrollHandler}
          pagingEnabled
          scrollEventThrottle={16}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {images.map((image, imageIndex) => {
            return (
              <View
                style={{ width: windowWidth, height: 250 }}
                key={imageIndex}
              >
                <ImageBackground source={{ uri: image }} style={styles.card}>
                  <View style={styles.textContainer}>
                    <Text style={styles.infoText}>
                      {'Image - ' + imageIndex}
                    </Text>
                  </View>
                </ImageBackground>
              </View>
            );
          })}
        </Animated.ScrollView>
        <View style={styles.indicatorContainer}>
          {images.map((image, imageIndex) => {
            return (
              <Item
                key={`${image}_${imageIndex}`}
                translateX={translateX}
                inputRange={[
                  windowWidth * (imageIndex - 1),
                  windowWidth * imageIndex,
                  windowWidth * (imageIndex + 1),
                ]}
              />
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const Item = (props: any) => {
  const { translateX, inputRange } = props;

  const style = useAnimatedStyle(() => {
    return {
      width: interpolate(
        translateX.value,
        inputRange,
        [8, 16, 8],
        Extrapolate.CLAMP,
      ),
      transform: [
        {
          scale: interpolate(
            translateX.value,
            inputRange,
            [1, 1.2, 1],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  return <Animated.View style={[styles.normalDot, style]} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    backgroundColor: 'rgba(0,0,0, 0.7)',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 5,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'silver',
    marginHorizontal: 4,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ScrollView;
