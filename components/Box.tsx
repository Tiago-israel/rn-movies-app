import { BoxProps as RNBoxProps, Box as RNBox } from "@/lib";
import { Theme } from "@/theme";

export function Box<C>(props: RNBoxProps<C, Theme>) {
  return <RNBox<C, Theme> {...props} />;
}
