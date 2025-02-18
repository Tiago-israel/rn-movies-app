import { BoxProps as RNBoxProps, Box as RNBox } from "@/lib";
import { MovieTheme } from "../theme";

export function Box<C>(props: RNBoxProps<C, MovieTheme>) {
  return <RNBox<C, MovieTheme> {...props} />;
}
