import { useTheme } from "@/lib/theme-provider";
import { View } from "react-native";
import { Header, TabsGroup } from "../components";
import { HomeMoviesView } from "./home-movies";
import { HomeSeriesView } from "./home-series";
import { MovieTheme } from "../theme";
import { useWindowDimensions } from "react-native";
import { useMemo, useState } from "react";
import { ServiceType } from "../interfaces";

export type HomeProps = {
  navigateToMovieDetails: (movieId: number) => void;
  navigateToSeriesDetails: (seriesId: number) => void;
  navigateToViewMore: (type: ServiceType, title: string) => void;
};

const components = new Map<
  number,
  (props: HomeProps) => React.ReactElement
>();
components.set(0, (props) => <HomeMoviesView {...props} />);
components.set(1, (props) => <HomeSeriesView {...props} />);

export function HomeView(props: HomeProps) {
  const [componentIndex, setComponentIndex] = useState(0);
  const { height } = useWindowDimensions();
  const theme = useTheme<MovieTheme>();
  const containerHeight = useMemo(
    () => height - theme.spacing.xxs * 2 - Header.HEIGHT,
    [height, theme.spacing.xxs]
  );
  const CurrentComponent = useMemo(
    () => components.get(componentIndex),
    [componentIndex]
  );

  return (
    <View className="w-full h-full bg-background">
      {/* <Header /> */}
      <View className="items-center py-xxs">
        <TabsGroup
          selectedIndex={componentIndex}
          items={[{ title: "Movies" }, { title: "Series" }]}
          onPress={(index) => {
            setComponentIndex(index);
          }}
        />
      </View>
      <View className="w-full" style={{ height: containerHeight }}>
        <View
          className="w-full z-[999] absolute top-0 overflow-hidden"
          style={{ height: containerHeight }}
        >
          {CurrentComponent && <CurrentComponent
            navigateToMovieDetails={props.navigateToMovieDetails}
            navigateToSeriesDetails={props.navigateToSeriesDetails}
            navigateToViewMore={props.navigateToViewMore}
          />}
        </View>
      </View>
    </View>
  );
}
