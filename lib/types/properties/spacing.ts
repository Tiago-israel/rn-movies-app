import type * as CSS from "csstype";
import { Token } from "../Token";

type SpaceTheme = {
  spacing: Record<string, string>;
};

export type SpacingProps<Theme extends SpaceTheme["spacing"]> = {
  p?: Token<Theme["spacing"]> | CSS.Properties["padding"] | number;
  pt?: Token<Theme["spacing"]> | CSS.Properties["paddingTop"] | number;
  pr?: Token<Theme["spacing"]> | CSS.Properties["paddingRight"] | number;
  pb?: Token<Theme["spacing"]> | CSS.Properties["paddingBottom"] | number;
  pl?: Token<Theme["spacing"]> | CSS.Properties["paddingLeft"] | number;
  px?: Token<Theme["spacing"]> | CSS.Properties["padding"] | number;
  py?: Token<Theme["spacing"]> | CSS.Properties["padding"] | number;
  padding?: Token<Theme["spacing"]> | CSS.Properties["padding"] | number;
  paddingHorizontal?: Token<Theme["spacing"]> | CSS.Properties["padding"] | number;
  paddingVertical?: Token<Theme["spacing"]> | CSS.Properties["padding"] | number;
  paddingTop?: Token<Theme["spacing"]> | CSS.Properties["paddingTop"] | number;
  paddingBottom?: Token<Theme["spacing"]> | CSS.Properties["paddingBottom"] | number;
  paddingLeft?: Token<Theme["spacing"]> | CSS.Properties["paddingLeft"] | number;
  paddingRight?: Token<Theme["spacing"]> | CSS.Properties["paddingRight"] | number;
  m?: Token<Theme["spacing"]> | CSS.Properties["margin"] | number;
  mt?: Token<Theme["spacing"]> | CSS.Properties["marginTop"] | number;
  mr?: Token<Theme["spacing"]> | CSS.Properties["marginRight"] | number;
  mb?: Token<Theme["spacing"]> | CSS.Properties["marginBottom"] | number;
  ml?: Token<Theme["spacing"]> | CSS.Properties["marginLeft"] | number;
  margin?: Token<Theme["spacing"]> | CSS.Properties["margin"] | number;
  marginHorizontal?: Token<Theme["spacing"]> | CSS.Properties["margin"] | number;
  marginVertical?: Token<Theme["spacing"]> | CSS.Properties["margin"] | number;
  marginRight?: Token<Theme["spacing"]> | CSS.Properties["marginRight"] | number;
  marginLeft?: Token<Theme["spacing"]> | CSS.Properties["marginLeft"] | number;
  marginTop?: Token<Theme["spacing"]> | CSS.Properties["marginTop"] | number;
  marginBottom?: Token<Theme["spacing"]> | CSS.Properties["marginBottom"] | number;
};
