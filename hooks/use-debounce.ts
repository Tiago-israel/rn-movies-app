import { useRef } from "react";

export function useDebounce<T>(cb: (props: T) => void, delay = 0) {
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();

  return function (props: T) {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      cb(props)
    }, delay);
  };
}
