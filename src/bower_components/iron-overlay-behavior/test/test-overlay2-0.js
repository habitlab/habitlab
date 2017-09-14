

(function() {

  Polymer({

    is: 'test-overlay2',

    behaviors: [
      Polymer.IronOverlayBehavior
    ],

    get _focusableNodes() {
      return [this.$.first, this.$.last];
    }

  });

})();

