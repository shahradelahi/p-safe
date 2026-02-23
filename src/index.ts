import { AnyFunction, SafeReturn, TrySafeFn } from './typings';

export type { AnyFunction, SafeReturn, TrySafeFn };

/**
 * Safely executes a function and returns the result, or `null` if an error occurs.
 *
 * This is useful for "fire-and-forget" operations or optional logic where
 * the specific error reason is not important.
 *
 * @param fn - The function to execute. Can be synchronous or asynchronous.
 * @returns A promise resolving to the function's return value, or `null` if it throws/rejects.
 *
 * @example
 * // Synchronous
 * const val = await tryIgnore(() => JSON.parse('invalid')); // null
 *
 * // Asynchronous
 * const data = await tryIgnore(async () => fetch('/api').then(r => r.json()));
 */
export async function tryIgnore<T extends AnyFunction>(
  fn: T
): Promise<Awaited<ReturnType<T>> | null> {
  try {
    return await fn();
  } catch (_) {
    return null;
  }
}

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
