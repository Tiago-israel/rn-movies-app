import { Token } from "../Token";

type RadiiTheme = {
  radii: Record<string, any>;
};

export type RadiusProps<Theme extends RadiiTheme["radii"]> = {
  borderBottomEndRadius?: Token<Theme["radii"]>;
  borderBottomLeftRadius?: Token<Theme["radii"]>;
  borderBottomRightRadius?: Token<Theme["radii"]>;
  borderBottomStartRadius?: Token<Theme["radii"]>;
  borderRadius?: Token<Theme["radii"]>;
  borderTopEndRadius?: Token<Theme["radii"]>;
  borderTopLeftRadius?: Token<Theme["radii"]>;
  borderTopRightRadius?: Token<Theme["radii"]>;
  borderTopStartRadius?: Token<Theme["radii"]>;
};
