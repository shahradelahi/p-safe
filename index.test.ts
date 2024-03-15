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
  const re = await trySafe(async () => {
    await promiseThatMightReject();
    await fetch('...');
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

async function promiseThatMightReject() {
  throw new Error('Rejected');
}
