# jQuery.isInView

<small>[Setup][setup] – [Example: Lazy loading][example] – [API][api] – [Browser support][browsers] – [Limitations][limitations] – [Performance tips][perftips] – [Build and test][build]</small>

This jQuery plugin tells you if elements are in view inside a scrollable container, or inside a container hiding its overflow. It works with respect to the viewport, iframes, or other scrollable elements.

**What sets jQuery.isInView apart?**

A whole lot of other components aim to do the same job as jQuery.isInView. Most are a bit more lightweight, in terms of file size. They are good choices if you need to check just a few elements, and just occasionally, when timing is not critical.

The main advantage of jQuery.isInView over them is speed. The methods of the plugin are optimized for performance and do their job faster, by orders of magnitude, than any other component I have been able to find (see this [live performance test][perftest-jsbin]). To give you an idea, filtering 1000 elements takes no more than 3ms on an elderly desktop running Chrome, and about 9ms on an underpowered mobile device.

As a result, jQuery.isInView is suitable for event handlers which are called frequently – scroll and resize handlers, for instance –, and it can deal with large numbers of elements.

**Core methods**

You can choose between different ways to figure out which elements [are in view][api-core]. The plugin gives you [filters][] like `$elems.inView()`. You get an [`:inViewport` selector][api-selector], too. Or you can use [boolean queries][boolean-queries], such as [`$elem.isInView()`][api-fn.isInView].

**Useful helpers**

jQuery.isInView exposes a number of [useful helper functions][api-helpers] which are valuable in their own right. One is [`$elem.hasScrollbar()`][api-fn.hasScrollbar]. You also get [`$elem.scrollbarWidth()`][api-fn.scrollbarWidth], telling you about the space taken up by scroll bars inside a given element. Finally, there is [`$elem.ownerWindow()`][api-fn.ownerWindow], which is helpful for operations in iframes and child windows.

(If you think the API is a bit too prolific for your taste, feel free to overwrite any part of it with your own jQuery extensions. Each plugin method is independent of the others, at least with regard to the public API.)

**Tests**

Browsers are a moving target for development, and they are full of quirks, too. In this environment, the plugin needs to prove that it works. It comes along with a massive [test suite][tests], auto-generated from diverse scenarios and a carefully crafted set of base tests. [Performance tests][perftests] are also part of the package.

**Example and Demo**

There is an interactive demo at [JS Bin][demo-jsbin] or [Codepen][demo-codepen] which you can play with. Or explore the [lazy-loading example, below][example].

**Other**

If you are a happy user of this project already, you can support its development by [donating to it][donations]. You absolutely don't have to, of course, but perhaps it is something you [might actually want to do][donations].

## Dependencies and setup

jQuery.isInView depends on [jQuery][] and [jQuery.documentSize][]. They must be ready for use when jquery.isinview.js is loaded.

The stable version of jQuery.isInView is available in the `dist` directory ([dev][dist-dev], [prod][dist-prod]), including an AMD build ([dev][dist-amd-dev], [prod][dist-amd-prod]). If you use Bower, fetch the files with `bower install jquery.isinview`. With npm, it is `npm install jquery.isinview`.

## Usage by example: Lazy loading

Suppose you want to lazy-load images as soon as they are scrolled into view. You already have `<img>` tags for those images, but their `src` attribute hasn't been set, keeping the assets from loading. The URL for each image is stored in a `data-url` attribute of the `<img>` tag.

Now we implement a scroll handler, which loads each image as soon as it appears on screen. (Of course, we [must throttle][throttled-scroll] the calls. To keep things simple, we just use [_.throttle][Underscore.throttle] from the [Underscore][] library, which does the job just fine.)

### A rough draft

Our first iteration results in the following code:

```javascript
var $scrollable = $( window ),
    $images = $( ".imageContainer img" )
        .width( 200 ).height( 100 ),            // see (*)
    
    loader = function () {
        var loaded = [];
        $images
            .inViewport()                       // jQuery.isInView filter
            .each( function () { 
                this.src = $( this ).data( "url" );
                loaded.push( this );
            } );
        $images = $images.not( loaded );
    };

$scrollable.scroll( _.throttle( loader, 100 ) );
loader();                                       // see (**)
```

