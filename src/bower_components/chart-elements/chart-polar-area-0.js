
    Polymer({

      is: 'chart-polar-area',

      behaviors: [
        Polymer.IronResizableBehavior,
        ChartBehaviors.ChartPropertyBehavior,
        ChartBehaviors.ContextBehavior,
        ChartBehaviors.ResizeBehavior
      ],

      ready: function() {
        this._setType('polarArea');
      }

    });
  