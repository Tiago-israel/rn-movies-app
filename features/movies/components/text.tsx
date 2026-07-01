import { Text as RNText, TextProps as RNTextProps } from "react-native";

const fontSizeMap: Record<number, string> = {
  12: "text-xs",
  14: "text-sm",
  16: "text-base",
  18: "text-lg",
  20: "text-xl",
  24: "text-2xl",
  28: "text-3xl",
};

const fontWeightMap: Record<number, string> = {
  400: "font-normal",
  500: "font-medium",
  600: "font-semibold",
  700: "font-bold",
};

const themeColorMap: Record<string, string> = {
  foreground: "text-foreground",
  "primary-foreground": "text-primary-foreground",
  "secondary-foreground": "text-secondary-foreground",
  "card-foreground": "text-card-foreground",
  "muted-foreground": "text-muted-foreground",
};

export type TextProps = RNTextProps & {
  color?: string;
  fontSize?: number;
  fontWeight?: number;
};

export function Text({
  color,
  fontSize,
  fontWeight,
  className = "",
  style,
  ...props
}: TextProps) {
  const colorClass = color ? (themeColorMap[color] ?? `text-${color}`) : "";
  const sizeClass = fontSize ? fontSizeMap[fontSize] ?? "" : "";
  const weightClass = fontWeight ? fontWeightMap[fontWeight] ?? "" : "";
  const combinedClassName = [colorClass, sizeClass, weightClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <RNText className={combinedClassName || undefined} style={style} {...props} />
  );
}