Here, we use [`$images.inViewport()`][api-fn.inViewport] to filter the images and grab those which are already on screen. Only then do we load the actual image assets. But that is too late.

### Timely loading

Let's improve our code and load images when they are within 400px of the viewport. For that, we modify the [`.inViewport()` filter][api-fn.inViewport] with the [`tolerance` option][api-options.tolerance]: `$images.inViewport( { tolerance: 400 } )`. Done!

Next, we should ask ourselves what "in view" means, exactly. When we say that "an element" is "in view", do we talk about the element as a whole, or is part of it enough? And does it include padding and border? 

For jQuery.isInView, an element is considered to be "in view" when it is completely visible: its content box, padding, and border, every tiny bit of it. But we can change that. Perhaps we decide that images should load as soon as they begin to move into the tolerance zone, even if only partially. For that, there is the [`partially` option][api-options.partially]: `$images.inViewport( { partially: true, tolerance: 400 } )`.

In addition, we could be more focused and declare that we only care about the content area, and not about the padding or border of an element. The option [`box: "content-box"`][api-options.box] would flip that particular switch. For lazy loading, however, being that specific does not make sense, so we leave the option at its default value, `"border-box"`.

### Flexible container

Now, imagine that we don't want to scroll the viewport for some reason, and scroll our container div, `.imageContainer`, instead. So we redefine `$scrollable = $( ".imageContainer" )` in the snippet above. We also set it to `overflow: auto` in the CSS. 

But what else do we need to change? We can no longer use `.inViewport()`, as its name suggests. So we replace it with the more flexible [`.inView()` method][api-fn.inView]. It accepts two arguments: the container (`$scrollable` in our case), and the options we have chosen above. Here is our final filter, then: `$images.inView( $scrollable, { partially: true, tolerance: 400 } )`. It also works for our initial scenario, where `$scrollable` is a window.

That's it. This short example should leave you with a pretty good understanding of what jQuery.isInView can do. And as a bonus, the final version is not just some contrived code you'd never use in real life, but rather an efficient, production-ready way to do lazy loading.

Coming up next: a more formal description, more methods, and the fine print. The API section.

<small>_(*) We must assign a width and height to the image tags. Without explicit dimensions, they would not occupy any space in the document and fit into the viewport all at once. As a result, the images would all be loaded immediately, defeating the purpose._</small>

<small>_(**) We want the first batch of images to appear without scrolling, so we need to call the loader directly once._</small>

## API

### Core

The primary purpose of jQuery.isInView is to tell you whether or not an element is "in view" – inside the viewport, or otherwise.

#### Filters

These methods operate on a jQuery collection and reduce it to those elements which are in view.

##### .inView( [container] [, options] )

_Returns: jQuery_

Acts as a filter and returns those elements in the collection which are in view inside the viewport, or inside another container.

The container can be a window, iframe, scrollable element (`overflow: scroll` or `overflow: auto`), an element with `overflow: hidden`, or a selector for any of these. A jQuery object or a plain DOM object are equally acceptable. The container defaults to the window containing the elements.

The size of an element is defined by its border-box, which includes its padding and border. Alternatively, the content-box of the element [can be used][api-options.box], excluding padding and borders.

Accepts the [options for core queries][api-options].

##### .inViewport( [options] )

_Returns: jQuery_

Acts as a filter and returns those elements in the collection which are in view inside the window. Shorthand for `$elem.inView( $elem.ownerWindow(), options )`.

Accepts the [options for core queries][api-options].

##### :inViewport selector

Selects all elements which are in view inside the window. Equivalent to calling `.inViewport()` on a jQuery collection.

Does not accept options.

#### Boolean queries

These methods operate on a single element and return whether or not a given element is in view.

##### .isInView( [container] [, options] )

_Returns: boolean_

