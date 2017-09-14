paper-time-picker
==========
Material Design time picker, compatible with *Polymer 1.0*

Provides a responsive time picker based on the material design spec. This
component aims to be a clone of the time picker introduced in Android Lollipop.

![wide picker screenshot][wide] ![narrow picker screenshot][narrow]

See the [component page](http://bendavis78.github.io/paper-time-picker/) for
full documentation.

## Examples:

Default picker:

```html
<paper-time-picker></paper-time-picker>
```

Setting the initial time to 4:20pm (note that hours given as 24-hour):

```html
<paper-time-picker time="4:20pm"></paper-time-picker>
```

If you include this element as part of `paper-dialog`, use the class
`"paper-time-picker-dialog"` on the dialog in order to give it proper styling.

```html
<paper-dialog id="dialog" modal class="paper-time-picker-dialog"
  on-iron-overlay-closed="dismissDialog">
  <paper-time-picker id="timePicker" time="[[time]]"></paper-time-picker>
  <div class="buttons">
    <paper-button dialog-dismiss>Cancel</paper-button>
    <paper-button dialog-confirm>OK</paper-button>
  </div>
</paper-dialog>
```

# Reporting Bugs

When filing a bug report, please provide an example of how to repoduce using
plunker, jsbin, jsfiddle, etc. You can use the following plunker as a starting
point: http://plnkr.co/edit/gVQluG0GrFP3RzCPZPIi

---

If you find this component useful, please show your support by donating to
[Bold Idea](http://boldidea.org). Click the button below!

[![ideaSpark campaign button][donate]](https://donorbox.org/bold-idea-make-ideaspark-possible-for-dallas-area-students)

[wide]: http://i.imgur.com/kosRJrF.png
[narrow]: http://i.imgur.com/s3honuG.png
[donate]: http://www.boldidea.org/donate-badge-md-1.png
