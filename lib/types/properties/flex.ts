import type * as CSS from "csstype";
import { Token } from "../Token";
import { Theme } from "@/theme";

export type FlexProps = {
  flexDirection?: CSS.Properties["flexDirection"];
  flexWrap?: CSS.Properties["flexWrap"];
  flex?: CSS.Properties["flex"];
  flexGrow?: CSS.Properties["flexGrow"];
  flexShrink?: CSS.Properties["flexShrink"];
  flexBasis?: CSS.Properties["flexBasis"];
  justifyItems?: CSS.Properties["justifyItems"];
  justifyContent?: CSS.Properties["justifyContent"];
  justifySelf?: CSS.Properties["justifySelf"];
  alignItems?: CSS.Properties["alignItems"];
  alignContent?: CSS.Properties["alignContent"];
  alignSelf?: CSS.Properties["alignSelf"];
  gap?: Token<Theme["spacing"]> | CSS.Properties["gap"] | number;
};