Returns true if the element is in view inside the viewport, or inside another container. Examines the first element in a jQuery collection.

The container can be a window, iframe, scrollable element (`overflow: scroll` or `overflow: auto`), an element with `overflow: hidden`, or a selector for any of these. A jQuery object or a plain DOM object are equally acceptable. The container defaults to the window containing the element.

The size of an element is defined by its border-box, which includes its padding and border. Alternatively, the content-box of the element [can be used][api-options.box], excluding padding and borders.

Accepts the [options for core queries][api-options].

##### .isInViewport( [options] )

_Returns: boolean_

Returns true if the element is in view inside the window. Examines the first element in a jQuery collection. Shorthand for `$elem.isInView( $elem.ownerWindow(), options )`.

Accepts the [options for core queries][api-options].

#### Options

The following options are shared by all core methods of jQuery.isInView.

##### options.partially

_Type: boolean, default: false_

If set to true, elements which are just partially inside the container are deemed to be "in view", too. By default, an element must be in full view in order to be included.

##### options.box

_Type: string, default: "border-box", alternative: "content-box"_

By default, an element is defined by its border-box and considered to be "in view" if its border, padding, and content area are inside the container. With the `box` option set to `"content-box"`, borders and padding are ignored – only the content area determines if an element is in or out of view.

Please be aware that the `"content-box"` option requires additional DOM queries for every element in a jQuery set, and therefore makes filtering a lot slower. See the [performance tips below][perftips].

##### options.excludeHidden

_Type: boolean, default: false_

If set to true, only elements which take up visible space in the document can be "in view". Elements hidden with `display: none`, or have a size of zero, are "not in view" regardless of their position. 

By default, elements without dimensions on screen can be "in view" if their location is inside the container. (Somewhat counter-intuitively, this is also [a little faster to check][perftips].) 

##### options.tolerance

_Type: number or string, default: 0_

Extends the area in which an element is considered to be "in view". That zone is enlarged by the specified amount on each side of the container. Conversely, a negative value "shrinks" the zone, making it smaller than the container.

The value can either be passed as a number, which is taken to mean "px", or with a unit ("px" or "%" only).

##### options.direction

_Type: string, default: "both", other values: "horizontal", "vertical"_

Restricts a query or filter to a single dimension: `"horizontal"` or `"vertical"`. When evaluating whether or not an element is in view, only that dimension is taken into account.

### Helpers

By necessity, jQuery.isInView has to deal with scroll bars a lot. It also operates in windows other than the global one. A few utilities have come out of this.

#### Scroll bar

##### .hasScrollbar( [axis] )

_Returns: number or object (or undefined)_

Checks if an element has a scroll bar. The axis can be specified as `"horizontal"`, `"vertical"`, or `"both"`. Both axes are checked by default.

The return type depends on whether one or both axes are queried. For a single axis, the method returns a boolean. For both axes, it returns an object with the state of each individual axis, e.g. `{ vertical: true, horizontal: false }`.

Only acts on the first element of a jQuery collection. Returns undefined if the collection is empty.

The `.hasScrollbar` method can be called on any sort of item a jQuery collection can hold. It attempts to convert the item intelligently into a sensible target for a scroll bar query if possible. Specifically,

- when called on a window, document, or document element (`<html>` tag), `.hasScrollbar()` looks for window scroll bars
- when called on an iframe element, `.hasScrollbar()` looks for scroll bars on the content window of the iframe
- when called on the body, `.hasScrollbar()` looks for scroll bars on the body tag itself (!). That's because in exotic scenarios, the body _can_ have scroll bars of its own. Usually, there aren't any – if you want to find out about window scroll bars, don't call `.hasScrollbar()` on the body.

Please be aware that the method checks for the presence of a scroll bar and nothing else. It doesn't mean that the scroll bar actually scrolls, or takes up any space in the document:

- It always returns true for elements set to `overflow: scroll`. That is because scroll bars appear even if an element doesn't contain content which needs to be scrolled.
- It returns true if there is a scroll bar of width 0, which is the standard behaviour of Safari on the Mac and on iOS.

