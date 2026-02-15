import { Pressable, PressableProps, Text } from "react-native";

export type ButtonProps = {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
} & PressableProps;

export function Button({ fullWidth = true, variant = "primary", disabled, children, ...props }: ButtonProps) {
  const variantClasses = {
    primary: "bg-primary",
    secondary: "bg-white",
  };
  const disabledClasses = disabled ? "bg-separator" : variantClasses[variant];
  const textColorClasses = {
    primary: "text-primary-foreground",
    secondary: "text-black",
  };
  const disabledTextClass = disabled ? "text-palette-asbestos" : textColorClasses[variant];

  return (
    <Pressable
      className={`items-center justify-center rounded-lg h-12 ${fullWidth ? "w-full" : "w-14"} ${disabledClasses}`}
      disabled={disabled}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className={`text-sm font-bold ${disabledTextClass}`}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
