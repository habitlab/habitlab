
  window.ChartBehaviors = window.ChartBehaviors || {};
  /** @polymerBehavior */
  window.ChartBehaviors.ChartPropertyBehavior = {

    properties: {

      type: {
        type: String,
        readOnly: true,
        value: 'bar',
      },

      chart: {
        notify: true
      },

      data: {
        type: Object,
        value: function () {
          return {};
        }
      },

      options: {
        type: Object,
        value: function () {
          return {};
        }
      },

    },

    observers: [
      '_configurationChanged(data.*, options.*)'
    ],

    _configurationChanged: function(dataRecord, optionsRecord) {
      if (dataRecord.base.labels && dataRecord.base.datasets) {
        this.hasData = true;
      } else {
        this.hasData = false;
      }

      if (this.hasData && this.isAttached) {
        this._queue();
      }
    }

  };
