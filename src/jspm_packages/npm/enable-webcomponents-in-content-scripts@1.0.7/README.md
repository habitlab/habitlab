# enable-webcomponents-in-content-scripts

Enables use of Web Components Custom Elements in Chrome content scripts.

It inserts a polyfill for the v1 version of Custom Elements from webcomponentsjs.

It is necessary to use [SkateJS](https://github.com/skatejs/skatejs) within a content script.

## Usage

You can use it via a require statement in webpack.

Install via npm:

```
npm install enable-webcomponents-in-content-scripts
```

Within a content script, make sure you require it before skatejs

```
require('enable-webcomponents-in-content-scripts')
skate = require('skatejs')
```

## Example

This library is used by [HabitLab](https://github.com/habitlab/habitlab-chrome/)

See the `src/interventions` and `src/components_skate` directories

## Details

This module check if Chrome is using the native implementation of `document.registerElement` (for v0 of the CustomElements API), or `window.customElements` (for v1 of the CustomElements API), and if yes, it substitutes them with a polyfill. You can do this manually via:

```
document.registerElement = null
require('webcomponentsjs-custom-element-v0')
```

```
window.customElements = null
require('webcomponentsjs-custom-element-v1')
```

See [webcomponentsjs-custom-element-v0](https://github.com/gkovacs/webcomponentsjs-custom-element-v0) and [webcomponentsjs-custom-element-v1](https://github.com/gkovacs/webcomponentsjs-custom-element-v1) for details.

## License

MIT

## Credits

By [Geza Kovacs](https://github.com/gkovacs)
