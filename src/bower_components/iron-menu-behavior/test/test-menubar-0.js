

(function() {

  Polymer({

    is: 'test-menubar',

    behaviors: [
      Polymer.IronMenubarBehavior
    ],

    get extraContent() {
      return this.$.extraContent;
    }

  });

})();

