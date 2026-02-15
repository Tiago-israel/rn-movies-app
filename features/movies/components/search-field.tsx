import { useRef, useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  type TextInputProps,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
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
    <View className="w-full h-12 flex-row bg-white rounded-lg items-center">
      <TextInput
        className="flex-1 h-full px-5 text-black"
        style={{ paddingVertical: 0 }}
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
        <Pressable className="pr-xs" onPress={clearText}>
          <Icon name="close-circle" size={24} />
        </Pressable>
      )}
    </View>
  );
}
