Pop Locker Browser Extension
============================

A Google Chrome/Chromium browser extension for [Pop Locker project](https://github.com/poplocker-dev/poplocker-dev.github.io/blob/master/README.md).

# Running and building instructions

## Prerequisites

- nodejs
- npm
- [yarn](https://yarnpkg.com/en/docs/install)

## Building

To build and install clone the repo and within root directory issue:

```
$ yarn
```

next copy `.env.sample` to `.env` and update placeholder values.

finally:

```
$ npm run build
```

## Running in development mode

issue: 

```
$ npm run dev
```

# Instalation in the browser

In Google Chrome or Chromium open Menu ↦ More tools ↦ Extensions. 

Toggle "Developer Mode" in top right. Click "Load unpacked", open `dist/` directory of the extension's source tree. PopLocker should appear on the list of available extensions.

**If you use Metamask**: disable it otherwise it will clash with PopLocker. Only one shall rule them all.