##### .scrollbarWidth( [axis] )

_Returns: number or object (or undefined)_

Returns the effective size (width) of a scrollbar on the element, in pixels, as a number without unit. The axis can be specified as `"horizontal"`, `"vertical"`, or `"both"`. Both axes are queried by default.

The return type depends on whether one or both axes are queried. For a single axis, the method returns a number. For both axes, it returns an object with the size of each individual scroll bar, e.g. `{ vertical: 17, horizontal: 0 }`.

For a given axis, the method returns the value of [`$.scrollbarWidth()`][jQuery.documentSize-scrollbarWidth], a browser constant, if there is a scroll bar, and 0 if there isn't. It does not handle custom scroll bars, and expects the default scroll bars of the browser to appear.

Only acts on the first element of a jQuery collection. Returns undefined if the collection is empty.

Please be aware that the method does not allow you to infer the presence of a scroll bar, or whether it actually scrolls:

- It always returns the default scroll bar width for elements set to `overflow: scroll`. That is because scroll bars appear even if an element doesn't contain content which needs to be scrolled.
- It returns 0 if there is no scroll bar, but also if there _is_ a scroll bar of width 0, which is the standard behaviour of Safari on the Mac and on iOS.

For the type of elements the method can be called on, and how they are handled, see [`.hasScrollbar()`, above][api-fn.hasScrollbar].

#### Other

##### .ownerWindow()

_Returns: Window (or undefined)_

Returns the window containing the element. Examines the first element in a jQuery collection. 

If the "element" is a window, `.ownerWindow()` returns the window itself. If there aren't any elements in the jQuery collection, `.ownerWindow()` returns undefined.

If the element is inside an iframe, `.ownerWindow()` returns the window representing the iframe. However, if the element _is_ the iframe, `.ownerWindow()` returns the window containing the iframe (the global `window`, usually).

(Please keep in mind that selecting elements inside an iframe, from code running in the context of the global window, is subject to cross-domain security restrictions and does not always work.)

## Browser support

jQuery.isInView has been tested with 

- 2015, 2016 versions of Chrome, Firefox, Safari, and Opera on the desktop
- IE9+, Edge
- Safari on iOS 8, iOS9; Chrome and Firefox on Android 5
- PhantomJS, SlimerJS

The plugin is not formally tested in IE8 (due to a limitation of the test suite), and for that reason, IE8 is not supported. That said, it appears to work there, too. Your mileage may vary – if you still have to support IE8, go ahead and use it, but keep your eyes open.

Feel free to [run the test suite][tests] on other devices. Feedback is welcome, about successful tests as well as failing ones.

## Limitations

 jQuery.isInView examines whether elements are in or out of view with regard to an _area_, defined by a container. From that perspective, elements only ever drop out of view because they overflow their container. But there are other ways elements can be obscured – and they are not captured by jQuery.isInView.

- No consideration of stacking:

  Positioning can lead to an item being placed on top of another. Floating can obscure the background of a non-floated element. Actual visibility is further complicated by opacity. Obscuring elements by stacking others on top of them is conceptually different from moving elements out of view, which is what the plugin deals with, and not taken into account.

- No consideration of clipping and masking:

  Likewise, jQuery.isInView does not account for the effects of clipping and masking, using the deprecated `clip()`, its successor `clip-path()`, or any[ new masking techniques][css-clipping-masking] which may or may not land in the next crop of browsers.

There are also a few limitations with regard to HTML elements and their styles:

- The plugin doesn't support elements with `position: fixed`, or elements inside containers with `position: fixed`.

