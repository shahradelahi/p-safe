<h1 align="center">
  <sup>p-safe</sup>
  <br>
  <a href="https://github.com/shahradelahi/p-safe/actions/workflows/ci.yml"><img src="https://github.com/shahradelahi/p-safe/actions/workflows/ci.yml/badge.svg?branch=main&event=push" alt="CI"></a>
  <a href="https://www.npmjs.com/package/p-safe"><img src="https://img.shields.io/npm/v/p-safe.svg" alt="NPM Version"></a>
  <a href="/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat" alt="MIT License"></a>
  <a href="https://bundlephobia.com/package/p-safe"><img src="https://img.shields.io/bundlephobia/minzip/p-safe" alt="npm bundle size"></a>
  <a href="https://packagephobia.com/result?p=p-safe"><img src="https://packagephobia.com/badge?p=p-safe" alt="Install Size"></a>
</h1>

_p-safe_ provides a clean and elegant way to safely handle promise rejections and function errors without messy `try/catch` blocks.

## Benefits

- **Avoid Scoping Issues:** Keep variables in local scope using `const` instead of declaring `let` outside `try/catch` blocks.
- **Better Type Inference:** Strictly type your errors instead of dealing with `any` or `unknown` in catch blocks.
- **Clean Control Flow:** Promotes a "fail-fast" pattern with flatter, more readable code that's easier to maintain.
- **Flexible Patterns:** Support for both Result pattern (`trySafe`) and Optional pattern (`tryIgnore`) depending on your needs.
- **Async Native:** Fully capable of wrapping both synchronous and asynchronous functions elegantly.

---

- [Benefits](#benefits)
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

### Result Pattern (`trySafe`)

Safely execute an operation and get back a structured object. This is best when you need to handle the error specifically.

<!-- prettier-ignore -->
```ts
import { trySafe } from 'p-safe';

const { data, error } = await trySafe(() => fetchUser(id));

if (error) {
  return console.error('Failed to load user:', error.message);
}

console.log('User name:', data.name);
```

### Optional Pattern (`tryIgnore`)

Use this for "nice-to-have" operations where you don't care _why_ it failed, you just want the result or `null`.

```ts
import { tryIgnore } from 'p-safe';

// If JSON is invalid, config will simply be null
const config = await tryIgnore(() => JSON.parse(maybeJson));

// If the file doesn't exist, it returns null instead of throwing
const stats = await tryIgnore(() => fs.promises.stat('./optional-file.txt'));
```

### Manual Resolve/Reject

Use the `resolve` and `reject` callbacks for granular control, similar to the `Promise` constructor.

```ts
const { data, error } = await trySafe(async (resolve, reject) => {
  const resp = await fetch(url);
  if (!resp.ok) return reject(new Error('Fetch failed'));
  resolve(await resp.json());
});
```

### Strict Typing

Leverage TypeScript to ensure your error handling is robust and type-safe by defining custom error types.

```ts
class MathError extends Error {}

const { data, error } = await trySafe<number, MathError>(
  async (resolve, reject) => {
    if (num < 0) return reject(new MathError('Negative number'));
    resolve(Math.sqrt(num));
  }
);

// error is typed as MathError | undefined
// data is typed as number | undefined
```

## 📚 Documentation

For all configuration options, please see [the API docs](https://www.jsdocs.io/package/p-safe).

## 🤝 Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/p-safe).

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi) and [contributors](https://github.com/shahradelahi/p-safe/graphs/contributors).
