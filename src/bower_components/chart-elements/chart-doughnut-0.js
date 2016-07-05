
    Polymer({

      is: 'chart-doughnut',

      behaviors: [
        Polymer.IronResizableBehavior,
        ChartBehaviors.ChartPropertyBehavior,
        ChartBehaviors.ContextBehavior,
        ChartBehaviors.ResizeBehavior
      ],

      ready: function() {
        this._setType('doughnut');
      }


    });
  