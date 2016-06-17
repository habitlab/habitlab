# jQuery.documentSize

<small>[Usage][usage] – [Why?][why] – [Setup][setup] – [Browser support][browsers] – [Performance][performance] –  [Precision][precision] – [Spec][spec] – [Build and test][build]</small>

Detects the real width and height of the document. And the real width and height of the browser window.

Works cross-browser, and returns the correct result in even the most exotic scenarios. It resolves the [shortcomings of jQuery][why] in that regard. And actually, because jQuery.documentSize is written in pure Javascript, you can use it [without jQuery][setup], too.

If you are a happy user of this project already, you can support its development by [donating to it][donations]. You absolutely don't have to, of course, but perhaps it is something you [might actually want to do][donations].

## Usage

##### Document size

Call `$.documentWidth()` or `$.documentHeight()` to get the results for the global `document`.

For specific documents, e.g. in an embedded iframe or a child window you have access to, pass the document as an argument: `$.documentWidth( myIframe.contentDocument )` or `$.documentHeight( myIframe.contentDocument )`.

##### Window size

Call `$.windowWidth()` or `$.windowHeight()` to get the results for the global `window`. 

###### Size of the visual viewport
 
By default, the size of the [visual viewport][quirksmode-mobile-viewports] is returned. That is the area you actually see in the browser window. The visual viewport responds to pinch zooming on mobile devices, it grows or shrinks as the user zooms in and out. Its size is expressed in CSS pixels.

You can ask for the visual viewport explicitly with the `viewport` option: `$.windowWidth( { viewport: "visual" } )`. You can also use a shorter syntax, `$.windowWidth( "visual" )`, or simply leave out the argument altogether.

###### Size of the layout viewport

Alternatively, you can query the size of the [layout viewport][quirksmode-mobile-viewports]. That is the viewport which mobile browsers use to calculate the layout. They refer to it when evaluating CSS rules like `body { height: 100%; }`. The size of this viewport is also expressed in CSS pixels, but it does not respond to pinch zooming. 

Get it with `$.windowWidth( { viewport: "layout" } )`, or simply with `$.windowWidth( "layout" )`. Likewise for height.

On the **desktop**, there is no distinction between a visual and a layout viewport because desktop browsers don't implement pinch zooming (desktop page zooming is a different beast entirely). In that environment, the `viewport` option is without effect. No matter which option you pass to a desktop browser, it returns the same result.

###### Other windows than the global one

For specific windows, e.g. an embedded iframe or a child window you have access to, pass the window as an argument: `$.windowWidth( myIframe.contentWindow )` or `$.windowHeight( myIframe.contentWindow )`.

If you pass in a viewport preference and a custom window at the same time, the order of the arguments doesn't matter. Call `$.windowWidth( "visual", iframeWindow )`, or `$.windowWidth( iframeWindow, { viewport: "visual" } )`, or any other variation as you wish.

###### Rounding errors and precision

The return value is rounded to integer on most platforms. Fractional CSS pixels cannot be captured that way. It may sound negligible, but sub-pixel precision can actually matter – see the notes on [precision, below][precision], for more.

##### Zoom level

This method is a convenient by-product of the window size calculation. Call `$.pinchZoomFactor()` to get, you guessed it, the pinch zoom factor on a mobile device. 

Values greater than one mean the user has zoomed in and enlarged the content. A factor of less than one stands for zooming out.

The method is all about pinch zooming and does not convey any information about page zoom in a desktop browser.

As with the other methods, you can pass in a custom window: `$.pinchZoomFactor( _window )`. It is unlikely you'll ever need to do it, though.

##### Scroll bar size

Call `$.scrollbarWidth()` to retrieve the size (width) of the scrollbar for a given browser. Again, this is a by-product of the main functionality.

Some browsers don't provide permanent scrollbars, and instead show them as a temporary overlay while scrolling the page. In that case, scroll bar size is reported as 0. Showing zero-width overlays is typical of mobile browsers, and also the default in current versions of OS X.

