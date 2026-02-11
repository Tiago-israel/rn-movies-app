import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Platform,
  type NativeSyntheticEvent,
  type Text as RNText,
  type TextLayoutEventData,
  type ViewProps,
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

export const ViewMoreText = forwardRef(
  (
    {
      seeLessText = "See less",
      seeMoreText = "See more",
      containerStyle,
      numberOfLines = 4,
      ...props
    }: ViewMoreTextProps,
    ref
  ) => {
    const [textShow, setTextShow] = useState(false);
    const [lengthMore, setLengthMore] = useState(false);
    const toggleNumberOfLines = () => {
      setTextShow((value) => !value);
    };

    const onTextLayout = useCallback(
      (e: NativeSyntheticEvent<TextLayoutEventData>) => {
        const result = Platform.select<boolean>({
          android: e.nativeEvent.lines?.length > numberOfLines,
          ios: e.nativeEvent.lines?.length >= numberOfLines,
        });
        setLengthMore(result || false);
      },
      [numberOfLines]
    );

    useImperativeHandle(
      ref,
      () => ({
        hideText: () => {
          setTextShow(false);
        },
      }),
      []
    );

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
);
