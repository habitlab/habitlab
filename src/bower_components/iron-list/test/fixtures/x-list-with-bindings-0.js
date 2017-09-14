
  Polymer({
    is: 'x-list-with-bindings',

    properties: {
      data: {
        type: Array
      },
      propertyForReassignmentForwarding: {
        type: String,
        value:"somePropertyText"
      },
      propertyForPathChangeForwarding: {
        type: Object,
        value: function(){
          return {text:"someSubPropertyText"}
        }
      }
    },

    get list() {
      return this.$.list;
    }
  });
