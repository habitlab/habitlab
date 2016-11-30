## SkateJS components

[Web components](http://webcomponents.org/) built using the [SkateJS](https://github.com/skatejs/skatejs) framework can be used content scripts and extension options pages.

### Adding a SkateJS component

A SkateJS component can be added by first creating a file under the [`src/components_skate`](https://github.com/habitlab/habitlab-chrome/tree/master/src/components_skate) directory. It can be written in either [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html) with [JSX control statements](https://www.npmjs.com/package/jsx-control-statements) or [Livescript](http://livescript.net/) (with inline JSX).

Now run `gulp` and reload the chrome extension. Your component should now be usable in interventions.

### Example SkateJS components

[`time-spent-display.jsx`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/time-spent-display.jsx) is an example of a component written in JSX, and [`time-spent-display-livescript.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/time-spent-display-livescript.ls) is an example of the same component written in Livescript.

[`scroll-block-display-example.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/scroll-block-display-example.ls) is an example of a more complex component that emits events.

[`jsx-features-example.jsx`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/jsx-features-example.jsx) illustrates some JSX features, [`jsx-features-example-livescript.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/jsx-features-example-livescript.ls) is the equivalent component implemented in Livescript with inline JSX, and [`jsx-control-statements-example.jsx`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/jsx-control-statements-example.jsx) is the equivalent component implemented with [JSX control statements](https://www.npmjs.com/package/jsx-control-statements).

### Previewing SkateJS components

To preview your component visit [chrome://extensions](chrome://extensions) and click the options page for HabitLab, and substitute `options-view` in `index.html?tag=options-view` portion with the name of your component (ie, `index.html?tag=time-spent-display-livescript` for [`time-spent-display-livescript.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/time-spent-display-livescript.ls))

If your component has properties (ie, the `site` property in [`time-spent-display-livescript.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/time-spent-display-livescript.ls)), you can pass them as URL parameters, such as `index.html?tag=time-spent-display-livescript&site=www.facebook.com`

### Using a SkateJS component in a content script

Before you require the component, you must have the following line in your content script:

```javascript
require('enable-webcomponents-in-content-scripts')
```

Then, require the SkateJS component, and you can then create elements and add them to the body:

```javascript
require('components_skate/time-spent-display')
display_timespent_div = $('<time-spent-display>')
$('body').append(display_timespent_div)
```

See [`google/display_time_spent/frontend.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/interventions/google/display_time_spent/frontend.ls) and [`wikipedia/scroll_blocker/frontend.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/interventions/wikipedia/scroll_blocker/frontend.ls) for examples of interventions that use SkateJS components in the content script.
