// import { Box } from "../components";
import { ReactNode } from "react";
import Icon from "@expo/vector-icons/FontAwesome6";
import { Box } from "./box";

export type HomeTitleProps = {
  icon?: {
    name: string;
    color?: string;
  };
  children?: ReactNode;
};

export function HomeTitle(props: HomeTitleProps) {
  return (
    <Box flexDirection="row" alignItems="center" gap={8} px="sm" py="xs">
      <Box as="Text" color="onSurface" fontSize={24} fontWeight={700}>
        {props.children}
      </Box>
      {props.icon && (
        <Icon name={props.icon.name} size={24} color={props.icon.color} />
      )}
    </Box>
  );
}
