

  Polymer.CaseMap = {

    _caseMap: {},
    _rx: {
      dashToCamel: /-[a-z]/g,
      camelToDash: /([A-Z])/g
    },

    dashToCamelCase: function(dash) {
      return this._caseMap[dash] || (
        this._caseMap[dash] = dash.indexOf('-') < 0 ? dash : dash.replace(this._rx.dashToCamel,
          function(m) {
            return m[1].toUpperCase();
          }
        )
      );
    },

    camelToDashCase: function(camel) {
      return this._caseMap[camel] || (
        this._caseMap[camel] = camel.replace(this._rx.camelToDash, '-$1').toLowerCase()
      );
    }

  };

