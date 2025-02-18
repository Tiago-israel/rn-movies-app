import { useRef, useState } from "react";
import { type TextInput, type TextInputProps } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Box } from "@/components";
import { useDebounce } from "@/hooks";

export type SearchFieldProps = TextInputProps & {
  onClear?: () => void;
};

export function SearchField({
  placeholder = "Type a movie",
  onChangeText,
  ...props
}: SearchFieldProps) {
  const [text, setText] = useState<string>();
  const onChangeTextDebounce = useDebounce<string>((text: string) => {
    onChangeText?.(text);
  }, 300);

  function clearText() {
    setText("");
    props.onClear?.();
  }

  return (
    <Box
      width="100%"
      height={48}
      flexDirection="row"
      backgroundColor="#fff"
      borderRadius="lg"
      alignItems="center"
    >
      <Box<TextInputProps>
        as="TextInput"
        py={0}
        px={20}
        flex={1}
        height="100%"
        color="#141414"
        placeholderTextColor="#000"
        placeholder={placeholder}
        value={text}
        onChangeText={(value) => {
          setText(value);
          onChangeTextDebounce(value);
        }}
        {...props}
      />
      {text && (
        <Box as="Pressable" pr="xs" onPress={clearText}>
          <Icon name="close-circle" size={24} />
        </Box>
      )}
    </Box>
  );
}
