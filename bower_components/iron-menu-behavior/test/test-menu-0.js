

(function() {

  Polymer({

    is: 'test-menu',

    behaviors: [
      Polymer.IronMenuBehavior
    ],

    get extraContent() {
      return this.$.extraContent;
    }

  });

})();

