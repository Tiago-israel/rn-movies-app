import { createProperty } from "./create-property";
import { getTokenValue } from "./get-token-value";

export const propMap: Record<string, (token: string, theme: any) => any> = {
  w: (token: string, theme: any) => getTokenValue(token, theme["sizes"]),
  h: (token: string, theme: any) => getTokenValue(token, theme["sizes"]),
  width: (token: string, theme: any) => getTokenValue(token, theme["sizes"]),
  height: (token: string, theme: any) => getTokenValue(token, theme["sizes"]),
  color: (token: string, theme: any) => getTokenValue(token, theme["colors"]),
  backgroundColor: (token: string, theme: any) =>
    getTokenValue(token, theme["colors"]),
  borderColor: (token: string, theme: any) =>
    getTokenValue(token, theme["colors"]),
  borderBottomColor: (token: string, theme: any) =>
    getTokenValue(token, theme["colors"]),
  borderEndColor: (token: string, theme: any) =>
    getTokenValue(token, theme["colors"]),
  borderLeftColor: (token: string, theme: any) =>
    getTokenValue(token, theme["colors"]),
  borderRightColor: (token: string, theme: any) =>
    getTokenValue(token, theme["colors"]),
  borderStartColor: (token: string, theme: any) =>
    getTokenValue(token, theme["colors"]),
  borderTopColor: (token: string, theme: any) =>
    getTokenValue(token, theme["colors"]),
  borderBottomEndRadius: (token: string, theme: any) =>
    createProperty(
      getTokenValue(token, theme["radii"]),
      "borderBottomEndRadius"
    ),
  borderBottomLeftRadius: (token: string, theme: any) =>
    createProperty(
      getTokenValue(token, theme["radii"]),
      "borderBottomLeftRadius"
    ),
  borderBottomRightRadius: (token: string, theme: any) =>
    createProperty(
      getTokenValue(token, theme["radii"]),
      "borderBottomRightRadius"
    ),
  borderBottomStartRadius: (token: string, theme: any) =>
    createProperty(
      getTokenValue(token, theme["radii"]),
      "borderBottomStartRadius"
    ),
  borderStartEndRadius: (token: string, theme: any) =>
    createProperty(
      getTokenValue(token, theme["radii"]),
      "borderStartEndRadius"
    ),
  borderStartStartRadius: (token: string, theme: any) =>
    createProperty(
      getTokenValue(token, theme["radii"]),
      "borderStartStartRadius"
    ),
  borderEndEndRadius: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["radii"]), "borderEndEndRadius"),

  borderEndStartRadius: (token: string, theme: any) =>
    createProperty(
      getTokenValue(token, theme["radii"]),
      "borderEndStartRadius"
    ),
  borderBottomWidth: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["radii"]), "borderBottomWidth"),
  borderLeftWidth: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["radii"]), "borderLeftWidth"),

  borderRadius: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["radii"]), "borderRadius"),

  borderRightWidth: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["radii"]), "borderRightWidth"),

  borderTopEndRadius: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["radii"]), "borderTopEndRadius"),
  borderTopLeftRadius: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["radii"]), "borderTopLeftRadius"),

  borderTopRightRadius: (token: string, theme: any) =>
    createProperty(
      getTokenValue(token, theme["radii"]),
      "borderTopRightRadius"
    ),
  borderTopStartRadius: (token: string, theme: any) =>
    createProperty(
      getTokenValue(token, theme["radii"]),
      "borderTopStartRadius"
    ),
  borderTopWidth: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["radii"]), "borderTopWidth"),
  borderWidth: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["radii"]), "borderWidth"),
  py: (token: string, theme: any) =>
    createProperty(
      getTokenValue(token, theme["spacing"]),
      "paddingTop",
      "paddingBottom"
    ),
  px: (token: string, theme: any) =>
    createProperty(
      getTokenValue(token, theme["spacing"]),
      "paddingLeft",
      "paddingRight"
    ),
  paddingVertical: (token: string, theme: any) =>
    createProperty(
      getTokenValue(token, theme["spacing"]),
      "paddingTop",
      "paddingBottom"
    ),
  paddingHorizontal: (token: string, theme: any) =>
    createProperty(
      getTokenValue(token, theme["spacing"]),
      "paddingLeft",
      "paddingRight"
    ),
  p: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["spacing"]), "padding"),
  pt: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["spacing"]), "paddingTop"),
  pb: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["spacing"]), "paddingBottom"),
  pl: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["spacing"]), "paddingLeft"),
  pr: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["spacing"]), "paddingRight"),
  mx: (token: string, theme: any) =>
    createProperty(
      getTokenValue(token, theme["spacing"]),
      "marginLeft",
      "marginRight"
    ),
  marginVertical: (token: string, theme: any) =>
    createProperty(
      getTokenValue(token, theme["spacing"]),
      "marginTop",
      "marginBottom"
    ),
  marginHorizontal: (token: string, theme: any) =>
    createProperty(
      getTokenValue(token, theme["spacing"]),
      "marginLeft",
      "marginRight"
    ),
  m: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["spacing"]), "margin"),
  mt: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["spacing"]), "marginTop"),
  mb: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["spacing"]), "marginBottom"),
  ml: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["spacing"]), "marginLeft"),
  mr: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["spacing"]), "marginRight"),
  gap: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["spacing"]), "gap"),
  flex: (token: string, theme: any) => token,
  flexDirection: (token: string, theme: any) => token,
  flexWrap: (token: string, theme: any) => token,
  justifyContent: (token: string, theme: any) => token,
  alignItems: (token: string, theme: any) => token,
  alignContent: (token: string, theme: any) => token,

  alignSelf: (token: string, theme: any) => token,
  flexBasis: (token: string, theme: any) => token,
  flexGrow: (token: string, theme: any) => token,
  flexShrink: (token: string, theme: any) => token,
  order: (token: string, theme: any) => token,
  position: (token: string, theme: any) => token,
  top: (token: string, theme: any) => token,
  right: (token: string, theme: any) => token,
  bottom: (token: string, theme: any) => token,
  left: (token: string, theme: any) => token,
  zIndex: (token: string, theme: any) => token,
  shadow: (token: string, theme: any) => token,
  overflow: (token: string, theme: any) => token,
  display: (token: string, theme: any) => token,
  opacity: (token: string, theme: any) => token,
  cursor: (token: string, theme: any) => token,
  pointerEvents: (token: string, theme: any) => token,
  resize: (token: string, theme: any) => token,
  userSelect: (token: string, theme: any) => token,
  touchAction: (token: string, theme: any) => token,
  transition: (token: string, theme: any) => token,
  transform: (token: string, theme: any) => token,
  transformOrigin: (token: string, theme: any) => token,
  appearance: (token: string, theme: any) => token,
  backgroundAttachment: (token: string, theme: any) => token,
  backgroundClip: (token: string, theme: any) => token,
  backgroundImage: (token: string, theme: any) => token,
  backgroundPosition: (token: string, theme: any) => token,
  backgroundRepeat: (token: string, theme: any) => token,
  backgroundSize: (token: string, theme: any) => token,
  borderCollapse: (token: string, theme: any) => token,
  borderSpacing: (token: string, theme: any) => token,
  boxSizing: (token: string, theme: any) => token,
  captionSide: (token: string, theme: any) => token,
  clear: (token: string, theme: any) => token,
  clip: (token: string, theme: any) => token,
  content: (token: string, theme: any) => token,
  counterIncrement: (token: string, theme: any) => token,
  counterReset: (token: string, theme: any) => token,
  emptyCells: (token: string, theme: any) => token,
  float: (token: string, theme: any) => token,
  fontDisplay: (token: string, theme: any) => token,
  fontFamily: (token: string, theme: any) => token,
  fontFeatureSettings: (token: string, theme: any) => token,
  fontKerning: (token: string, theme: any) => token,
  fontOpticalSizing: (token: string, theme: any) => token,
  fontVariationSettings: (token: string, theme: any) => token,
  fontVariantCaps: (token: string, theme: any) => token,
  fontVariantEastAsian: (token: string, theme: any) => token,
  fontVariantLigatures: (token: string, theme: any) => token,
  fontVariantNumeric: (token: string, theme: any) => token,
  fontVariantPosition: (token: string, theme: any) => token,
  fontVariant: (token: string, theme: any) => token,
  fontSmooth: (token: string, theme: any) => token,
  fontStretch: (token: string, theme: any) => token,
  fontStyle: (token: string, theme: any) => token,
  fontSynthesis: (token: string, theme: any) => token,
  fontVariantAlternates: (token: string, theme: any) => token,
  textAlign: (token: string, theme: any) => token,
  fontSize: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["fontSize"]), "fontSize"),
  fontWeight: (token: string, theme: any) =>
    createProperty(getTokenValue(token, theme["fontWeight"]), "fontWeight"),
};
