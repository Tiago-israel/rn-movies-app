import type * as CSS from "csstype";
import { Token } from "../Token";

type SizeTheme = {
  size: Record<string, string>;
};

export type SizeProps<Theme extends SizeTheme["size"]> = {
  w?: Token<Theme["size"]> | CSS.Property.Width | number;
  h?: Token<Theme["size"]> | CSS.Property.Height;
  width?: Token<Theme["size"]> | CSS.Property.Width | number;
  height?: Token<Theme["size"]> | CSS.Property.Height | number;
  maxWidth?: Token<Theme["size"]> | CSS.Property.MaxWidth;
  maxHeight?: Token<Theme["size"]> | CSS.Property.MaxHeight;
  minWidth?: Token<Theme["size"]> | CSS.Property.MinWidth;
  minHeight?: Token<Theme["size"]> | CSS.Property.MinHeight;
};
