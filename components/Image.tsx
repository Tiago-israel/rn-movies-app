import {
  Image as ExpoImage,
  type ImageProps,
  type ImageRef,
  type ImageNativeProps,
} from "expo-image";
import { forwardRef } from "react";

export const Image = forwardRef((props: ImageProps, ref: any) => {
  return (
    <ExpoImage
      ref={ref}
      transition={{ duration: 300, timing: "ease-out" }}
      allowDownscaling
      {...props}
    />
  );
});
