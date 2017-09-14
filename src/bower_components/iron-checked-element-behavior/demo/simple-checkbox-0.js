
    Polymer({

      is: 'simple-checkbox',

      behaviors: [
        Polymer.IronCheckedElementBehavior
      ],

      properties: {
        label: {
          type: String,
          value: 'not validated'
        }
      },

      _onCheckTap: function() {
        this.checked = this.$.checkbox.checked;
      },

      _onClick: function() {
        this.validate();
        this.label = this.invalid ? 'is invalid' : 'is valid';
      }
    });

  