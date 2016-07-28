# webcomponentsjs-custom-element-v0

This is the v0 branch of CustomElements from the webcomponents.js project.

It is necessary to have polymer run within a content script

## Usage

Install via npm:

```
npm install webcomponentsjs-custom-element-v0
```

Within a content script (see [enable-webcomponents-in-content-scripts](https://www.npmjs.com/package/enable-webcomponents-in-content-scripts) and [habitlab](https://github.com/habitlab/habitlab-chrome/) for usage examples)

```
document.registerElement = null
require('webcomponentsjs-custom-element-v0')
```

## Source

This is taken from the 0.7.22 release of the [webcomponents.js](https://www.npmjs.com/package/webcomponents.js) npm package.
