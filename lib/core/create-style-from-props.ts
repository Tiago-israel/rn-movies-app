import { propMap } from "./prop-map";

export function createStyleFromProps(props: any, theme: any) {
  let result: any = {};
  Object.keys(props).forEach((key) => {
    const value = propMap[key]?.(props[key], theme);
    if (typeof value === "object") {
      result = { ...result, ...value };
    } else if(value){
      result[key] = value;
    }
  });
  return result;
}