Watch out, though: `$.scrollbarWidth()` returns a browser-specific constant. It reports how wide the scroll bar is, or would be, if the browser displays it. It does **not** tell you if scroll bars are actually present in the window. For that kind of info, please [refer to the methods][jQuery.isInView-scrollbar] of another component, [jQuery.isInView][].

## What does it do that jQuery doesn't?

##### Document size

You might wonder why you'd even need such a plugin. After all, jQuery can detect the dimensions of the document out of the box, just by calling `$(document).width()` and `$(document).height()`. Right?

Well, yes, but jQuery resorts to guesswork. It queries five properties and simply picks the largest one. That approach works in most cases, but it is not reliable across the board.

- Results are inaccurate in IE < 11 when there is a scroll bar on one axis, but not on the other. jQuery erroneously adds the width of the scroll bar to the document.
- Results are downright unpredictable in Firefox and IE when both the documentElement and the body are set to anything other than `overflow: visible`.

jQuery.documentSize does not have these limitations. Unlike jQuery, it tests the actual behaviour of the browser. Based on that test, it queries the right property for the document dimensions.

##### Window size

Again, `$(window).width()` and `$(window).height()` seem to work so well, and are used so ubiquitously, that a replacement seems absurd. But the jQuery methods are unreliable, to the point of being unusable, on mobile. 

- The jQuery methods are based on the the [layout viewport, rather than the visual viewport][quirksmode-mobile-viewports]. As a result, the numbers don't reflect the zoom state of the mobile browser, nor do they respond to changes of it.
- In iOS, the jQuery methods assume that the browser chrome (URL bar, tabs) is fully visible all the time. In reality, the browser chrome is minimized as soon as the user begins to scroll for the first time. Depending on the device and iOS version, jQuery underreports the window height by 57px, 60px, or 69px whenever that happens, and it happens a lot.

The related [jQuery bug report][jquery-issue-6724] has been around _since 2010 (!)_, along with a [pull request declined][jquery-pr-764] for all the wrong reasons, and is marked as "cantfix".

So yes, indeed, there is a need for `$.windowWidth()` and `$.windowHeight()`. Their results are based on observable browser behaviour, and not – like most other "fixes" for the iOS problem in particular – on browser sniffing. 

## Dependencies and setup

There are no hard dependencies. Despite its name, jQuery.documentSize doesn't even rely on [jQuery][] – it just needs a namespace variable to attach itself to. It will look for jQuery, [Zepto][], or just a simple `$` variable when it is loaded. Include jquery.documentsize.js when your library of choice, or your `$` variable, is ready for use.

The stable version of jQuery.documentSize is available in the `dist` directory ([dev][dist-dev], [prod][dist-prod]), including an AMD build ([dev][dist-amd-dev], [prod][dist-amd-prod]). If you use Bower, fetch the files with `bower install jquery.documentsize`. With npm, it is `npm install jquery.documentsize`.

**In case you don't use jQuery**, there are a few things you should know:

- If you install jQuery.documentSize with Bower or npm, jQuery is downloaded as a dependency (any version, defaults to the latest). Feel free to ignore it and replace it with your own choice.
- If you don't use jQuery or Zepto, you must provide a `$` variable of some sort. It can be another library, or just a plain object.
- If that `$` variable happens to be a function, it will be passed a callback and is expected to run it on DOM-ready.
- If you use the AMD/UMD build of jQuery.documentSize, you must provide a 'jquery' dependency. Fake it as needed ([see example][demo-amd-zepto]).

## Browser support

jQuery.documentSize has been tested with 

- 2015 versions of Chrome, Firefox, Safari, and Opera on the desktop
- IE8+, Edge
- Safari on iOS 8, iOS 9; Chrome and Firefox on Android 5
- PhantomJS, SlimerJS

## Performance

Is there a performance penalty for the added accuracy jQuery.documentSize provides, compared to plain jQuery calls? The answer is twofold, but the short version is "no".

