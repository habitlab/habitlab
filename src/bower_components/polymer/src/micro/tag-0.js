

  Polymer.Base._addFeature({

    _prepIs: function() {
      if (!this.is) {
        var module =
          (document._currentScript || document.currentScript).parentNode;
        if (module.localName === 'dom-module') {
          var id = module.id || module.getAttribute('name')
            || module.getAttribute('is');
          this.is = id;
        }
      }
      if (this.is) {
        this.is = this.is.toLowerCase();
      }
    }

  });

