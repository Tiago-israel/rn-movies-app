export function createProperty(value: any, ...props: string[]) {
  return props.reduce((acc: Record<string, any>, prop: string) => {
    acc[prop] = value;
    return acc;
  }, {});
}
