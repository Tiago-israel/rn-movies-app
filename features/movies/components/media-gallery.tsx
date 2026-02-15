import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  useAnimatedValue,
  useWindowDimensions,
  View,
  Pressable,
  ImageBackground,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { type ListRenderItemInfo } from "@shopify/flash-list";
import { Image, List } from "@/components";

export type ImageGalleryProps = {
  images: string[];
  videoKey?: string;
};

function useAnimatedGallery() {
  const videoOpacity = useAnimatedValue(1);
  const imageOpacity = useAnimatedValue(0);

  const animateTransition = useCallback(
    (hideVideo: boolean) => {
      Animated.parallel([
        Animated.timing(videoOpacity, {
          toValue: hideVideo ? 0 : 1,
          useNativeDriver: true,
          duration: 300,
        }),
        Animated.timing(imageOpacity, {
          toValue: hideVideo ? 1 : 0,
          useNativeDriver: true,
          duration: 300,
        }),
      ]).start();
    },
    [videoOpacity, imageOpacity]
  );

  return { videoOpacity, imageOpacity, animateTransition };
}

export function MediaGallery(props: ImageGalleryProps) {
  const imageRef = useRef<any>(null);
  const { width } = useWindowDimensions();
  const [selectedImage, setSelectedImage] = useState<string>();
  const { imageOpacity, videoOpacity, animateTransition } =
    useAnimatedGallery();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<string>) => {
      function onPress() {
        setSelectedImage(item);
        animateTransition(true);
      }
      return (
        <Pressable
          className="w-[100] h-[70]"
          onPress={onPress}
        >
          <Image
            source={{ uri: item }}
            style={{ width: 100, height: 70 }}
            transition={{ duration: 300, timing: "ease-out" }}
          />
        </Pressable>
      );
    },
    [animateTransition]
  );

  const videoPlayButton = useCallback(() => (
    <ImageBackground
      source={{ uri: props.images[0] }}
      style={{ width: 100, height: 70, opacity: 0.5 }}
    >
      <Pressable
        className="w-full h-full items-center justify-center"
        onPress={() => animateTransition(false)}
      >
        <Icon name="play" size={24} color="#fff" />
      </Pressable>
    </ImageBackground>
  ), [props.images, animateTransition]);

  useEffect(() => {
    setSelectedImage(props.images[0]);
    if (!props.videoKey) {
      animateTransition(true);
    }
  }, [props.images]);

  return (
    <View className="w-full h-[330] flex-col">
      <View className="w-full h-[247]">
        <Animated.View
          className="absolute bottom-0 left-0"
          style={[{ opacity: imageOpacity }]}
        >
          <Image
            ref={imageRef}
            source={{ uri: selectedImage }}
            style={{ width, height: 247, marginBottom: 2 }}
          />
        </Animated.View>
        {props.videoKey && (
          <Animated.View
            className="absolute left-0 bg-black"
            style={[
              { opacity: videoOpacity },
              { bottom: -50 },
            ]}
          >
            <YoutubePlayer
              forceAndroidAutoplay={false}
              height={300}
              videoId={props.videoKey}
              width={width}
              initialPlayerParams={{
                controls: false,
              }}
            />
          </Animated.View>
        )}
      </View>
      <List
        horizontal
        estimatedItemSize={70}
        data={props.images}
        keyExtractor={(item) => `${item}`}
        ListHeaderComponent={props.videoKey ? videoPlayButton : undefined}
        ItemSeparatorComponent={() => <View className="w-0.5 h-0.5" />}
        renderItem={renderItem}
      />
    </View>
  );
}
