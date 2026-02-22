import { SafeReturn, TrySafeFn } from './typings';

export type { SafeReturn, TrySafeFn };

export async function trySafe<T = void, E = Error>(fn: TrySafeFn<T, E>): Promise<SafeReturn<T, E>> {
  try {
    let nrs: SafeReturn<T, E> | undefined = undefined;

    const res = await fn(
      (data: T) => {
        nrs = { data } as SafeReturn<T, E>;
      },
      (reason: E) => {
        nrs = { error: reason } as SafeReturn<T, E>;
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
