import type * as CSS from "csstype";

export type BorderProps = {
  borderWidth?: CSS.Property.BorderWidth | number;
  borderRightWidth?: CSS.Property.BorderRightWidth | number;
  borderBottomWidth?: CSS.Property.BorderBottomWidth | number;
  borderLeftWidth?: CSS.Property.BorderLeftWidth | number;
};
