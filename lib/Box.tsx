import { useContext, useMemo } from "react";
import { type ElementsMap, elementsMap, createStyleFromProps } from "./core";
import { ThemeContext } from "./theme-provider";
import type {
  SpacingProps,
  ColorProps,
  FlexProps,
  RadiusProps,
  BorderProps,
  SizeProps,
  PositionProps,
  TextProps,
} from "./types";

export type BoxProps<ComponentProps, T extends Record<string, any>> = {
  as?: ElementsMap;
  style?: any;
  innerRef?: any;
} & SpacingProps<T> &
  SizeProps<T> &
  ColorProps<T> &
  RadiusProps<T> &
  BorderProps &
  FlexProps &
  PositionProps &
  TextProps &
  ComponentProps;

export function Box<C, T extends Record<string, any> = any>({
  as = "View",
  style = {},
  innerRef,
  ...props
}: BoxProps<C, T>) {
  const theme = useContext(ThemeContext);
  const Component = (elementsMap[as] || elementsMap.View) as any;
  const memoizedStyle = useMemo(() => {
    return createStyleFromProps(props, theme);
  }, [props, theme]);

  return <Component ref={innerRef} {...props} style={[{ ...memoizedStyle }, style]} />;
}
