import { ReactNode, useMemo, useRef } from "react";
import { Box } from "@/components/Box";
import { TapState, TapStateProps, TapStateRef } from "@/components/TapState";
import { createVariant } from "@/lib";

export type ButtonProps = {
  variant: "primary" | "secondary";
  children: ReactNode;
};

function buttonVariants(variant: ButtonProps["variant"]) {
  return createVariant(variant, {
    primary: {
      color: "black",
      backgroundColor: "white",
      borderColor: "white",
      borderWidth: 1,
      borderRadius: 24,
    },
    secondary: {
      color: "white",
      backgroundColor: "transparent",
      borderColor: "white",
      borderWidth: 1,
      borderRadius: 24,
    },
  });
}

function getTapStateVariant(
  variant: ButtonProps["variant"]
): Pick<TapStateProps, "variant"> {
  return createVariant<ButtonProps["variant"], Pick<TapStateProps, "variant">>(
    variant,
    {
      primary: {
        variant: "dark",
      },
      secondary: {
        variant: "light",
      },
    }
  );
}

export function Button(props: ButtonProps) {
  const tapStateRef = useRef<TapStateRef>();
  const buttonStyle = useMemo(
    () => buttonVariants(props.variant),
    [props.variant]
  );
  const tapStateVariant = getTapStateVariant(props.variant);
  return (
    <Box
      as="Pressable"
      alignItems="center"
      justifyContent="center"
      flex={1}
      height={48}
      overflow="hidden"
      onPressIn={() => tapStateRef.current?.setPressed(true)}
      onPressOut={() => tapStateRef.current?.setPressed(false)}
      {...buttonStyle}
    >
      <TapState ref={tapStateRef} variant={tapStateVariant.variant} />
      {typeof props.children === "string" ? (
        <Box as="Text" fontSize={16} color={buttonStyle?.color}>
          {props.children}
        </Box>
      ) : (
        props.children
      )}
    </Box>
  );
}
