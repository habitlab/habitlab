# habitlab-chrome

This is the Chrome extension for HabitLab

## Install

Ensure that you have [git](https://git-scm.com/) and [nodejs](https://nodejs.org/en/) (6.2.2 or higher) installed.

```
git clone git@github.com:habitlab/habitlab-chrome.git
cd habitlab-chrome
npm install
npm install -g gulp webpack vulcanize cspify crisper livescript
gulp
```

Now you will have the chrome extension built in the `dist` directory. You can sideload it using the [extensions developer tool](https://chrome.google.com/webstore/detail/chrome-apps-extensions-de/ohmmkhmmmpcnpikjeljgnaoabkaalbgc) or by going to [chrome://extensions](chrome://extensions) and clicking `Load Unpacked Extension` and selecting the `dist` directory under the `habitlab-chrome` folder.

## Adding an intervention

First add an directory under the [`src/interventions`](https://github.com/habitlab/habitlab-chrome/tree/master/src/interventions) directory. It should contain 2 files: `info.yaml` and `frontend.ls`. Follow [`google/blue_background`](https://github.com/habitlab/habitlab-chrome/tree/master/src/interventions/google/blue_background) as an example of how these files should look like.

Then, edit the file [`src/interventions/interventions.yaml`](https://github.com/habitlab/habitlab-chrome/blob/master/src/interventions/interventions.yaml) and add the path to your intervention relative to the [`src/interventions`](https://github.com/habitlab/habitlab-chrome/tree/master/src/interventions) directory.

### Logging Intervention Impressions

To log impressions (that is, instances of when your intervention has been deployed) that are used in data visualizations on the dashboard, as well as to measure intervention efficacy and user progress, there are several useful methods: log_impression and log_action; examples of these in action can be seen under [`src/interventions/google/logging_example`](https://github.com/habitlab/habitlab-chrome/tree/master/src/interventions/google/logging_example). 

These methods, along with a vast library of useful methods for retrieving values from the database, are available in [`src/libs_backend`](https://github.com/habitlab/habitlab-chrome/tree/master/src/libs_backend), [`src/libs_common`](https://github.com/habitlab/habitlab-chrome/tree/master/src/libs_common), and [`src/libs_frontend`](https://github.com/habitlab/habitlab-chrome/tree/master/src/libs_frontend).

## Adding a goal

First, add a directory under the [`src/goals`](https://github.com/habitlab/habitlab-chrome/tree/master/src/goals) directory. It should contain a file `info.yaml` and may contain a file `measurement.ls`. Follow [`facebook/spend_less_time`](https://github.com/habitlab/habitlab-chrome/tree/master/src/interventions/facebook/spend_less_time) as an example of what a goal of the form "spend less time on site X" should look like, and [`duolingo/complete_lesson_each_day`](https://github.com/habitlab/habitlab-chrome/tree/master/src/goals/duolingo/complete_lesson_each_day) as an example of how a goal with a custom measurement function should look like.

## SkateJS components

[Web components](http://webcomponents.org/) built using the [SkateJS](https://github.com/skatejs/skatejs) framework can be used in either content scripts or extension options pages.

### Adding a SkateJS component

A SkateJS component can be added by first creating a file under the [`src/components_skate`](https://github.com/habitlab/habitlab-chrome/tree/master/src/components_skate) directory. It can be written in either [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html) with [JSX control statements](https://www.npmjs.com/package/jsx-control-statements) or [Livescript](http://livescript.net/) (with inline JSX).

Then, edit the file [`src/components_skate/components_skate.js`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/components_skate.js) and add the path to your component relative to the [`src`](https://github.com/habitlab/habitlab-chrome/tree/master/src) directory (you can leave off the `.jsx` or `.ls` extension).

### Example SkateJS components

[`time-spent-display.jsx`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/time-spent-display.jsx) is an example of a component written in JSX, and [`time-spent-display-livescript.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/time-spent-display-livescript.ls) is an example of the same component written in Livescript.

[`scroll-block-display-example.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/scroll-block-display-example.ls) is an example of a more complex component that emits events.

[`jsx-features-example.jsx`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/jsx-features-example.jsx) illustrates some JSX features, [`jsx-features-example-livescript.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/jsx-features-example-livescript.ls) is the equivalent component implemented in Livescript with inline JSX, and [`jsx-control-statements-example.jsx`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/jsx-control-statements-example.jsx) is the equivalent component implemented with [JSX control statements](https://www.npmjs.com/package/jsx-control-statements).

### Previewing SkateJS components

To preview your component visit [chrome://extensions](chrome://extensions) and click the options page for HabitLab, and substitute `options-view` in `index.html?tag=options-view` portion with the name of your component (ie, `index.html?tag=time-spent-display-livescript` for [`time-spent-display-livescript.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/time-spent-display-livescript.ls))

If your component has properties (ie, the `site` property in [`time-spent-display-livescript.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/time-spent-display-livescript.ls)), you can pass them as URL parameters, such as `index.html?tag=time-spent-display-livescript&site=www.facebook.com`

### Using a SkateJS component in a content script

Before you require the component, you must have the following line in your content script:

```
require('enable-webcomponents-in-content-scripts')
```

Then, require the SkateJS component, and you can then create elements and add them to the body:

```
require('components_skate/time-spent-display')
display_timespent_div = $('<time-spent-display>')
$('body').append(display_timespent_div)
```

See [`google/display_time_spent/frontend.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/interventions/google/display_time_spent/frontend.ls) and [`wikipedia/scroll_blocker/frontend.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/interventions/wikipedia/scroll_blocker/frontend.ls) for examples of interventions that use SkateJS components in the content script.

## Polymer components

[Web components](http://webcomponents.org/) built using the [Polymer](https://www.polymer-project.org/) framework can be used in extension option pages, but not in content scripts. (The reason Polymer cannot be used in content scripts is because content scripts cannot include [HTML imports](http://www.html5rocks.com/en/tutorials/webcomponents/imports/), which is used by Polymer). If you want to use a component in a content script, build it in [SkateJS](#skatejs-components) instead.

### Adding a Polymer component

A Polymer component can be added by first adding 2 files under [`src/components`](https://github.com/habitlab/habitlab-chrome/tree/master/src/components) : a `.html` file (example: [`site-goal-view.html`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components/site-goal-view.html)), and a `.ls` ([Livescript](http://livescript.net/)) or `.js` (Javascript) file (example: [`site-goal-view.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components/site-goal-view.ls))

Then, edit the file [`src/components/components.html`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components/components.html) and add the path of the `.html` file relative to the [`src/components`](https://github.com/habitlab/habitlab-chrome/tree/master/src/components) directory.

### Shadow DOM notes

Note that you should not directly use `document.querySelector` or `$` or `once_available` in the context of a Polymer component, as these break the [Shadow DOM](https://www.polymer-project.org/1.0/docs/devguide/local-dom). Instead, use one of the following methods, which are defined in [`libs_frontend/polymer_methods.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/libs_frontend/polymer_methods.ls)

- `this.S` (takes a pattern and returns a jQuery object of the first match)
- `this.SM` (takes a pattern and returns a jQuery object of all matches, equivalent of `$`)
- `this.$$` (takes a pattern and returns the first match as a DOM element, equivalent of `document.querySelector`)
- `this.$$$` (takes a pattern and returns all matching DOM elements, equivalent of `document.querySelectorAll`)
- `this.once_available` (takes a pattern and a callback, repeatedly checks to see if selecting the pattern is non-null, and calls the callback once the pattern is available on the page)

Note that you will need to import these methods from [`libs_frontend/polymer_methods.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/libs_frontend/polymer_methods.ls) by passing a second parameter to the [`polymer_ext`](https://github.com/habitlab/habitlab-chrome/blob/master/src/libs_frontend/polymer_utils.ls) function). The importing and use of the `this.S` and `this.once_available` methods is illustrated in [`options-view.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components/options-view.ls).

If you need to do iterations, use a [template](https://www.polymer-project.org/1.0/docs/devguide/templates). Refer to [`options-goals.html`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components/options-goals.html) for an example.

### Previewing Polymer components

To preview your component to [chrome://extensions](chrome://extensions) and click the options page for HabitLab, and substitute `options-view` in `index.html?tag=options-view` portion with the name of your component (ie, `index.html?tag=site-goal-view` for [`site-goal-view.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components/site-goal-view.ls))

If your component has properties (ie, the `site` property in [`site-goal-view.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components/site-goal-view.ls)), you can pass them as URL parameters, such as `index.html?tag=site-goal-view&site=youtube`

If your component has custom styles (ie, the `--width` and `--height` custom styles in in [`habitlab-logo-polymer.html`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components/habitlab-logo-polymer.html)) you can pass them as url parameters, such as `index.html?tag=habitlab-logo-polymer&customStyle.--width=200px&customStyle.--height=200px`. You can read more about custom styling in the [Polymer styling documentation](https://www.polymer-project.org/1.0/docs/devguide/styling#xscope-styling).

### Using a Polymer component in an extension options page

Refer to [`site-goal-view.html`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components/site-goal-view.html) for an example.

### Using a Polymer component in a content script

Before you require the component, you must have the following line in your content script:

```
require('enable-webcomponents-in-content-scripts')
```

Then, require the Polymer component, and you can then create elements and add them to the body:

```
require('components/hello-world-example.deps')

hello_world_example = $('<hello-world-example>')
$('body').append(hello_world_example)
```

Note that to require the component, you need to require a `.deps.js` file (you can use `.deps` as shorthand). These files are generated using the [`scripts/generate_polymer_dependencies`](https://github.com/habitlab/habitlab-chrome/blob/master/scripts/generate_polymer_dependencies.ls) script from the corresponding `.html` files. The script is run automatically when you run `gulp` (but currently it is not re-run when the `.html` files are changed, so you will have to re-run `gulp` manually if you added new components or new html imports).

See [`google/polymer_example/frontend.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/interventions/google/polymer_example/frontend.ls) for an example of an intervention that uses Polymer components in the content script.

### Using an external Polymer component in a content script

If you add an external polymer component, first ensure you have bower and cspify installed (you may need to run this command with sudo)

```
npm install -g bower cspify
```

Then install the component via bower, run cspify, and generate the `.deps.js` file:

```
bower install paper-button
cspify
./scripts/generate_polymer_dependencies --bower
```

The last command will generate many errors, you can ignore them. Just verify that the file `bower_components/paper-button/paper-button.deps.js` exists. Now you can include it by adding to your content script:

```
require('enable-webcomponents-in-content-scripts')

require('bower_components/paper-button/paper-button.deps')

paper_button_example = $('<paper-button>Click me</paper-button>')
$('body').append(paper_button_example)
```

## Using External Libraries

You can use any [npm](https://www.npmjs.com/) modules as follows. (This example illustrates usage of the [moment](http://momentjs.com/docs/) package)

1) Install the npm module, and save it (the `--save` option will modify [`package.json`](https://github.com/habitlab/habitlab-chrome/blob/master/package.json) and add it as a dependency)

```
npm install --save moment
```

2) Require the module and use it in any of the Javascript or Livescript files:

```
moment = require('moment')
moment().format()
```

## Troubleshooting

Did you recently do a `git pull`, or modified a file, and have errors along the lines of `module not found`? Make sure:

1) All npm modules are installed:

```
npm install
```

2) All files are building correctly:

```
gulp
```

3) Should not be necessary, but running gulp clean might help:

```
gulp clean
```
