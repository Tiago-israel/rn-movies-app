import { createVariant } from "@/lib";
import { Box } from "./Box";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";

export type TapStateProps = {
  variant?: "light" | "dark";
};

export type TapStateRef = {
  setPressed: (value: boolean) => void;
};

function getBackgroundVariant(
  variant: TapStateProps["variant"] = "light",
  pressed = false
) {
  return createVariant(variant, {
    light: {
      backgroundColor: pressed ? "rgba(255,255,255,0.3)" : "transparent",
    },
    dark: {
      backgroundColor: pressed ? "rgba(0,0,0,0.3)" : "transparent",
    },
  });
}

export const TapState = forwardRef((props: TapStateProps, ref) => {
  const [pressed, setPressed] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      setPressed,
    };
  });

  const variant: any = useMemo(
    () => getBackgroundVariant(props.variant, pressed),
    [props.variant, pressed]
  );

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      width={"100%"}
      height={"100%"}
      backgroundColor={variant.backgroundColor}
    />
  );
});
