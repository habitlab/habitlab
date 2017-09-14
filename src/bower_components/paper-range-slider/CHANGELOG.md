# Changelog

## paper-range-slider 1.0.1 (05/09/2017)

- Upgraded demo page.

## paper-range-slider 1.0.0 (05/09/2017)

- Upgraded for `Polymer 2` compatibility.

## paper-range-slider 0.2.7 (19/04/2017)

- Fixed cursor style for `single-slider` option.

## paper-range-slider 0.2.6 (19/04/2017)

- Changed cursor style.

## paper-range-slider 0.2.5 (01/03/2017)

- Removed extraneous comma from `bower.json`.

- Updated to `paper-slider`, version `1.0.13`.

- Fix for [issue #12](https://github.com/IftachSadeh/paper-range-slider/issues/12).

- Other minor changes.

## paper-range-slider 0.2.4 (22/10/2016)

- As a temporary fix for `paper-slider` version compatibility issues, removed the `paper-slider` dependency by defining a secondary internal `dom-module`.

## paper-range-slider 0.2.3 (12/10/2016)

- Fixed bug with local DOM access of internal elements (related to issue #5 and issue #6).

## paper-range-slider 0.2.2 (10/10/2016)

- Added the `tapValueMove` property (set to `false` by default). If set, tapping the slider will update the selected range, while keeping the same difference between valueMin and valueMax. If set, `tapValueMove` supersedes the `tapValueExtend` and `tapValueReduce` properties.

- Fixed bug with disabled mode.

- Some code clean-up.

## paper-range-slider 0.2.1 (09/10/2016)

- Fixed minor bug for cases where dragging the slider to the very low edge was difficult.

- Fixed minor bug with transition animation.

## paper-range-slider 0.2.0 (08/10/2016)

- Added the `tapValueExtend` and `tapValueReduce` properties. The former (`true` by default) allows to modify the selected range of values, by tapping on the slider below or above the selected range. On the other hand, `tapValueReduce` (`false` by default) allows to modify the selected range of values, by tapping on the slider within the selected range. These two behaviours only apply to tapping events, and are not e.g., relevant for when the user drags the selected range.

- Improved behaviour for touch (increased active area for toggle around knobs).

- Fixed issue #3 (IE11 crash Node.remove() method).

- Fixed issue #5 (Not read property 'style').

- Updated demo page.

## paper-range-slider 0.1.2 (12/09/2016)

- Added a `setDisabled()` function.

- Changed default colors from `--google-blue-700` to `--primary-color`, and fixed general styling to match that of `paper-slider`.

- Added the `single-slider` option, to "revert" the `paper-range-slider` into a `paper-slider`.

- Various small modifications.

## paper-range-slider 0.1.1 (21/06/2016)

- Modified the `_setValueDiff()` function. The `valueDiffMin` and `valueDiffMax` values are now not set by default (which is equivalent to setting either to a negative value). If they remain unset, they are ignored.

## paper-range-slider 0.1.0 (15/06/2016)

- Revamped the way in which the two contained paper-slider elements are made to overlap. There is now no need to explicitly define the `slider-width` property, though this is kept for backward compatibility. One can now define the width of the `paper-range-slider` by setting either `slider-width` or the regular `css` property, e.g,
```html
// recommended method
<paper-range-slider style="width:60%;"></paper-range-slider>
```
or (kept for backward compatibility),
```html
<paper-range-slider slider-width="300px"></paper-range-slider>
```

## paper-range-slider 0.0.10 (9/05/2016)

- Switched from using `let` to using `var` for JavaScript variables, for Safari browser compatibility.

## paper-range-slider 0.0.9 (6/05/2016)

- added `init()` function, which may be used to re-initialize properties, such as the slider-width, after these are dynamically changed.

## paper-range-slider 0.0.8 (28/05/2016)

- Fixed bug with for cases where a user sets a min value for the slider, where the max value is already set lower (or when a max value is set which is smaller than the pre-set min value).

## paper-range-slider 0.0.7 (24/05/2016)

- Added methods `setMin()`, `setMax()`, `setStep()`, `setValueDiffMin()`, and `setValueDiffMax()`.

- Added styling properties (matching the corresponding ones of `paper-slider`): `paper-range-slider-pin-start-color`, `paper-range-slider-knob-start-color` and `paper-range-slider-knob-start-border-color`.

- Fixed bug with the color of the slider for negative values of `valueMin`.

## paper-range-slider 0.0.6 (12/04/2016)

- Bug fix from range-difference settings

## paper-range-slider 0.0.5 (12/04/2016)

- Added the function `setValues()`, which can be used to programmatically set the selected range.
- Several bug fixes.

## paper-range-slider 0.0.4 (12/04/2016)

- Fixed jitter problem when moving knobs by keyboard.

## paper-range-slider 0.0.2/0.0.3 (11/04/2016)

- Fixed bug where the `_inputKeyDown()` function of `paper-slider` was not correctly taken into account.

## paper-range-slider 0.0.1 (11/04/2016)

- Initial version of `paper-range-slider`
