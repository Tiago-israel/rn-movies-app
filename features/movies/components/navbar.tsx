import { ReactNode } from "react";
import { Box } from "./box";
import { IconButton } from "./Icon-button";
// import { Box, IconButton } from "../components";

const NAVBAR_HEIGHT = 72;

export type NavBarProps = {
  title?: string;
  hideButtons?: boolean;
  leadingIcon?: {
    name: any;
    color?: string;
    children?: ReactNode;
  };
  trainlingIcon?: {
    name: any;
    color?: string;
    children?: ReactNode;
    onPress?: () => void;
  }[];
  onPressLeading?: () => void | Promise<void>;
  onPressTrailing?: () => void | Promise<void>;
};

export function NavBar({
  leadingIcon = {
    name: "arrow-left",
  },
  trainlingIcon = [
    {
      name: "close",
    },
  ],
  ...props
}: NavBarProps) {
  return (
    <Box
      width="100%"
      height={NAVBAR_HEIGHT}
      flexDirection="row"
      alignItems="center"
      justifyContent={props.hideButtons ? "center" : "space-between"}
      px={"sm"}
      borderBottomColor="onSurfaceBorder"
      borderBottomWidth={1}
    >
      {!props.hideButtons && leadingIcon && (
        <IconButton
          icon={leadingIcon.name}
          onPress={props.onPressLeading}
          children={leadingIcon.children}
        />
      )}
      {props.title && (
        <Box as="Text" fontSize={20} color="onSurface">
          {props.title}
        </Box>
      )}
      <Box flexDirection="row" gap="xs">
        {!props.hideButtons && trainlingIcon &&
          trainlingIcon.map((item, index) => (
            <IconButton
              key={index}
              icon={item.name}
              color={item.color}
              children={item.children}
              onPress={item.onPress || props.onPressTrailing}
            />
          ))}
      </Box>
    </Box>
  );
}

NavBar.Height = NAVBAR_HEIGHT;