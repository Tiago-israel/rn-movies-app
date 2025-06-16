import {
  Image as ExpoImage,
  type ImageProps,
} from "expo-image";
import { forwardRef } from "react";

export const Image = forwardRef((props: ImageProps, ref: any) => {
  return (
    <ExpoImage
      ref={ref}
      {...props}
    />
  );
});
