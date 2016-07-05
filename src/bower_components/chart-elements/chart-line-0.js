
    Polymer({

      is: 'chart-line',

      behaviors: [
        Polymer.IronResizableBehavior,
        ChartBehaviors.ChartPropertyBehavior,
        ChartBehaviors.ContextBehavior,
        ChartBehaviors.ResizeBehavior
      ],

      ready: function() {
        this._setType('line');
      }

    });
  