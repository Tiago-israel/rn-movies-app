import { ImageProps, type ImageBackgroundProps } from "react-native";
import { Box } from "./box";
import { ViewMoreText } from "./view-more-text";

export type MediaBannerDescriptionProps = {
    imageUrl?: string;
    description?: string;
};

export function MediaBannerDescription(props: MediaBannerDescriptionProps) {
    return (
        <Box
            borderColor="onSurfaceBorder"
            borderWidth={1}
            borderTopRightRadius={"xl"}
            borderTopLeftRadius="xl"
            borderBottomEndRadius="lg"
            borderBottomStartRadius="lg"
            position="relative"
        >
            <Box
                width={48}
                height={48}
                position="absolute"
                borderRadius="full"
                top={-24}
                right={48}
                backgroundColor="surface"
                alignItems="center"
                justifyContent="center"
                zIndex={999}
            >
                <Box
                    width={24}
                    height={4}
                    backgroundColor="alternates.primary"
                    borderRadius="full"
                />
            </Box>

            <Box<ImageProps>
                as="Image"
                source={{
                    uri: props.imageUrl,
                }}
                resizeMode="cover"
                resizeMethod="scale"
                
                style={{ width: "100%", height: 200, borderRadius: 32, aspectRatio: 2 }}
            />
            <ViewMoreText
                fontSize={16}
                color="onSurface"
                numberOfLines={5}
                containerStyle={{ p: "sm" }}
            >
                {props?.description}
            </ViewMoreText>
        </Box>
    )
}