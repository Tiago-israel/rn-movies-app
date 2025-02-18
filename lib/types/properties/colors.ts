import { Token } from "../Token";

type ColorTheme = {
  colors: Record<string, any>;
};

export type ColorProps<Theme extends ColorTheme["colors"]> = {
  color?: Token<Theme["colors"]> | (string & {});
  backgroundColor?: Token<Theme["colors"]> | (string & {});
  borderColor?: Token<Theme["colors"]> | (string & {});
  borderRightColor?: Token<Theme["colors"]> | (string & {});
  borderBottomColor?: Token<Theme["colors"]> | (string & {});
  borderLeftColor?: Token<Theme["colors"]> | (string & {});
  borderTopColor?: Token<Theme["colors"]> | (string & {});
  borderStartColor?: Token<Theme["colors"]> | (string & {});
  borderEndColor?: Token<Theme["colors"]> | (string & {});
};
