import {
  View,
  TextInput,
  Pressable,
  type TextInputProps,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export type SearchFieldProps = Omit<
  TextInputProps,
  "value" | "onChangeText" | "defaultValue"
> & {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
};

export function SearchField({
  placeholder = "Movies, TV shows, or people",
  value,
  onChangeText,
  onClear,
  ...props
}: SearchFieldProps) {
  function clearText() {
    onChangeText("");
    onClear?.();
  }

  return (
    <View className="w-full h-12 flex-row bg-white rounded-lg items-center">
      <Icon
        name="magnify"
        size={22}
        color="#666"
        style={{ marginLeft: 12 }}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <TextInput
        className="flex-1 h-full pr-5 text-black"
        style={{ paddingVertical: 0, paddingLeft: 8 }}
        placeholderTextColor="#000"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        clearButtonMode="never"
        {...props}
      />
      {value.length > 0 ? (
        <Pressable className="pr-xs" onPress={clearText} hitSlop={12}>
          <Icon name="close-circle" size={24} />
        </Pressable>
      ) : null}
    </View>
  );
}
