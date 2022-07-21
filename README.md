# A boilerplate to start create a Typescript SDK 

# Getting started

```
npx @websaam/sdk-ts-starter my-ts-sdk
```

# Installation

1. Run `yarn`

2. Change your configs in `esbuild-config.js`

3. Change your package name in `package.json`, rename `@websaam/sdk-ts-starter` to anything you want

## HTML

> `devHtml`: Listens to Typescript file changes from `src`, and output to `src_build_from_ts`, which is also being listend and built to `./build/web/index.js`. Finally, run a live server on `localhost:3000` 

Open `tests/html/html-test.html` to edit

```html
<script src="/build/web/index.js"></script>
<script>
    console.log("ExampleSDK:", ExampleSDK);
    ExampleSDK.foo();
</script>
```

## React

> `devReact`: Listens to Typescript file changes from `src`, and output to `src_build_from_ts`, which is also being listend and built to `./build/node/index.js`. Finally, run React app on `localhost:3000` 

```js

// 1. Download React
yarn getReact

// 2. Build the SDK for both client/node, and publish locally using yalc
yarn build

// 3. Go to the React app and link the local published sdk (change the name of the package name `@websaam/sdk-ts-starter` to something you desired)
yarn linkReact

// 4. In the App.js
import * as ExampleSDK from '@websaam/sdk-ts-starter';
ExampleSDK.hello();

```