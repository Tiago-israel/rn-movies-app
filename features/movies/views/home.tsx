import { useTheme } from "@/lib/theme-provider";
import { Box, Header, TabsGroup } from "../components";
import { HomeMoviesView } from "./home-movies";
import { HomeSeriesView } from "./home-series";
import { MovieTheme } from "../theme";
import { useWindowDimensions } from "react-native";
import { useMemo, useState } from "react";
import { ServiceType } from "../interfaces";
export type HomeProps = {
  navigateToMovieDetails: (movieId: number) => void;
  navigateToViewMore: (type: ServiceType, title: string) => void;
};

const components = new Map();
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
    <Box width={"100%"} height="100%" backgroundColor="surface">
      <Header />
      <Box alignItems="center" py={theme.spacing.xxs}>
        <TabsGroup
          selectedIndex={componentIndex}
          items={[{ title: "Movies" }, { title: "Series" }]}
          onPress={(index) => {
            setComponentIndex(index);
          }}
        />
      </Box>
      <Box width="100%" height={containerHeight}>
        <Box
          width="100%"
          height={containerHeight}
          Index={999}
          style={{
            position: "absolute",
            top: 0,
            overflow: "hidden",
          }}
        >
          <CurrentComponent
            navigateToMovieDetails={props.navigateToMovieDetails}
            navigateToViewMore={props.navigateToViewMore}
          />
        </Box>
      </Box>
    </Box>
  );
}