When the component loads, it tests the browser – jQuery doesn't. The test touches the DOM and takes some extra time. How much exactly, depends on browser and platform, but it is negligible. The test usually takes between 5 and 25 milliseconds, even in IE8 and on mobile devices.

Once that is done, jQuery.documentSize is actually faster than the equivalent jQuery call.

## Precision

Like pretty much all native functions related to size, the ones provided here return pixel values as integers, not floats. Fractional pixel values get lost in the process. That doesn't matter on the desktop, but it does on mobile.

###### Window size

The size of the window, aka the [visual viewport][quirksmode-mobile-viewports], is expressed in CSS pixels. When pinch-zooming into a page on a mobile device, that size shrinks. Zooming can stop at any level, and in most cases, the CSS pixels which are visible on screen – now enlarged – don't line up neatly with the window. The boundary of the window cuts right through them. When zooming in, partial pixels along the edges are the norm, not the exception.

In most browsers, `$.windowWidth()` and `$.windowHeight()` return integers only, so you have to put up with rounding errors when the user zooms in. There is no way around it. Browsers simply don't provide the data for a more accurate return value.

The good news is that the **layout viewport** is unaffected, values are precise. For the **visual viewport**, the maximum rounding error is ±1&nbsp;CSS pixel.

###### Document size

The issues around a lack of accuracy do not affect `$.documentWidth()` and `$.documentHeight()`. Their return value is always precise.

The document size is defined in terms of the [layout viewport][quirksmode-mobile-viewports] and therefore unaffected by zooming. Fractional pixel values simply don't occur that way.

## How is the document size defined?

The document width and height are not defined in the spec. But even though the terms are absent, the concept is there. The W3C [refers to it][w3c-docsize] as "the area of the canvas on which the document is rendered". Nothing is said about the size of that area, except that "rendering generally occurs within a finite region of the canvas, established by the user agent".

According to the spec, if the viewport is smaller than that area, "[the user agent should offer a scrolling mechanism][w3c-docsize]". This is the most implicit of definitions, but there you have it: the document size is equal to the area which you can access by scrolling the viewport. In the terminology of Javascript, document width and height are identical to the scrollWidth and scrollHeight of the viewport.

This definition, as well as the description by the W3C, allows us to fill in the details.

- "The canvas on which the document is rendered" is at least as large as the viewport. The viewport sets the minimum width and height of the document, even if the document content does not take up that much space.

- The user agent _should_ offer a scrolling mechanism, but it doesn't have to. If the browser denies you the actual scroll bars to get to some parts of the content, that doesn't shrink the document. In other words, if window scroll bars are suppressed with `overflow: hidden`, the document size is unaffected. This is in line with the behaviour of scrollWidth and scrollHeight for ordinary HTML elements.

- If scrolling is enabled but content is still out of reach, that content does not enlarge the document. Elements positioned out of view, ie above or to the left of the (0,0) coordinate of the viewport, don't matter for the document size.

- It's all about scrolling, but only that of the viewport. When content is tucked away inside a scrolling div, it doesn't expand the document, no matter how large it is.

- The size of the document is not the same as that of the documentElement (root element). If it were, margins set on the documentElement would be ignored, even though they increase the scrollable area. 

  Also, you can style the documentElement in ways which affect its size differently from that of the document. The documentElement can be set to an explicit `width` and `height` while still allowing its content to overflow. It can be positioned absolutely, creating extra space to the top and left which is part of the scrollable area. (I am not suggesting that those a particularly good ideas.) The sizes of document and documentElement are related, but not even strictly linked.

## Build process and tests

If you'd like to fix, customize or otherwise improve jQuery.documentSize: here are your tools.

### Setup

[npm][] and [Bower][] set up the environment for you.

- The only thing you've got to have on your machine is [Node.js]. Download the installer [here][Node.js].
- Open a command prompt in the project directory.
- Run `npm install`. (Creates the environment.)
- Run `bower install`. (Fetches the dependencies of the script.)

Your test and build environment is ready now.

### Running tests, creating a new build

#### Considerations for testing

