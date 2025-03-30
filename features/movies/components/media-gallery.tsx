import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, useAnimatedValue, useWindowDimensions } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { type ListRenderItemInfo } from "@shopify/flash-list";
import { Image, Box, List } from "@/components";

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
  const imageRef = useRef();
  const { width } = useWindowDimensions();
  const [selectedImage, setSelectedImage] = useState<string>();
  const { imageOpacity, videoOpacity, animateTransition } =
    useAnimatedGallery();

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<string>) => {
      function onPress() {
        setSelectedImage(item);
        animateTransition(true);
      }
      return (
        <Box as="Pressable" width={100} height={70} onPress={onPress}>
          <Image source={{ uri: item }} style={{ width: 100, height: 70 }} />
        </Box>
      );
    },
    [animateTransition]
  );

  const videoPlayButton = useCallback(() => {
    return (
      <Box
        as="ImageBackground"
        width={100}
        height={70}
        source={{ uri: props.images[0] }}
        opacity={0.5}
      >
        <Box
          as="Pressable"
          width={"100%"}
          height={"100%"}
          alignItems="center"
          justifyContent="center"
          onPress={() => {
            animateTransition(false);
          }}
        >
          <Icon name="play" size={24} color={"#fff"} />
        </Box>
      </Box>
    );
  }, [props.images]);

  useEffect(() => {
    setSelectedImage(props.images[0]);
    if (!props.videoKey) {
      animateTransition(true);
    }
  }, [props.images]);

  return (
    <Box width="100%" height={330} flexDirection="column">
      <Box width={"100%"} height={247}>
        <Box
          as="AnimatedView"
          position="absolute"
          bottom={0}
          left={0}
          style={[{ opacity: imageOpacity }]}
        >
          <Image
            ref={imageRef}
            source={{ uri: selectedImage }}
            style={{ width: width, height: 247, marginBottom: 2 }}
          />
        </Box>
        {props.videoKey && (
          <Box
            as="AnimatedView"
            position="absolute"
            bottom={-50}
            left={0}
            backgroundColor="#000"
            style={[{ opacity: videoOpacity }]}
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
          </Box>
        )}
      </Box>
      <List
        horizontal
        estimatedItemSize={70}
        estimatedListSize={{ width, height: 70 }}
        data={props.images}
        keyExtractor={(item) => `${item}`}
        ListHeaderComponent={props.videoKey ? videoPlayButton : undefined}
        ItemSeparatorComponent={() => <Box width={2} height={2} />}
        renderItem={renderItem}
      />
    </Box>
  );
}
