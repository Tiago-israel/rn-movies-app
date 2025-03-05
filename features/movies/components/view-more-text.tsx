import { useCallback, useEffect, useRef, useState } from "react";
import type {
  NativeSyntheticEvent,
  Text as RNText,
  TextLayoutEventData,
  ViewProps,
} from "react-native";
import { Text, TextProps } from "./text";
import { Box } from "./box";
import { BoxProps } from "@/lib";
import { MovieTheme } from "../theme";

export type ViewMoreTextProps = TextProps & {
  seeMoreText?: string;
  seeLessText?: string;
  containerStyle?: BoxProps<ViewProps, MovieTheme>;
};

export function ViewMoreText({
  seeLessText = "See less",
  seeMoreText = "See more",
  containerStyle,
  numberOfLines = 4,
  ...props
}: ViewMoreTextProps) {
  const [textShow, setTextShow] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);
  const toggleNumberOfLines = () => {
    setTextShow((value) => !value);
  };

  const onTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      setLengthMore(e.nativeEvent.lines?.length >= numberOfLines);
    },
    []
  );

  useEffect(() => {
    console.log('loaded')
  },[])

  return (
    <Box {...containerStyle}>
      <Text
        {...props}
        numberOfLines={textShow ? undefined : numberOfLines}
        onTextLayout={onTextLayout}
      />
      {lengthMore ? (
        <Text color="#3498db" onPress={toggleNumberOfLines}>
          {textShow ? seeLessText : seeMoreText}
        </Text>
      ) : null}
    </Box>
  );
}
