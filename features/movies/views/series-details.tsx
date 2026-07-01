
import { useRef } from "react";
import { ImageProps, type ScrollViewProps } from "react-native";
import {
    NavBar,
    Pill,
    MovieCarousel,
    Box,
    MediaGallery,
    ViewMoreText,
    Text,
    MediaBannerDescription,
} from "../components";
import { useSeriesDetails } from "../controllers";

type SeriesDetailsProps = {
    seriesId: number;
    goBack: () => void;
    onPressReview: (seriesId?: number) => void;
    onPressRecommendation: (seriesId?: number) => void;
    onPressCast: (seriesId?: number) => void;
    onShareSeries: (seriesName?: string) => void;
};

export function SeriesDetailsView(props: SeriesDetailsProps) {
    const scrollViewRef = useRef<any>(null);
    const { series } = useSeriesDetails(props.seriesId);

    console.log("--------->", series)

    return (
        <Box height={"100%"} backgroundColor="surface">
            <Box width={"100%"} position="absolute" top={0} left={0} zIndex={999} backgroundColor="components.nav-bar.container.floatColor">
                <NavBar onPressLeading={props.goBack} />
            </Box>
            <Box<ScrollViewProps>
                innerRef={scrollViewRef}
                as="ScrollView"
                contentContainerStyle={{ marginTop: 72, paddingBottom: 80 }}
            >

                <Box
                    as="ImageBackground"
                    resizeMode="cover"
                    width={"100%"}
                    height={300}
                    source={{ uri: series.backdropPath }}
                    justifyContent="flex-end"
                    overflow="hidden"
                >
                    <Text fontSize={28}
                        fontWeight={700}
                        px="sm"
                        pt="sm"
                        color="onSurface"
                        numberOfLines={2}
                        backgroundColor="#101218"
                        borderTopStartRadius="lg"
                        borderTopEndRadius="lg"
                    >{series.name}
                    </Text>
                </Box>
                <ViewMoreText
                    fontSize={16}
                    color="onSurface"
                    numberOfLines={5}
                    containerStyle={{ p: "sm" }}
                >
                    {series?.overview}
                </ViewMoreText>
            </Box>
        </Box>
    );
}