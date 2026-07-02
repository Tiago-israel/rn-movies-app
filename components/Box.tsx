import { BoxProps as RNBoxProps, Box as RNBox } from "@/lib";

export function Box(props: RNBoxProps<any, any>) {
  return <RNBox {...props} />;
}
