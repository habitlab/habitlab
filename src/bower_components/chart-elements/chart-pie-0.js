
    Polymer({

      is: 'chart-pie',

      behaviors: [
        Polymer.IronResizableBehavior,
        ChartBehaviors.ChartPropertyBehavior,
        ChartBehaviors.ContextBehavior,
        ChartBehaviors.ResizeBehavior
      ],

      ready: function() {
        this._setType('pie');
      }

    });
  