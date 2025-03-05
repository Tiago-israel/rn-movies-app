import { type TextProps as RNTextProps } from "react-native";
import { MovieTheme } from "../theme";
import { BoxProps, Box } from "@/lib";

export type TextProps = BoxProps<RNTextProps, MovieTheme>;

export function Text(props: TextProps) {
  return <Box<RNTextProps, MovieTheme> as="Text" {...props} />;
}