To run the tests on remote clients (e.g. mobile devices), start a web server with `grunt interactive` and visit `http://[your-host-ip]:9400/web-mocha/` with the client browser. Running the tests in a browser like this takes a _long_ time, so it makes sense to disable the power-save/sleep/auto-lock timeout on the mobile device.

#### Tool chain and commands

The test tool chain: [Grunt][] (task runner), [Karma][] (test runner), [Jasmine][] (test framework). But you don't really need to worry about any of this.

A handful of commands manage everything for you:

- Run the tests in a terminal with `grunt test`.
- Run the tests in a browser interactively, live-reloading the page when the source or the tests change: `grunt interactive`.
- If the live reload bothers you, you can also run the tests in a browser without it: `grunt webtest`.
- Run the linter only with `grunt lint` or `grunt hint`. (The linter is part of `grunt test` as well.)
- Build the dist files (also running tests and linter) with `grunt build`, or just `grunt`.
- Build continuously on every save with `grunt ci`.
- Change the version number throughout the project with `grunt setver --to=1.2.3`. Or just increment the revision with `grunt setver --inc`. (Remember to rebuild the project with `grunt` afterwards.)
- `grunt getver` will quickly tell you which version you are at.

Finally, if need be, you can set up a quick demo page to play with the code. First, edit the files in the `demo` directory. Then display `demo/index.html`, live-reloading your changes to the code or the page, with `grunt demo`. Libraries needed for the demo/playground should go into the Bower dev dependencies, in the project-wide `bower.json`, or else be managed by the dedicated `bower.json` in the demo directory.

_The `grunt interactive` and `grunt demo` commands spin up a web server, opening up the **whole project** to access via http._ So please be aware of the security implications. You can restrict that access to localhost in `Gruntfile.js` if you just use browsers on your machine.

### Changing the tool chain configuration

In case anything about the test and build process needs to be changed, have a look at the following config files:

- `karma.conf.js` (changes to dependencies, additional test frameworks)
- `Gruntfile.js`  (changes to the whole process)
- `web-mocha/_index.html` (changes to dependencies, additional test frameworks)

New test files in the `spec` directory are picked up automatically, no need to edit the configuration for that.

## Facilitating development

To my own surprise, [a kind soul][donations-idea] wanted to donate to the project, but there hadn't been a link. [Now there is.][donations-paypal-link]

Please don't feel obliged in the slightest. The license here is [MIT][license], and so it's free. That said, if you do want to support the maintenance and development of this component, or any of my [other open-source projects][hashchange-projects-overview], I _am_ thankful for your contribution.

Naturally, these things don't pay for themselves – not even remotely. The components I write aim to be well tested, performant, and reliable. These qualities may not seem particularly fascinating, but I put a lot of emphasis on them because they make all the difference in production. They are also rather costly to maintain, time-wise.

That's why donations are welcome, and be it as nod of appreciation to keep spirits up. [Thank you!][donations-paypal-link]

[![Donate with Paypal][donations-paypal-button]][donations-paypal-link]

## Release Notes

### v1.2.3

