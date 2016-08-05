# paper-range-slider - v0.1.1

`paper-range-slider` allows the user to select a range of values within a given (possibly wider) range. values are selected by moving the position of two knobs, or by dragging the selected range of values within the allowed limits. [A demo is provided here](http://IftachSadeh.github.io/paper-range-slider/components/paper-range-slider/demo/). The code was developed using Polymer v1.4.0.

## Bower installation
Do either
```bash
bower install IftachSadeh/paper-range-slider
```
or add the following to your `bower.json`:
```
"dependencies": {
  "paper-range-slider": "git://github.com/IftachSadeh/paper-range-slider"
},
```

## Examples:

### Basic use:
```html
<paper-range-slider></paper-range-slider>
```

### Additional options

- Use `min` and `max` to specify the limits of values for the slider (the lower and upper bounds).
- Use `value-min` and `value-max` to set the initial position of the two knobs (the selected range of values).
- Use `value-diff-min` and `value-diff-max` to set the minimal and maximal allowed difference between the lower and upper selected values.
- Use `always-show-pin` to never hide the pins.
- The following options apply, as for paper-slider: `snaps`, `pin`, `step`.
```html
<paper-range-slider snaps pin step='1' min='0' max='100' value-diff-min="10" value-diff-max="50" value-min='30' value-max='60'></paper-range-slider>
```

- The current position of the knobs (selected range of values) may be accessed by setting up a listener to the `updateValues` event:
```html
<paper-range-slider id='myPaperRangeSliderId'></paper-range-slider>
<script>
    document.querySelector("#myPaperRangeSliderId").addEventListener('updateValues', function (customEvent) {
    console.log(' - current min/max values: ',this.valueMin,this.valueMax)
    });
</script>
```

- One can programmatically set the selected range by e.g., 
```javascript
window.addEventListener('WebComponentsReady', function(e) {
    var myMin = 10, myMax = 90;
    document.querySelector("#myPaperRangeSliderId").setValues(myMin,myMax);
});
```
It is allowed to set `myMin` and/or `myMax` to `null` or to a value outside of the allowed range, in order to ignore them, e.g., use the following to only change the lower value:
```javascript
document.querySelector("#myPaperRangeSliderId").setValues(10,null);
```

- Likewise, one can set the minimal and maximal values of the slider (the lower and upper bounds), the step-size, and the minimal and maximal difference between selected values. These correspond respectively to the following:
```javascript
document.querySelector("#myPaperRangeSliderId").setMin(myMin);
document.querySelector("#myPaperRangeSliderId").setMax(myMax);
document.querySelector("#myPaperRangeSliderId").setStep(myStep);
document.querySelector("#myPaperRangeSliderId").setValueDiffMin(myValueDiffMin);
document.querySelector("#myPaperRangeSliderId").setValueDiffMax(myValueDiffMax);
```

- The above properties which do not have an explicit method, may be reset directly. In order for the changes to take effect properly, use the `init()` method. For instance, to change the `alwaysShowPin` option of an already-defined slider, do:
```javascript
document.querySelector("#myPaperRangeSliderId").alwaysShowPin = true;
document.querySelector("#myPaperRangeSliderId").init();
```


## Styling

The following custom properties are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--paper-range-slider-lower-color` | color for range below selected range | `--paper-grey-400`
`--paper-range-slider-active-color` | color of selected range | `--google-blue-700`
`--paper-range-slider-higher-color` | color for range above selected range | `--paper-grey-400`
`--paper-range-slider-knob-color` | color of knobs | `--google-blue-700`
`--paper-range-slider-pin-color` | color of pins | `--google-blue-700`
`--paper-range-slider-pin-start-color` | The color of the pin at the far left | `--paper-grey-400`
`--paper-range-slider-knob-start-color` | The fill color of the knob at the far left | `transparent`
`--paper-range-slider-knob-start-border-color` | The border color of the knob at the far left | `--paper-grey-400`



---

The license for this code is the The MIT License (MIT), as given in LICENSE.txt.

---
