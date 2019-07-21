## Installation
[![NPM Version](https://img.shields.io/npm/v/appium-dom-utils.svg?style=flat-square)](https://www.npmjs.com/package/appium-dom-utils) [![NPM Downloads](https://img.shields.io/npm/dt/appium-dom-utils.svg?style=flat-square)](https://npm-stat.com/charts.html?package=appium-dom-utils)[![License](https://img.shields.io/github/license/testimio/appium-dom-utils.svg?style=flat-square)](https://github.com/testimio/appium-dom-utils/blob/master/LICENSE)
```
npm i -S appium-dom-utils
```

# appium-dom-utils

A collection of util functions for writing Appium tests using DOM API.

```js
const {
  parseDomFromString,
  getXPathSelector,
} = require('appium-dom-utils');
const wdio = require("webdriverio");

const client = await webdriverio.remote(capabilities);
const xmlSourceString = driver.getPageSource();
const dom = parseDomFromString(xmlSourceString);
const domElement = dom.querySelector("[text*='9']");
const xpath = getXPathSelector(domElement);
const appiumElement = await client.$(xpath);
await client.deleteSession();
```

## API

### `parseDomFromString(xml: String)`

Returns a DOM object.
Throws when the xml string is not formatted well.
Currently tested with the return value of driver.getPageSource() for both Android (UiAutomator2) and iOS (UIAutomation) tests.

```js
import { parseDomFromString } from 'appium-dom-utils';
parseDomFromString(xmlString);
```

### `getXPathSelector(el: Element)`

Returns the xpath (string) for the element supplied. [Android UiAutomator2 tests].

```js
import { getXPathSelector } from 'appium-dom-utils';
getXPathSelector(element);
```

### `getClassChainSelector(el: Element)`

Returns the class chain (string) for the element supplied. [iOS UIAutomation tests].

```js
import { getClassChainSelector } from 'appium-dom-utils';
getClassChainSelector(element);
```