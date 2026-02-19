import { memo, useCallback, useEffect, useRef } from "react";
import { View, Pressable, Animated, Easing, Text } from "react-native";
import * as Haptics from "expo-haptics";
import { ListRenderItemInfo } from "@shopify/flash-list";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Image, List } from "@/components";

export type CastMember = {
  id: number;
  name: string;
  character: string;
  profilePath: string;
};

export type CastListProps = {
  cast: CastMember[];
  onPressCast?: (castId: number) => void;
};

type CastItemProps = {
  item: CastMember;
  index: number;
  onPress?: (castId: number) => void;
};

const CastItem = memo(({ item, index, onPress }: CastItemProps) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered slide-in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80, // Stagger delay
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Pulse animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress?.(item.id);
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        className="flex-row items-center border-2 border-border p-2 rounded-lg bg-card mb-3"
        style={{
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          opacity: opacityAnim,
        }}
      >
        <View className="w-12 h-12 rounded-full overflow-hidden border-2 border-palette-wet-asphalt bg-white">
          <Image
            source={{ uri: item.profilePath }}
            style={{ width: 48, height: 48 }}
            contentFit="cover"
          />
        </View>
        <View className="flex-1 ml-3">
          <Text
            className="text-foreground font-bold text-base"
          >
            {item.name}
          </Text>
          <Text className="text-muted-foreground text-sm">
            {item.character}
          </Text>
        </View>
        <Icon name="chevron-right" size={24} color="white" />
      </Animated.View>
    </Pressable>
  );
});

export function CastList({ cast, onPressCast }: CastListProps) {

  const renderItem = useCallback(({ item, index }: ListRenderItemInfo<CastMember>) => (
    <CastItem
      key={item.id}
      item={item}
      index={index}
      onPress={onPressCast}
    />
  ), [onPressCast]);

  return (
    <List
      data={cast}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
    />
  );
}
