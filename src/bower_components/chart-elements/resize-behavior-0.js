
  window.ChartBehaviors = window.ChartBehaviors || {};
  /** @polymerBehavior */
  window.ChartBehaviors.ResizeBehavior = {

    listeners: {
      'iron-resize': '_onIronResize'
    },

    // If an iron-resizer changes our size and notifies us
    // check to see if we have a height and if so, recreate
    // the chart
    _onIronResize: function() {
      this._queue();
    },

    // This is a public method the user can call if they've
    // changed our dimensions with CSS.
    resize: function() {
      if (this.chart) {
        this.chart.resize();
        this.chart.render(true);
      }
    }

  };
