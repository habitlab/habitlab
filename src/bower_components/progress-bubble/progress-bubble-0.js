
  Polymer({
    is: 'progress-bubble',

    properties: {
      value: {
        type: Number,
        value: 0
      },
      value2: {
        type: Number,
        value: 0
      },
      max: {
        type: Number,
        value: 100
      },
      strokeWidth: {
        type: Number,
        value: 6
      },
      angle: {
        type: Number,
        value: -90
      },
      angle2: {
        type: Number,
        value: -90
      },
      _cx: {
        type: Number,
        value: 50
      },
      _cy: {
        type: Number,
        value: 50
      },
      _radius: {
        type: Number,
        computed: '_computeRadius(_cx, _cy, strokeWidth)'
      },
      _transform: {
        type: String,
        computed: '_computeTransform(angle, _cx, _cy)'
      },
      _transform2: {
        type: String,
        computed: '_computeTransform2(angle, angle2, _cx, _cy)'
      },
      _dasharray: {
        type: Number,
        computed: '_computeDashArray(_radius)'
      },
      _dashoffset: {
        type: Number,
        computed: '_computeDashOffset(value, max, _dasharray)'
      },
      _dashoffset2: {
        type: Number,
        computed: '_computeDashOffset2(value, value2, max, _dasharray)'
      },
      _endangle1: {
        type: Number,
        computed: '_computeEndAngle1(value, max)'
      },
    },
    _computeEndAngle1: function(value, max) {
      return 360*value/max;
    },
    _computeRadius: function(_cx, _cy, strokeWidth) {
      return Math.max(0, Math.min(_cx, _cy) - strokeWidth / 2);
    },
    _computeDashArray: function(_radius) {
      return 2 * Math.PI * _radius;
    },
    _computeDashOffset: function(value, max, _dasharray) {
      return (1 - value / max) * _dasharray;
    },
    _computeDashOffset2: function(value, value2, max, _dasharray) {
      return (1 - value2 / max) * _dasharray;
    },
    _computeTransform: function(angle, _cx, _cy) {
      return 'rotate(' + angle + ', ' + _cx + ', ' + _cy + ')';
    },
    _computeTransform2: function(angle, _endangle1, _cx, _cy) {
      return 'rotate(' + (angle) + ', ' + _cx + ', ' + _cy + ')';
    },
    redraw: function() {
      this._cx = this.clientWidth / 2;
      this._cy = this.clientHeight / 2;

      // Keep the content invisible before first calculation is done.
      this.classList.add('calculation-ready');
    },
    ready: function() {
      // Must use this.async in order to have clientWidth/clientHeight available.
      //this.async(this.redraw, 100);
      this.redraw()
      this.async(function() {
        this.$.svgCircle.style.display = ''
        if (this.value2 != 0) {
          this.$.svgCircle2.style.display = ''
        }
      }, 100)
      //
    },
    attributeChanged: function() {
      this.redraw();
    }
  });
