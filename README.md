# p-safe

> Safely handle promise rejections

[![codecov](https://codecov.io/gh/shahradelahi/p-safe/branch/master/graph/badge.svg)](https://codecov.io/gh/shahradelahi/p-safe)
[![npm](https://img.shields.io/npm/v/p-safe)](https://www.npmjs.com/package/p-safe)
[![npm bundle size](https://packagephobia.now.sh/badge?p=p-safe)](https://packagephobia.now.sh/result?p=p-safe)

### Install

```bash
npm install p-safe
```

### Usage

```typescript
import { trySafe, type SafeReturn } from 'p-safe';

const { error } = trySafe(async (): SafeReturn<never, Error> => {
  await promiseThatMightReject();
  await fetch('...');
});

if (error) {
  // Handle error
  console.error(error);
  return;
}

console.log(error); // undefined
```

Or implement your function and only use `SafeReturn` type:

```typescript
import type { SafeReturn } from 'p-safe';

async function foo(): Promise<SafeReturn<object, Error>> {
  const resp = await fetch('...');
  if (!resp.ok) {
    return { error: new Error('Request failed for a silly reason') };
  }
  return { data: await resp.json() };
}

const { data, error } = await foo();

if (error) {
  // Handle error
  console.error(error);
  return;
}

console.log(error); // undefined
console.log(data); // { ... }
```

Are you still confused? Let me explain it in a simple way. `p-safe` is a simple utility that helps you to safely handle
promise rejections. It's a simple and clean way to handle promise rejections without using `try/catch` blocks.

Check out the [tests](/index.test.ts) for more examples.

### Related

- [p-catch-if](https://github.com/sindresorhus/p-catch-if) - Conditional promise catch handler
- [p-if](https://github.com/sindresorhus/p-if) - Conditional promise chains
- [p-tap](https://github.com/sindresorhus/p-tap) - Tap into a promise chain without affecting its value or state
- [p-log](https://github.com/sindresorhus/p-log) - Log the value/error of a promise
- [More…](https://github.com/sindresorhus/promise-fun)

### License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi)
