<h1 align="center">
  <sup>p-safe</sup>
  <br>
  <a href="https://github.com/shahradelahi/p-safe/actions/workflows/ci.yml"><img src="https://github.com/shahradelahi/p-safe/actions/workflows/ci.yml/badge.svg?branch=main&event=push" alt="CI"></a>
  <a href="https://www.npmjs.com/package/p-safe"><img src="https://img.shields.io/npm/v/p-safe.svg" alt="NPM Version"></a>
  <a href="/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat" alt="MIT License"></a>
  <a href="https://bundlephobia.com/package/p-safe"><img src="https://img.shields.io/bundlephobia/minzip/p-safe" alt="npm bundle size"></a>
  <a href="https://packagephobia.com/result?p=p-safe"><img src="https://packagephobia.com/badge?p=p-safe" alt="Install Size"></a>
</h1>

_p-safe_ provides a clean and elegant way to safely handle promise rejections without `try/catch` blocks.

---

- [Installation](#-installation)
- [Usage](#-usage)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#license)

## 📦 Installation

```bash
npm install p-safe
```

<details>
<summary>Install using your favorite package manager</summary>

**pnpm**

```bash
pnpm install p-safe
```

**yarn**

```bash
yarn add p-safe
```

</details>

## 📖 Usage

### Basic Usage

Safely execute an async function and handle the result or error in a single line.

```ts
import { trySafe } from 'p-safe';

const { data, error } = await trySafe(async () => {
  return await fetchData();
});

if (error) {
  return console.error('Failed to fetch:', error);
}

console.log('Data:', data);
```

### Manual Resolve/Reject

Use the `resolve` and `reject` callbacks for more control over the result, similar to the `Promise` constructor.

```ts
import { trySafe } from 'p-safe';

const { error } = await trySafe(async (resolve, reject) => {
  const resp = await fetch('https://api.example.com/data');
  
  if (!resp.ok) {
    return reject(new Error('Request failed'));
  }

  resolve(await resp.json());
});
```

### SafeReturn Type

Integrate `SafeReturn` into your own functions for consistent error handling across your codebase.

```ts
import type { SafeReturn } from 'p-safe';

async function getUser(id: string): Promise<SafeReturn<User, Error>> {
  const user = await db.users.find(id);
  
  if (!user) {
    return { error: new Error('User not found') };
  }
  
  return { data: user };
}

const { data, error } = await getUser('123');
```

### Strict Typing

Leverage TypeScript to ensure your error handling is robust and type-safe.

```ts
class MathError extends Error {}

const { data, error } = await trySafe<number, MathError>(async (resolve, reject) => {
  if (isInvalid) {
    reject(new MathError('Invalid input'));
  }
  resolve(42);
});

// error is typed as MathError | undefined
// data is typed as number | undefined
```

## 📚 Documentation

For all configuration options, please see [the API docs](https://www.jsdocs.io/package/p-safe).

## 🤝 Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/p-safe).

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi).