- Containers must not be rotated with a CSS transform. Scaling is ok. (You can do anything with content, including rotation, that's ok). 

- The `<object>` tag is not supported as a container.

In terms of weird edge cases, there is one for [`.hasScrollbar()`][api-fn.hasScrollbar]. I only mention it for the sake of completeness – you are extremely unlikely to run into it in an actual application. It can only occur in browsers which display scroll bars [of width 0][jQuery.documentSize-scrollbarWidth], like those on iOS and Android. The overflow setting of the documentElement has to be different from the default, `"visible"`. The overflow of the body has to be set to `"auto"`. Then, if you take the unusual step of querying the scroll bars [of the body itself][api-fn.hasScrollbar] (as opposed to the window), `.hasScrollbar()` fails to detect them. That is not a bug, and can't be fixed. It is not possible to detect the presence of scroll bars in these circumstances.

Finally, the plugin doesn't deal with multiple, nested scrolls yet. But it merely isn't aggregating the results for you. You can call it on each individual container and simply chain the results (with `&&` for boolean tests, or filter chaining).

## Performance tips

A few best practices speed up jQuery.isInView calls, and do so by a huge amount. In hot code paths like scroll handlers, they have the potential to make or break your application as a whole. So here goes.

- If you act on multiple elements, use [a filter][filters], not [a boolean query][boolean-queries] in a loop. In other words, don't do this: 
  
  ```javascript
  $content.each( function () {
      if ( $( this ).isInView( $container ) ) { /* ... do stuff */ }    // WRONG!
  } );
  ```
  
  Instead, use the corresponding filter:
  
  ```javascript
  $content.inView( $container ).each( function () {
      // ... do stuff
  } );
  ```
  
  The speed difference can be _huge_. Perhaps you can still get away with using a boolean query in a loop if your container is the `window`. It is five times slower than a filter then, but even that is still blazing fast. If your container is an ordinary HTML element, however, the boolean query slows down the process by a factor of up to 50 (!). In a nutshell: Prefer filters, and you won't go wrong.
  
- The [option `box: "content-box"`][api-options.box] is an expensive choice, _much_ slower than working with the `"border-box"` (which is the default). When performance matters, use it only if you really have to.

- The [option `excludeHidden: true`][api-options.excludeHidden] also has a performance cost, though to a much lesser degree. It is off (false) by default. Leave it off if you can, but don't lose your sleep over it.

## Build process and tests

If you'd like to test, fix, customize or otherwise improve jQuery.isInView: here are your tools.

### Setup

[npm][] and [Bower][] set up the environment for you.

- The only thing you've got to have on your machine is [Node.js]. Download the installer [here][Node.js].
- Open a command prompt in the project directory.
- Run `npm install`. (Creates the environment.)
- Run `bower install`. (Fetches the dependencies of the script.)

Your test and build environment is ready now. If you want to test against specific versions of jQuery, edit `bower.json` first.

### Running tests, creating a new build

#### Considerations for testing

Some tests are executed in a child window (aka pop-up window). Please _disable the pop-up blocker of the browser_ for the domain the tests are run under (usually localhost), or they will fail.

To run the tests on remote clients (e.g. mobile devices), start a web server with `grunt interactive` and visit `http://[your-host-ip]:9400/web-mocha/` with the client browser. Running the tests in a browser like this takes a _long_ time, so it makes sense to disable the power-save/sleep/auto-lock timeout on the mobile device. 

Further, on iOS, you need to guide the tests along. Even with the pop-up blocker disabled, iOS displays a notification each time a child window is opened by a test, and you need to dismiss each notification manually. You have about a minute to hit OK before the related part of the test suite times out. These notifications show up multiple times, so keep an eye on your device until all tests are done.

#### Performance tests

You can examine the performance of jQuery.isInView, and compare it to some other popular plugins which have served as a benchmark during development. Spin up a server with `grunt demo` and navigate to the performance test page, `http://[your-host-ip]:9400/demo/perftest/`.

A live version of the test, showing data of a stable, published build, is available on [JS Bin][perftest-jsbin]. 

#### Tool chain and commands

The test tool chain: [Grunt][] (task runner), [Karma][] (test runner), [Mocha][] (test framework), [Chai][] (assertion library), [Sinon][] (mocking framework). The good news: you don't need to worry about any of this.

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

To my own surprise, [a kind soul][donations-idea] wanted to donate to one of my projects, but there hadn't been a link. [Now there is.][donations-paypal-link]

Please don't feel obliged in the slightest. The license here is [MIT][license], and so it's free. That said, if you do want to support the maintenance and development of this component, or any of my [other open-source projects][hashchange-projects-overview], I _am_ thankful for your contribution.

Naturally, these things don't pay for themselves – not even remotely. The components I write aim to be well tested, performant, and reliable. These qualities may not seem particularly fascinating, but I put a lot of emphasis on them because they make all the difference in production. They are also rather costly to maintain, time-wise.

That's why donations are welcome, and be it as nod of appreciation to keep spirits up. [Thank you!][donations-paypal-link]

[![Donate with Paypal][donations-paypal-button]][donations-paypal-link]

## Release Notes

### v1.0.4

- Updated the jQuery dependency to jQuery 3

### v1.0.2

- Removed $.scrollbarWidth() (now provided by jQuery.documentSize)
- Updated the jQuery.documentSize dependency

### v1.0.1

- Added friendly error message for invalid container param
- Removed redundant project boilerplate
- Improved demo, documentation

### v1.0.0

- Improved caching, especially of container properties
- Improved handling of mixed overflows in $.fn.hasScrollbar()
- Fixed tests for PhantomJS, SlimerJS, IE10
- Added missing copyright notice to Leche test helper

### v0.5.1

- Fixed wrong treatment of container border
- Fixed readme typos

### v0.5.0

- Removed code for document size detection, using jQuery.documentSize instead
- Fixed swapped axes for body query in $.fn.hasScrollbar()
- Refactored $.fn.hasScrollbar
- Fixed $ parameter in IIFE

### v0.4.1

- Made the browser scrollbar width detection run immediately on DOM ready
- Simplified browser scrollbar width detection
- Fixed $(window).hasScrollbar() for IE9
- Fixed tests for IE9

### v0.4.0

- Fixed plugin code for IE8
- Fixed $(window).hasScrollbar() with body overflow: auto, hidden for FF and IE
- Excluded complex hasScrollbar() edge case, when called on body, from handling in some browsers (documented in readme)
- Handled iOS anomaly which ignores overflow-y: hidden for the viewport
- Improved handling of overflow edge cases for viewport and body
- Improved test code, fixed for iOS
- Added an AMD demo
- Fleshed out the readme

### v0.3.0

- Fixed plugin and tests for IE
- Fixed test code for FF
- Added IE, Safari, Opera launchers to test environment
- Fixed various minor bugs

### v0.2.0

- Added box option
- Added $.fn.hasScrollbar, $.fn.scrollbarWidth
- Reorganized plugin, made all tests pass
- Completed core tests, increased test coverage

### v0.1.1

- Fixed custom inViewport selector, switched to current Sizzle API

### v0.1.0

- Initial development, tests, documentation

## License

MIT.

Copyright (c) 2014-2016 Michael Heim.

Code in the data provider test helper: (c) 2014 Box, Inc., Apache 2.0 license. [See file][data-provider.js].

[dist-dev]: https://raw.github.com/hashchange/jquery.isinview/master/dist/jquery.isinview.js "jquery.isinview.js"
[dist-prod]: https://raw.github.com/hashchange/jquery.isinview/master/dist/jquery.isinview.min.js "jquery.isinview.min.js"
[dist-amd-dev]: https://raw.github.com/hashchange/jquery.isinview/master/dist/amd/jquery.isinview.js "jquery.isinview.js, AMD build"
[dist-amd-prod]: https://raw.github.com/hashchange/jquery.isinview/master/dist/amd/jquery.isinview.min.js "jquery.isinview.min.js, AMD build"

[setup]: #dependencies-and-setup "Setup"
[example]: #usage-by-example-lazy-loading "Usage by example: Lazy loading"
[api]: #api "API"
[browsers]: #browser-support "Browser support"
[limitations]: #limitations "Limitations"
[perftips]: #performance-tips "Performance tips"
[build]: #build-process-and-tests "Build process and tests"

[api-core]: #core "API: Core methods"
[filters]: #filters "API: filters"
[api-fn.inView]: #inview-container--options- "API: .inView()"
[api-fn.inViewport]: #inviewport-options- "API: .inViewport()"
[api-selector]: #inviewport-selector "API: :inViewport selector"

[boolean-queries]: #boolean-queries "API: boolean queries"
[api-fn.isInView]: #isinview-container--options- "API: .isInView()"

[api-options]: #options "API: Options for core queries"
[api-options.tolerance]: #optionstolerance "API: 'tolerance' option"
[api-options.partially]: #optionspartially "API: 'partially' option"
[api-options.box]: #optionsbox "API: 'box' option"
[api-options.excludeHidden]: #optionsexcludehidden "API: 'excludeHidden' option"

[api-helpers]: #helpers "API: Helpers"
[api-fn.hasScrollbar]: #hasscrollbar-axis- "API: .hasScrollbar()"
[api-fn.scrollbarWidth]: #scrollbarwidth-axis- "API: .scrollbarWidth()"
[api-fn.ownerWindow]: #ownerwindow "API: .ownerWindow()"

[tests]: #running-tests-creating-a-new-build "Running tests, creating a new build"
[perftests]: #performance-tests "Performance tests"

[jQuery]: http://jquery.com/ "jQuery"
[jQuery.documentSize]: https://github.com/hashchange/jquery.documentsize "jQuery.documentSize"
[Underscore]: http://underscorejs.org/ "Underscore.js"

[demo-jsbin]: http://jsbin.com/legice/6/edit?js,output "jQuery.isInView demo (AMD) – JSBin"
[demo-codepen]: http://codepen.io/hashchange/pen/LVKqPK "jQuery.isInView demo (AMD) – Codepen"
[perftest-jsbin]: http://jsbin.com/lisudi/3 "jQuery.isInView: Performance Test and Comparison (with isInViewport, jquery.visible, jquery_lazyload, hunt) - JS Bin"

[throttled-scroll]: http://ejohn.org/blog/learning-from-twitter/ "John Resig: Learning from Twitter"
[Underscore.throttle]: http://underscorejs.org/#throttle "Underscore.js: _.throttle()"
[css-clipping-masking]: http://css-tricks.com/clipping-masking-css/ "CSS-Tricks: Clipping and Masking in CSS"
[jQuery.documentSize-scrollbarWidth]: https://github.com/hashchange/jquery.documentsize#scroll-bar-size "jQuery.documentSize: $.scrollbarWidth()"

[data-provider.js]: https://github.com/hashchange/jquery.isinview/blob/master/spec/helpers/data-provider.js "Source code of data-provider.js"

[Node.js]: http://nodejs.org/ "Node.js"
[Bower]: http://bower.io/ "Bower: a package manager for the web"
[npm]: https://npmjs.org/ "npm: Node Packaged Modules"
[Grunt]: http://gruntjs.com/ "Grunt: The JavaScript Task Runner"
[Karma]: http://karma-runner.github.io/ "Karma – Spectacular Test Runner for Javascript"
[Mocha]: http://visionmedia.github.io/mocha/ "Mocha – the fun, simple, flexible JavaScript test framework"
[Chai]: http://chaijs.com/ "Chai: a BDD / TDD assertion library"
[Sinon]: http://sinonjs.org/ "Sinon.JS – Versatile standalone test spies, stubs and mocks for JavaScript"
[JSHint]: http://www.jshint.com/ "JSHint, a JavaScript Code Quality Tool"

[donations]: #facilitating-development "Facilitating development"
[donations-idea]: https://github.com/hashchange/jquery.documentsize/issues/1 "jQuery.documentSize, issue #1: Thank you!"
[donations-paypal-link]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=BJY73NCT5YVVY "Donate with Paypal"
[donations-paypal-button]: https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif "Donate with Paypal"
[license]: #license "License"
[hashchange-projects-overview]: http://hashchange.github.io/ "Hacking the front end: Backbone, Marionette, jQuery and the DOM. An overview of open-source projects by @hashchange."