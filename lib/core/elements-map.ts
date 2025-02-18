import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
  ImageBackground,
  SafeAreaView,
  Animated,
} from "react-native";

export const elementsMap = {
  Pressable,
  FlatList,
  ScrollView,
  TextInput,
  Text,
  View,
  Image,
  ImageBackground,
  SafeAreaView,
  AnimatedView: Animated.View,
};

export type ElementsMap = keyof typeof elementsMap;
