

  Polymer({

    is: 'simple-form',

    extends: 'form',

    properties: {
      formElements: {
        type: Object,
        notify: true
      }
    },

    listeners: {
      'iron-form-element-register': '_elementRegistered',
      'iron-form-element-unregister': '_elementUnregistered'
    },

    ready: function() {
      this.formElements = [];
    },

    _elementRegistered: function(e) {
      this.formElements.push(e.target);
      e.target._parentForm = this;
    },

    _elementUnregistered: function(e) {
      var target = e.detail.target;
      if (target) {
        var index = this.formElements.indexOf(target);
        if (index > -1) {
          this.formElements.splice(index, 1);
        }
      }
    }

  });

