
    Polymer({

      is: 'chart-bar',

      behaviors: [
        Polymer.IronResizableBehavior,
        ChartBehaviors.ChartPropertyBehavior,
        ChartBehaviors.ContextBehavior,
        ChartBehaviors.ResizeBehavior
      ],

      ready: function() {
        this._setType('bar');
      }

    });
  