Pop Locker Browser Extension
============================

A Google Chrome/Chromium browser extension for [Pop Locker project](https://github.com/poplocker-dev/poplocker-dev.github.io/blob/master/README.md).

# Running and building instructions

Source code in "stable" condition is marked with version release tags.

Download [latest release](https://github.com/poplocker-dev/browser-extension/releases) or clone the repo and switch to latest release tag.

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
### Ropsten vs Mainnet

PopLocker is still under heavy development for now we recommend to use testing networks like Ropsten. If you want to use Mainnet though, just update `RPC_URL` in `.env` file accordingly.

The current version of PopLocker has no way to backup or recover keys (this will be possible soon in a future release with Universal Login functionality) therefore if using mainnet and PopLocker is uninstalled (or your device is lost) **you will lose access to your funds**. 

## Running in development mode

issue: 

```
$ npm run dev
```

# Instalation in the browser

In Google Chrome or Chromium open Menu ↦ More tools ↦ Extensions. 

Toggle "Developer Mode" in top right. Click "Load unpacked", open `dist/` directory of the extension's source tree. PopLocker should appear on the list of available extensions.

**If you use Metamask**: disable it otherwise it will clash with PopLocker.

