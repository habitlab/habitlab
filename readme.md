# habitlab-chrome

This is the Chrome extension for HabitLab

## Install

Ensure that you have [git](https://git-scm.com/) and [nodejs](https://nodejs.org/en/) (6.2.2 or higher) installed.

```bash
git clone git@github.com:habitlab/habitlab-chrome.git
cd habitlab-chrome
npm install -g gulp-cli karma-cli webpack vulcanize cspify crisper livescript yarn
yarn
gulp
```

Once gulp finishes (leave gulp running in the background; it will keep compiling the code and tell you about errors), you will have the chrome extension built in the `dist` directory.

Next we will sideload the extension. You should sideload the extension onto [Opera](http://www.opera.com/) or [Vivaldi](https://vivaldi.com/) instead of Chrome, as Chrome prompts you to disable sideloaded extensions each time you open it.

You can sideload the extension by going to [chrome://extensions](chrome://extensions), checking `Developer mode`, clicking `Load Unpacked Extension` and selecting the `dist` directory under the `habitlab-chrome` folder.

## Developer Options Page

If you open the developer console (`Command-Option-J` on macOS, or `Control-Shift-J` on Windows) and type `developer_options()` this will take you to the developer options page, which has some configuration options useful for developers. (If using Opera as your browser, enable the `Show URL bar` option on the developer options page).

## Adding an intervention

First add an directory under the [`src/interventions`](https://github.com/habitlab/habitlab-chrome/tree/master/src/interventions) directory. It should contain 2 files: `info.yaml` and `frontend.ls`. Follow [`facebook/remove_news_feed`](https://github.com/habitlab/habitlab-chrome/tree/master/src/interventions/facebook/remove_news_feed) as an example of how these files should look like.

Now run `gulp` and reload the chrome extension. Your goal should now be there on the options page.

### Logging Intervention Impressions

To log impressions (that is, instances of when your intervention has been deployed) that are used in data visualizations on the dashboard, as well as to measure intervention efficacy and user progress, there are several useful methods: log_impression and log_action; examples of these in action can be seen under [`src/interventions/google/logging_example`](https://github.com/habitlab/habitlab-chrome/tree/master/src/interventions/google/logging_example).

These methods, along with a vast library of useful methods for retrieving values from the database, are available in [`src/libs_backend`](https://github.com/habitlab/habitlab-chrome/tree/master/src/libs_backend), [`src/libs_common`](https://github.com/habitlab/habitlab-chrome/tree/master/src/libs_common), and [`src/libs_frontend`](https://github.com/habitlab/habitlab-chrome/tree/master/src/libs_frontend).

## Adding a goal

First, add a directory under the [`src/goals`](https://github.com/habitlab/habitlab-chrome/tree/master/src/goals) directory. It should contain a file `info.yaml` and may contain a file `measurement.ls`. Follow [`facebook/spend_less_time`](https://github.com/habitlab/habitlab-chrome/tree/master/src/interventions/facebook/spend_less_time) as an example of what a goal of the form "spend less time on site X" should look like, and [`duolingo/complete_lesson_each_day`](https://github.com/habitlab/habitlab-chrome/tree/master/src/goals/duolingo/complete_lesson_each_day) as an example of how a goal with a custom measurement function should look like.

Now run `gulp` and reload the chrome extension. Your goal should now be there on the options page.

## Polymer components

[Web components](http://webcomponents.org/) built using the [Polymer](https://www.polymer-project.org/) framework can be used in extension option pages and in content scripts.

### Adding a Polymer component

A Polymer component can be added by first adding 2 files under [`src/components`](https://github.com/habitlab/habitlab-chrome/tree/master/src/components) : a `.html` file (example: [`site-goal-view.html`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components/site-goal-view.html)), and a `.ls` ([Livescript](http://livescript.net/)) or `.js` (Javascript) file (example: [`site-goal-view.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/components/site-goal-view.ls))

Now run `gulp` and reload the chrome extension. Your component should now be usable in interventions.

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

```javascript
require('enable-webcomponents-in-content-scripts')
```

Then, require the Polymer component, and you can then create elements and add them to the body:

```javascript
require('components/hello-world-example.deps')

hello_world_example = $('<hello-world-example>')
$('body').append(hello_world_example)
```

Note that to require the component, you need to require a `.deps.js` file (you can use `.deps` as shorthand). These files are generated using the [`scripts/generate_polymer_dependencies`](https://github.com/habitlab/habitlab-chrome/blob/master/scripts/generate_polymer_dependencies.ls) script from the corresponding `.html` files. The script is run automatically when you run `gulp` (but currently it is not re-run when the `.html` files are changed, so you will have to re-run `gulp` manually if you added new components or new html imports).

See [`google/polymer_example/frontend.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/interventions/google/polymer_example/frontend.ls) for an example of an intervention that uses Polymer components in the content script.

### Using an external Polymer component in a content script

If you add an external polymer component, first ensure you have bower and cspify installed (you may need to run this command with sudo)

```bash
npm install -g bower cspify
```

Then install the component via bower, run cspify, and generate the `.deps.js` file:

```bash
bower install paper-button
cspify
./scripts/generate_polymer_dependencies --bower
```

The last command will generate many errors, you can ignore them. Just verify that the file `bower_components/paper-button/paper-button.deps.js` exists. Now you can include it by adding to your content script:

```javascript
require('enable-webcomponents-in-content-scripts')

require('bower_components/paper-button/paper-button.deps')

paper_button_example = $('<paper-button>Click me</paper-button>')
$('body').append(paper_button_example)
```

## Using External Libraries

You can use any [npm](https://www.npmjs.com/) modules as follows. (This example illustrates usage of the [moment](http://momentjs.com/docs/) package)

1) Install the npm module, and save it (adds the dependency to [`package.json`](https://github.com/habitlab/habitlab-chrome/blob/master/package.json))

```bash
yarn add moment
```

2) Require the module and use it in any of the Javascript or Livescript files:

```javascript
moment = require('moment')
moment().format()
```

## Writing a library for usage in content scripts

Add a file under [`libs_frontend`](https://github.com/habitlab/habitlab-chrome/tree/master/src/libs_frontend) that exports your functions. For an example, see [`libs_frontend/sample_js_lib.js`](https://github.com/habitlab/habitlab-chrome/blob/master/src/libs_frontend/sample_js_lib.js)

Now you can use the exported functions in a content script by doing:

```javascript
const {helloworld} = require('libs_frontend/sample_js_lib')
```

## Exposing background script libraries to content scripts

First, write a library under [`libs_backend`](https://github.com/habitlab/habitlab-chrome/tree/master/src/libs_backend) that takes input parameters and returns a promise with the result. For a simple example, see [`libs_backend/tab_utils.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/libs_backend/tab_utils.ls) and for a more complex example, see [`libs_backend/log_utils.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/libs_backend/log_utils.ls)

Next, for all functions in that library you wish to expose to content scripts, add the function signature to [`libs_common/function_signatures.ls`](https://github.com/habitlab/habitlab-chrome/blob/master/src/libs_common/function_signatures.ls) in the `lib_name_to_func_names_and_signatures` dictionary. For example, the following signatures indicate that within the library named `tab_utils`, the `close_selected_tab` function should take 0 arguments, and within the library named `log_utils`, the `addtolog` function should take 2 arguments (the names of the arguments do not matter).

```javascript
{
  tab_utils: {
    close_selected_tab: []
  },
  log_utils: {
    addtolog: ['name', 'data']
  }
}
```

Now, run `gulp`. It will generate libraries that import the functions from the exposed background library (they will be under `src/generated_libs/libs_frontend` but you do not need to ever look at it).

Now you can use the library in your content scripts as follows (note that all functions are asynchronous and will return a promise).

```javascript
const {close_selected_tab} = require('libs_common/tab_utils')

close_selected_tab().then(function() {
  console.log('finished closing tab')
})
```

See [this commit](https://github.com/habitlab/habitlab-chrome/commit/7d3e512a086cb8f65af51196c46d00ebdd950d77) for a complete example.

## Making jQuery plugins play nicely with each other

Most jQuery plugins modify the global `jQuery` or `$` instance (which is a property of `window`). This is problematic for usage in content scripts, as they share `window` and may therefore overwrite each others' `jQuery` instances, leading to errors related to missing jQuery plugins.

To avoid this, you can modify the jQuery plugin to not use `window.jQuery`, and instead act as a module that exports a function takes an instance of jQuery.

To make these changes to a jQuery plugin, first install the plugin via npm, but do not save it:

```bash
npm install jquery-inview
```

Now move it to the [`src/node_modules_custom`](https://github.com/habitlab/habitlab-chrome/tree/master/src/node_modules_custom) directory and add it via git.

```bash
mv node_modules/jquery-inview src/node_modules_custom/jquery-inview
git add src/node_modules_custom/jquery-inview
git commit -m "added jquery-inview under npm_custom"
```

Now modify the jquery plugin code itself to make it into a CommonJS module that exports a function takes an instance of jQuery. See [this commit](https://github.com/habitlab/habitlab-chrome/commit/39fd42e9e88a6065edca0f4c2219bf47abd26ad6) for an example

```javascript
/* OLD. jquery plugin attaches to the global window.jQuery (BAD) */
jQuery.someplugin = function() { /* plugin code goes here */ }
```

```javascript
/* NEW. jquery plugin is a module exporting a function that takes jQuery as an argument */
module.exports = function(jQuery) {
  var $ = jQuery;
  jQuery.someplugin = function() { /* plugin code goes here */ }
}
```

Now, you can use the jQuery plugin within your content script as follows:

```javascript
$ = require('jquery')
require('jquery-inview')($)
```

## Troubleshooting

### Build Errors

Did you recently do a `git pull`, or modified a file, and have errors along the lines of `module not found`? Make sure:

1) All npm modules are installed:

```bash
yarn
```

2) All files are building correctly:

```bash
gulp
```

3) Should not be necessary, but running gulp clean might help:

```bash
gulp clean
gulp
```

## Notes

### Optimizing file sizes

To make a release (which will minify the files), run

```bash
gulp build_release
```

To analyze the size of an individual intervention, first install webpack-bundle-size-analyzer

```bash
npm install -g webpack-bundle-size-analyzer
```

Now run webpack-bundle-size-analyzer on the intervention

```bash
webpack --config ./webpack_config_frontend.ls --json src/interventions/facebook/block_after_interval_daily/frontend.js bundle.js | webpack-bundle-size-analyzer
```

### Making a release

Run the command

```bash
gulp release
```

It will increment the version number in `src/manifest.yaml` to be above the currently publisehd version, will make a clean build, and output a zip file in `releases` which can be uploaded to the Chrome Web Store.