- Fixed error in IE6, IE7, and other unsupported browsers which fail at test iframe creation (issue #2)
- Prevented IE6, IE7 from crashing when loading the component
- Fixed a rare bug in IE9 where the load event wouldn't fire (issue #3)

### v1.2.2

- Guarded against exceptions in unsupported, broken browsers; added a fallback for document size

### v1.2.0

- Added a `viewport` option and support for the layout viewport to `$.windowWidth()` and `$.windowHeight()`
- Added `$.pinchZoomFactor()`

### v1.1.0

- Added `$.windowWidth()` and `$.windowHeight()`
- Added `$.scrollbarWidth()`

### v1.0.2

- Guarded against inherited display styles for the browser test iframe
- Removed redundant boilerplate from build environment

### v1.0.1

- Added missing copyright notice to Leche test helper
- Fixed minor test suite bugs
- Improved documentation

### v1.0.0

- Added Zepto support
- Made the browser test run on DOM-ready
- Completed documentation
- Added an AMD demo, using Zepto

### v0.2.0

- Removed jQuery version range restriction
- Fixed use with plain `$` variable
- Improved tests
- Added basic documentation

### v.0.1.0

- Initial public release

## License

MIT.

Copyright (c) 2015, 2016 Michael Heim.

Code in the data provider test helper: (c) 2014 Box, Inc., Apache 2.0 license. [See file][data-provider.js].

[dist-dev]: https://raw.github.com/hashchange/jquery.documentsize/master/dist/jquery.documentsize.js "jquery.documentsize.js"
[dist-prod]: https://raw.github.com/hashchange/jquery.documentsize/master/dist/jquery.documentsize.min.js "jquery.documentsize.min.js"
[dist-amd-dev]: https://raw.github.com/hashchange/jquery.documentsize/master/dist/amd/jquery.documentsize.js "jquery.documentsize.js, AMD build"
[dist-amd-prod]: https://raw.github.com/hashchange/jquery.documentsize/master/dist/amd/jquery.documentsize.min.js "jquery.documentsize.min.js, AMD build"

[usage]: #usage "Usage"
[why]: #what-does-it-do-that-jquery-doesnt "What does it do that jQuery doesn't?"
[setup]: #dependencies-and-setup "Dependencies and setup"
[browsers]: #browser-support "Browser support"
[performance]: #performance "Performance"
[precision]: #precision "Precision"
[spec]: #how-is-the-document-size-defined "How is the document size defined?"
[build]: #build-process-and-tests "Build process and tests"

[jQuery]: http://jquery.com/ "jQuery"
[Zepto]: http://zeptojs.com/ "Zepto.js"
[jQuery.isInView]: https://github.com/hashchange/jquery.isinview "jQuery.isInView"
[jQuery.isInView-scrollbar]: https://github.com/hashchange/jquery.isinview#scroll-bar  "jQuery.isInView: Scrollbar-related methods"

[jquery-issue-6724]: http://bugs.jquery.com/ticket/6724 "jQuery Ticket #6724: Wrong $(window).height() in mobile Safari (iPhone)"
[jquery-pr-764]: https://github.com/jquery/jquery/pull/764 "jQuery Pull Request #764: Fixes #6724: Wrong $(window).height() in Mobile Safari"
[quirksmode-mobile-viewports]: http://www.quirksmode.org/mobile/viewports2.html "Quirksmode.org: A tale of two viewports"

[w3c-docsize]: http://www.w3.org/TR/CSS2/visuren.html#viewport "W3C – Visual formatting model, 9.1.1: The viewport"
[demo-amd-zepto]: https://github.com/hashchange/jquery.documentsize/blob/master/demo/amd/require-config.js "Demo: AMD setup with Zepto"

[data-provider.js]: https://github.com/hashchange/jquery.documentsize/blob/master/spec/helpers/data-provider.js "Source code of data-provider.js"

[Node.js]: http://nodejs.org/ "Node.js"
[Bower]: http://bower.io/ "Bower: a package manager for the web"
[npm]: https://npmjs.org/ "npm: Node Packaged Modules"
[Grunt]: http://gruntjs.com/ "Grunt: The JavaScript Task Runner"
[Karma]: http://karma-runner.github.io/ "Karma – Spectacular Test Runner for Javascript"
[Jasmine]: http://jasmine.github.io/ "Jasmine: Behavior-Driven JavaScript"
[JSHint]: http://www.jshint.com/ "JSHint, a JavaScript Code Quality Tool"

[donations]: #facilitating-development "Facilitating development"
[donations-idea]: https://github.com/hashchange/jquery.documentsize/issues/1 "jQuery.documentSize, issue #1: Thank you!"
[donations-paypal-link]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=LVWB87C62TUXU "Donate with Paypal"
[donations-paypal-button]: https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif "Donate with Paypal"
[license]: #license "License"
[hashchange-projects-overview]: http://hashchange.github.io/ "Hacking the front end: Backbone, Marionette, jQuery and the DOM. An overview of open-source projects by @hashchange."
