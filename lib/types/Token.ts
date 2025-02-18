type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

export type Token<T> = (
  T extends object
    ? {
        [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<Token<T[K]>>}`;
      }[Exclude<keyof T, symbol>]
    : ""
) extends infer D
  ? Extract<D, string>
  : never;
