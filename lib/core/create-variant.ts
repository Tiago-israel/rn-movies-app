export function createVariant<V extends string, T = {}>(
  variant: V,
  object: Record<V, T>
) {
  return object[variant] ?? {};
}
