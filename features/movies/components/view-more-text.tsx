import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Platform,
  type NativeSyntheticEvent,
  type TextLayoutEventData,
  type ViewProps,
} from "react-native";
import { View } from "react-native";
import { Text, TextProps } from "./text";
import { MovieTheme } from "../theme";

export type ViewMoreTextProps = TextProps & {
  seeMoreText?: string;
  seeLessText?: string;
  containerStyle?: { p?: string; px?: string; py?: string; className?: string };
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

    const containerClass =
      containerStyle?.className ??
      [
        containerStyle?.p && `p-${containerStyle.p}`,
        containerStyle?.px && `px-${containerStyle.px}`,
        containerStyle?.py && `py-${containerStyle.py}`,
      ]
        .filter(Boolean)
        .join(" ");
    return (
      <View className={containerClass || undefined}>
        <Text
          {...props}
          numberOfLines={textShow ? undefined : numberOfLines}
          onTextLayout={onTextLayout}
        />
        {lengthMore ? (
          <Text
            className="text-palette-peter-river"
            onPress={toggleNumberOfLines}
          >
            {textShow ? seeLessText : seeMoreText}
          </Text>
        ) : null}
      </View>
    );
  }
);
