import { Image, List } from "@/components";
import { Box, NavBar, Pill, Text, ViewMoreText } from "../components";
import { usePerson } from "../controllers";
import { useEffect, useRef } from "react";

export type PersonDetailsViewProps = {
  personId: number;
  goBack: () => void;
};

export function PersonDetailsView(props: PersonDetailsViewProps) {
  const moviesListRef = useRef();
  const { person, movies } = usePerson(props.personId);

  useEffect(() => {
    return () => {
      console.log('destroy details')
      moviesListRef.current?.scrollToOffset(0);
    };
  });

  return (
    <Box width="100%" height="100%" backgroundColor="surface">
      <NavBar onPressLeading={props.goBack} onPressTrailing={props.goBack} />
      <Box
        as="ScrollView"
        flex={1}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Box
          as="ImageBackground"
          width="100%"
          height={300}
          source={{ uri: person?.profilePath }}
        ></Box>
        <Box
          pt="sm"
          borderTopStartRadius="xl"
          borderTopEndRadius="xl"
          width="100%"
          marginTop={-30}
          backgroundColor="surface"
        >
          <Text color="onSurface" fontSize={28} fontWeight={700} px="sm">
            {person?.name}
          </Text>
          <Box flexDirection="row" pt="xs" gap="xxs" px="sm">
            <Pill icon='star'>{person?.birthday}</Pill>
            {person?.deathday && <Pill icon='cross'>{person?.deathday}</Pill>}
          </Box>
          <ViewMoreText
            color="#7f8c8d"
            fontSize={16}
            fontWeight={700}
            numberOfLines={4}
            containerStyle={{ py: "md", px: "sm" }}
          >
            {person?.biography}
          </ViewMoreText>
          <Box width={"100%"} height={250}>
            {movies.length > 0 && (
              <List
                innerRef={moviesListRef}
                horizontal
                data={movies}
                estimatedItemSize={250}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item }}
                    style={{
                      width: 150,
                      height: 250,
                      borderRadius: 16,
                    }}
                  />
                )}
                ItemSeparatorComponent={() => <Box width={8} height={8} />}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
