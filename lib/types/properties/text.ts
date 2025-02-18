import type * as CSS from "csstype";

export type TextProps = {
  fontFamily?: CSS.Properties["fontFamily"];
  fontFeatureSettings?: CSS.Properties["fontFeatureSettings"];
  fontKerning?: CSS.Properties["fontKerning"];
  fontOpticalSizing?: CSS.Properties["fontOpticalSizing"];
  fontVariationSettings?: CSS.Properties["fontVariationSettings"];
  fontVariantCaps?: CSS.Properties["fontVariantCaps"];
  fontVariantEastAsian?: CSS.Properties["fontVariantEastAsian"];
  fontVariantLigatures?: CSS.Properties["fontVariantLigatures"];
  fontVariantNumeric?: CSS.Properties["fontVariantNumeric"];
  fontVariantPosition?: CSS.Properties["fontVariantPosition"];
  fontVariant?: CSS.Properties["fontVariant"];
  fontSmooth?: CSS.Properties["fontSmooth"];
  fontStretch?: CSS.Properties["fontStretch"];
  fontStyle?: CSS.Properties["fontStyle"];
  fontSynthesis?: CSS.Properties["fontSynthesis"];
  fontVariantAlternates?: CSS.Properties["fontVariantAlternates"];
  textAlign?: CSS.Properties["textAlign"];
  fontSize?: CSS.Properties["fontSize"] | number;
  fontWeight?: CSS.Properties["fontWeight"];
};
