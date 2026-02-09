import { useState } from "react";
import { FlatList, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@/lib/theme-provider";

export type SelectButtonOption<T = string | number> = {
  value: T;
  label: string;
};

type SelectButtonProps<T = string | number> = {
  options: SelectButtonOption<T>[];
  value: T;
  onSelect: (value: T) => void;
};

type ThemeColors = {
  primary?: string;
  onPrimary?: string;
  surfaceVariant?: string;
  onSurfaceVariant?: string;
};

export function SelectButton<T = string | number>({
  options,
  value,
  onSelect,
}: SelectButtonProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [triggerHeight, setTriggerHeight] = useState(0);
  const theme = useTheme<{ colors?: ThemeColors }>();
  const colors = theme?.colors ?? {};
  const primary = colors.primary ?? "#6750a4";
  const onPrimary = colors.onPrimary ?? "#fff";
  const surfaceVariant = colors.surfaceVariant ?? "#e7e0ec";
  const onSurfaceVariant = colors.onSurfaceVariant ?? "#49454f";

  const selectedOption = options.find((opt) => opt.value === value);
  const label = selectedOption?.label ?? (options[0]?.label ?? "");

  const handleSelect = (optionValue: T) => {
    onSelect(optionValue);
    setIsOpen(false);
  };

  const onTriggerLayout = (e: LayoutChangeEvent) => {
    setTriggerHeight(e.nativeEvent.layout.height);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        onLayout={onTriggerLayout}
        onPress={() => setIsOpen((prev) => !prev)}
        style={[styles.trigger, { backgroundColor: primary }]}
      >
        <Text style={[styles.triggerText, { color: onPrimary }]}>{label}</Text>
        <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={18} color={onPrimary} />
      </Pressable>
      {isOpen && (
        <View
          style={[
            styles.menu,
            {
              backgroundColor: surfaceVariant,
              top: (triggerHeight || 36) + 4,
            },
          ]}
        >
          <FlatList
            data={options}
            renderItem={({ item }) => {
              const isSelected = value === item.value;
              return (
                <Pressable
                key={String(item.value)}
                onPress={() => handleSelect(item.value)}
                style={[
                  styles.option,
                  { backgroundColor: isSelected ? primary : surfaceVariant },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: isSelected ? onPrimary : onSurfaceVariant, fontWeight: isSelected ? "600" : "400" },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
              );
            }}
          />
          {/* {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <Pressable
                key={String(option.value)}
                onPress={() => handleSelect(option.value)}
                style={[
                  styles.option,
                  { backgroundColor: isSelected ? primary : surfaceVariant },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: isSelected ? onPrimary : onSurfaceVariant, fontWeight: isSelected ? "600" : "400" },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })} */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "flex-start",
    position: "relative",
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  triggerText: {
    fontSize: 14,
    fontWeight: "600",
  },
  menu: {
    position: "absolute",
    left: 0,
    minWidth: 120,
    borderRadius: 12,
    overflow: "hidden",
    zIndex: 1000,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 14,
  },
});
