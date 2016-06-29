# habitlab-chrome

This is the Chrome extension for HabitLab

## Install

Ensure that you have [git](https://git-scm.com/) and [nodejs](https://nodejs.org/en/) (6.2.2 or higher) installed.

```
git clone git@github.com:habitlab/habitlab-chrome.git
cd habitlab-chrome
npm install
npm install -g gulp
gulp
```

Now you will have the chrome extension built in the `dist` directory. You can sideload it using the [extensions developer tool](https://chrome.google.com/webstore/detail/chrome-apps-extensions-de/ohmmkhmmmpcnpikjeljgnaoabkaalbgc) or by going to [chrome://extensions](chrome://extensions) and clicking `Load Unpacked Extension` and selecting the `dist` directory under the `habitlab-chrome` folder.

## Adding an intervention

First add an directory under the [`src/interventions`](https://github.com/habitlab/habitlab-chrome/tree/master/src/interventions) directory. It should contain 2 files: `info.yaml` and `frontend.ls`. Follow [`google/blue_background`](https://github.com/habitlab/habitlab-chrome/tree/master/src/interventions/google/blue_background) as an example of how these files should look like.

Then, edit the file [`src/interventions/interventions.yaml`](https://github.com/habitlab/habitlab-chrome/blob/master/src/interventions/interventions.yaml) and add the path to your intervention relative to the [`src/interventions`](https://github.com/habitlab/habitlab-chrome/tree/master/src/interventions) directory.

## Adding a goal

First, add a directory under the [`src/goals`](https://github.com/habitlab/habitlab-chrome/tree/master/src/goals) directory. It should contain a file `info.yaml` and may contain a file `measurement.ls`. Follow [`facebook/spend_less_time`](https://github.com/habitlab/habitlab-chrome/tree/master/src/interventions/facebook/spend_less_time) as an example of what a goal of the form "spend less time on site X" should look like, and [`duolingo/complete_lesson_each_day`](https://github.com/habitlab/habitlab-chrome/tree/master/src/goals/duolingo/complete_lesson_each_day) as an example of how a goal with a custom measurement function should look like.

## SkateJS components

Web components building the [SkateJS](https://github.com/skatejs/skatejs) framework can be used in either content scripts or extension options pages.

### Adding a SkateJS component

A SkateJS component can be added by first creating a file under the [`src/components_skate`](https://github.com/habitlab/habitlab-chrome/tree/master/src/components_skate) directory. It can be written in either [JSX](https://facebook.github.io/jsx/) or [Livescript](http://livescript.net/) (with inline JSX); [`time-spent-display.jsx`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/time-spent-display.jsx) is an example of a component written in JSX, and [`time-spent-display-livescript.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/time-spent-display-livescript.ls) is an example of the same component written in Livescript. [`scroll-block-display-example.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/scroll-block-display-example.ls) is an example of a more complex component that fires events.

Then, edit the file [`src/components_skate/components_skate.js`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/components_skate.js) and add the path to your component relative to the [`src`](https://github.com/habitlab/habitlab-chrome/tree/master/src) directory (you can leave off the `.jsx` or `.ls` extension).

### Previewing SkateJS components

You can preview your component by visiting the URL [`index.html?tag=time-spent-display`](chrome-extension://lofmnmocmjaifdldockcnobclclaecmn/index.html?tag=time-spent-display) substituting `time-spent-display` with the tag name registered by your SkateJS component. (If the above link does not work, go to [chrome://extensions](chrome://extensions) and click the options page for HabitLab, and substitute the `index.html?tag=options-view` portion with the above string).

If your component has properties (ie, the `site` property in [`time-spent-display.jsx`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components_skate/time-spent-display.jsx)), you can pass them as URL parameters, such as [`index.html?tag=time-spent-display&site=www.facebook.com`](chrome-extension://lofmnmocmjaifdldockcnobclclaecmn/index.html?tag=time-spent-display&site=www.facebook.com)

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

Web components built using the [Polymer](https://www.polymer-project.org/) framework can be used in extension option pages, but not in content scripts. (The reason Polymer cannot be used in content scripts is because content scripts cannot include [HTML imports](http://www.html5rocks.com/en/tutorials/webcomponents/imports/), which is used by Polymer).

### Adding a Polymer component

A Polymer component can be added by first adding 2 files under [`src/components`](https://github.com/habitlab/habitlab-chrome/tree/master/src/components) : a `.html` file (example: [`site-goal-view.html`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components/site-goal-view.html)), and a `.ls` ([Livescript](http://livescript.net/)) or `.js` (Javascript) file (example: [`site-goal-view.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components/site-goal-view.ls))

Then, edit the file [`src/components/components.html`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components/components.html) and add the path of the `.html` file relative to the [`src/components`](https://github.com/habitlab/habitlab-chrome/tree/master/src) directory.

Note that you should not directly use `document.querySelector` or `$` or `once_available` in the context of a Polymer component, as these break the [Shadow DOM](https://www.polymer-project.org/1.0/docs/devguide/local-dom). Instead, use the `this.S` (takes a pattern and returns a jQuery object of the first match), `this.SM` (takes a pattern and returns a jQuery object of all matches, equivalent of `$`), `this.$$` (takes a pattern and returns the first match as a DOM element, equivalent of `document.querySelector`), `this.$$$` (takes a pattern and returns all matching DOM elements, equivalent of `document.querySelectorAll`), and `this.once_available` methods, which are defined in [`libs_frontend/polymer_methods.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/libs_frontend/polymer_methods.ls) (note that you will need to import these methods by passing a second parameter to the [`polymer_ext`](https://github.com/habitlab/habitlab-chrome/blob/master/src/libs_frontend/polymer_utils.ls) function). The usage of the `this.S` and `this.once_available` methods is illustrated in [`options-view.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components/options-view.ls).

If you need to do iterations, use a [template](https://www.polymer-project.org/1.0/docs/devguide/templates). Refer to [`options-goals.html`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components/options-goals.html) for an example.

### Previewing Polymer components

You can preview your component by visiting the URL [`index.html?tag=site-goal-view`](chrome-extension://lofmnmocmjaifdldockcnobclclaecmn/index.html?tag=site-goal-view) substituting `site-goal-view` with the tag name registered by your Polymer component. (If the above link does not work, go to [chrome://extensions](chrome://extensions) and click the options page for HabitLab, and substitute the `index.html?tag=options-view` portion with the above string).

If your component has properties (ie, the `site` property in [`site-goal-view.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components/site-goal-view.ls)), you can pass them as URL parameters, such as [`index.html?tag=site-goal-view&site=youtube`](chrome-extension://lofmnmocmjaifdldockcnobclclaecmn/index.html?tag=site-goal-view&site=youtube)

### Using a Polymer component in an extension options page

Refer to [`site-goal-view.html`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components/site-goal-view.html) for an example.
