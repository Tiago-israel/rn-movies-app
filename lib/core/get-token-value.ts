export function getTokenValue(token: string, theme: Record<string, any>) {
  let value: any;
  if (typeof token === "string" && token.includes("%")) return token;
  if (typeof token === "number") return token;
  const keys = token.split(".");
  keys.forEach((key) => {
    if (!value) {
      value = theme[key] ? theme[key] : key;
    } else {
      value = value[key];
    }
  });
  return value;
}
