import { expect, expectTypeOf, it } from 'vitest';

import { SafeReturn, trySafe } from '.';

async function fn(): Promise<SafeReturn<number, Error>> {
  if (Math.random() > 0.5) {
    return { data: 1 };
  }

  // Error must be an instance of Error
  // return { error: 'Not an error' };

  return { error: new Error('An error') };
}

class MathError extends Error {
  override name = 'NerdsOnlyError';
}

function safePrime(num: number) {
  /** This function is meant to act like a Promise constructor */
  return trySafe<number, MathError>(async (resolve, reject) => {
    const err = new MathError(`${num} is not prime`);

    if (num <= 1 || num % 2 === 0 || num % 3 === 0) {
      // return reject('Not prime'); // TS2345: Argument of type `string` is not assignable to parameter of type `MathError`
      return reject(err);
    }

    if (num <= 3) {
      return resolve(num);
    }

    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) {
        return reject(err);
      }
    }

    // return resolve('Prime'); // TS2345: Argument of type `string` is not assignable to parameter of type `number`
    return resolve(num);
  });
}

it('Must match typeof return value with SafeReturn', async () => {
  const res = await trySafe(fn);

  expectTypeOf(res).toEqualTypeOf<SafeReturn<number>>();

  if (res.error) {
    expectTypeOf(res.error).toEqualTypeOf<Error>();

    expect(res.error).toBeInstanceOf(Error);
    expect(res.data).toBeUndefined();

    return void 0; // Stop here
  }

  expectTypeOf(res.error).toEqualTypeOf<undefined>();
  expectTypeOf(res.data).toEqualTypeOf<number>();

  expect(res.data).toBeTypeOf('number');
  expect(res.error).toBeUndefined();
});

it('should Must return type with SafeReturn', async () => {
  const res = await fn();

  expectTypeOf(res).toEqualTypeOf<SafeReturn<number>>();
  expect(res).toBeTypeOf('object');

  if (res.error) {
    expectTypeOf(res.error).toEqualTypeOf<Error>();

    expect(res.error).toBeInstanceOf(Error);
    expect(res.data).toBeUndefined();

    return void 0; // Stop here
  }

  expectTypeOf(res.error).toEqualTypeOf<undefined>();
  expectTypeOf(res.data).toEqualTypeOf<number>();

  expect(res.data).toBeTypeOf('number');
  expect(res.error).toBeUndefined();
});

it('should have a name', async () => {
  const re = await trySafe(async (_, reject) => {
    await promiseThatMightReject();
    const { statusText } = await fetch('...');
    if (statusText !== 'OK') {
      reject(new Error('Request failed for a silly reason'));
    }
  });

  expectTypeOf(re).toEqualTypeOf<SafeReturn<void, Error>>();

  if (re.error) {
    expectTypeOf(re.error).toEqualTypeOf<Error>();

    expect(re.error).toBeInstanceOf(Error);
    expect(re.data).toBeUndefined();

    return;
  }

  expectTypeOf(re.error).toEqualTypeOf<undefined>();
  expectTypeOf(re.data).toBeVoid();

  expect(re.data).toBeUndefined();
  expect(re.error).toBeUndefined();
});

it('should work like a promise constructor', async () => {
  const { data, error } = await safePrime(7);

  if (typeof data === 'undefined') {
    expectTypeOf(error).toEqualTypeOf<MathError>();
  }

  if (typeof error === 'undefined') {
    expectTypeOf(data).toEqualTypeOf<number>();
  }

  expect(error).toBeUndefined();
  expect(data).toBeTypeOf('number');
});

async function promiseThatMightReject() {
  throw new Error('Rejected');
}
