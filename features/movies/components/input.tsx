import { TextInputProps } from "react-native";
import { Box } from "./box";
import { useTheme } from "@/lib/theme-provider";
import { MovieTheme } from "../theme";

export type InputProps = TextInputProps;

export function Input(props: InputProps) {
  const { colors } = useTheme<MovieTheme>();
  return (
    <Box<TextInputProps>
      as="TextInput"
      borderWidth={1}
      borderColor="onSurfaceVariantBorder"
      borderRadius="md"
      px="xxs"
      height={props.multiline ? 150 : 56}
      color="onSurfaceVariant"
      placeholderTextColor={'#ccc'}
      textAlignVertical={props.multiline ? "top" : "center"}
      {...props}
    />
  );
}
