import { expectType } from 'tsd';
import { SafeReturn, trySafe } from 'p-safe';
import { expect } from 'chai';

async function fn(): Promise<SafeReturn<number, Error>> {
  if (Math.random() > 0.5) {
    return { data: 1 };
  }

  // Error must be an instance of Error
  // return { error: 'Not an error' };

  return { error: new Error('An error') };
}

class MathError extends Error {
  name = 'NerdsOnlyError';
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

  expectType<SafeReturn<number>>(res);

  if (res.error) {
    expectType<Error>(res.error);

    expect(res.error).to.be.instanceOf(Error);
    expect(res.data).to.be.undefined;

    return void 0; // Stop here
  }

  expectType<undefined>(res.error);
  expectType<number>(res.data);

  expect(res.data).to.be.a('number');
  expect(res.error).to.be.undefined;
});

it('should Must return type with SafeReturn', async () => {
  const res = await fn();

  expectType<SafeReturn<number>>(res);
  expect(res).to.be.an('object');

  if (res.error) {
    expectType<Error>(res.error);

    expect(res.error).to.be.instanceOf(Error);
    expect(res.data).to.be.undefined;

    return void 0; // Stop here
  }

  expectType<undefined>(res.error);
  expectType<number>(res.data);

  expect(res.data).to.be.a('number');
  expect(res.error).to.be.undefined;
});

it('should have a name', async () => {
  const re = await trySafe(async (_, reject) => {
    await promiseThatMightReject();
    const { statusText } = await fetch('...');
    if (statusText !== 'OK') {
      reject(new Error('Request failed for a silly reason'));
    }
  });

  expectType<SafeReturn<void, Error>>(re);

  if (re.error) {
    expectType<Error>(re.error);

    expect(re.error).to.be.instanceOf(Error);
    expect(re.data).to.be.undefined;

    return;
  }

  expectType<undefined>(re.error);
  expectType<void>(re.data);

  expect(re.data).to.be.undefined;
  expect(re.error).to.be.undefined;
});

it('should work like a promise constructor', async () => {
  const { data, error } = await safePrime(7);

  if (typeof data === 'undefined') {
    expectType<MathError>(error);
  }

  if (typeof error === 'undefined') {
    expectType<number>(data);
  }

  expect(error).to.be.undefined;
  expect(data).to.be.a('number');
});

async function promiseThatMightReject() {
  throw new Error('Rejected');
}
