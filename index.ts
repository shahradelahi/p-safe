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
) => SafeReturn<T, K> | Promise<SafeReturn<T, K>> | void | Promise<void>;

export async function trySafe<T = void, E = Error>(fn: TrySafeFn<T, E>): Promise<SafeReturn<T, E>> {
  try {
    let nrs = undefined;

    const res = await fn(
      (data: T) => {
        nrs = { data };
      },
      (reason: E) => {
        nrs = { error: reason };
      }
    );

    if (typeof nrs !== 'undefined') {
      return nrs;
    }

    if (typeof res === 'undefined') {
      return { data: void 0, error: void 0 } as SafeReturn<T, E>;
    }

    return res;
  } catch (error) {
    return { error: error as E };
  }
}
