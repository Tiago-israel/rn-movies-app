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
    <View className="w-full h-12 flex-row items-center rounded-lg border border-border bg-secondary px-xs">
      <Icon
        name="magnify"
        size={22}
        color="#95a5a6"
        style={{ marginLeft: 8 }}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <TextInput
        className="flex-1 h-full pr-4 text-foreground"
        style={{ paddingVertical: 0, paddingLeft: 8 }}
        placeholderTextColor="#95a5a6"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        clearButtonMode="never"
        {...props}
      />
      {value.length > 0 ? (
        <Pressable className="pr-1" onPress={clearText} hitSlop={12}>
          <Icon name="close-circle" size={24} color="#95a5a6" />
        </Pressable>
      ) : null}
    </View>
  );
}
