import { View, Text, Pressable } from "react-native";
import { useTheme } from "@/lib/theme-provider";
import { MovieTheme } from "../theme";

export type SearchFilterChipOption = {
  id: number;
  label: string;
};

export type SearchFilterChipsProps = {
  title: string;
  options: SearchFilterChipOption[];
  selectedIds: number[];
  onToggle: (id: number) => void;
};

export function SearchFilterChips({
  title,
  options,
  selectedIds,
  onToggle,
}: SearchFilterChipsProps) {
  const { colors } = useTheme<MovieTheme>();

  if (options.length === 0) return null;

  return (
    <View className="mt-xs w-full">
      <Text className="text-muted-foreground text-xs font-semibold mb-xxs px-0.5">
        {title}
      </Text>
      <View className="w-full flex-row flex-wrap gap-2 py-1">
        {options.map((opt) => {
          const selected = selectedIds.includes(opt.id);
          return (
            <Pressable
              key={opt.id}
              onPress={() => onToggle(opt.id)}
              className="px-sm py-1.5 rounded-full border"
              style={{
                borderColor: selected
                  ? colors.palette.belizeHole
                  : colors.secondary,
                backgroundColor: selected ? colors.secondary : "transparent",
              }}
            >
              <Text
                className="text-sm"
                style={{
                  color: selected
                    ? colors["secondary-foreground"]
                    : colors["muted-foreground"],
                }}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
