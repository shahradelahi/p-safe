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

export type TrySafeFn<T, K> = () =>
  | SafeReturn<T, K>
  | Promise<SafeReturn<T, K>>
  | void
  | Promise<void>;

export async function trySafe<T = void, E = Error>(fn: TrySafeFn<T, E>): Promise<SafeReturn<T, E>> {
  try {
    const res = await fn();
    if (typeof res === 'object') {
      return res;
    }
    return { data: void 0, error: void 0 } as SafeReturn<T, E>;
  } catch (error) {
    return { error: error as E };
  }
}
