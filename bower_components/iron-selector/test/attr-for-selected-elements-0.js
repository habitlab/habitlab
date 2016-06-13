
    Polymer({
      is: 'attr-reflector',

      properties: {
        someAttr: {
          type: String,
          value: "",
          reflectToAttribute: true
        }
      }
    });
  