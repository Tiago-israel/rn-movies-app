import { BoxProps as RNBoxProps, Box as RNBox } from "@/lib";

export function Box<C>(props: RNBoxProps<C, any>) {
  return <RNBox<C, any> {...props} />;
}
