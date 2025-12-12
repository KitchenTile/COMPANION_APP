import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  withDelay,
} from "react-native-reanimated";

const Dot = ({ delay }: { delay: number }) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(withTiming(0.8, { duration: 400 }), -1, true)
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: 0.7 + opacity.value * 0.3 }],
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const TypingIndicator = () => {
  return (
    <View style={styles.container}>
      <Dot delay={0} />
      <Dot delay={200} />
      <Dot delay={400} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#b9b8b8ff",
  },
});

export default TypingIndicator;
