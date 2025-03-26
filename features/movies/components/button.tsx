import { PressableProps } from "react-native";
import { Box } from "./box";
import { Text } from "./text";
import { createVariant } from "@/lib";
import { useMemo } from "react";

export type ButtonProps = {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
} & PressableProps;

function buttonVariant(variant: ButtonProps["variant"] = "primary"): any {
  return createVariant(variant, {
    primary: {
      color: "components.button.primary.color",
      backgroundColor: "components.button.primary.backgroundColor",
    },
    secondary: {
      color: "components.button.secondary.color",
      backgroundColor: "components.button.secondary.backgroundColor",
    },
  });
}

export function Button({ fullWidth = true, ...props }: ButtonProps) {
  const variant = useMemo(() => buttonVariant(props.variant), [props.variant]);

  return (
    <Box<PressableProps>
      as="Pressable"
      alignItems="center"
      justifyContent="center"
      borderRadius="lg"
      width={fullWidth ? "100%" : 56}
      height={48}
      backgroundColor={
        props.disabled
          ? "components.button.disabled.backgroundColor"
          : variant.backgroundColor
      }
      {...props}
    >
      {typeof props.children === "string" ? (
        <Text
          color={
            props.disabled ? "components.button.disabled.color" : variant.color
          }
          fontSize={14}
          fontWeight={700}
        >
          {props.children}
        </Text>
      ) : (
        props.children
      )}
    </Box>
  );
}
