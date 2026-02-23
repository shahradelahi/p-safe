export type AnyFunction = (...args: any[]) => any;

export type SafeReturn<T, K = Error> = Partial<{
  data: T;
  error: K;
}> &
  (
    | {
        data: T;
        error?: never;
      }
    | {
        data?: never;
        error: K;
      }
  );

export type TrySafeFn<T, K> = (
  resolve: (data: T) => void,
  reject: (reason: K) => void
) => Promise<SafeReturn<T, K>> | Promise<void>;
