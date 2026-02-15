import { TextInput, TextInputProps } from "react-native";

export type InputProps = TextInputProps;

export function Input(props: InputProps) {
  return (
    <TextInput
      className="border border-input rounded-md px-xxs h-14 text-muted-foreground"
      style={{
        height: props.multiline ? 150 : 56,
        textAlignVertical: props.multiline ? "top" : "center",
      }}
      placeholderTextColor="#95a5a6"
      {...props}
    />
  );
}
