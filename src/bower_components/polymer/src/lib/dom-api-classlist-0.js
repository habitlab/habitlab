

(function() {
  'use strict';

  var DomApi = Polymer.DomApi.ctor;

  var useShadow = Polymer.Settings.useShadow;

  /**
   * DomApi.classList allows maniuplation of `classList` compatible with 
   * Polymer.dom. The general usage is 
   * `Polymer.dom(node).classList.method(arguments)` where methods and arguments
   * match native DOM.
   */
  Object.defineProperty(DomApi.prototype, 'classList', {
    get: function() {
      if (!this._classList) {
        this._classList = new DomApi.ClassList(this);
      }
      return this._classList;
    },
    configurable: true
  });

  DomApi.ClassList = function(host) {
    this.domApi = host;
    this.node = host.node;
  }

  DomApi.ClassList.prototype = {

    add: function() {
      this.node.classList.add.apply(this.node.classList, arguments);
      this._distributeParent();
    },

    remove: function() {
      this.node.classList.remove.apply(this.node.classList, arguments);
      this._distributeParent();
    },

    toggle: function() {
      this.node.classList.toggle.apply(this.node.classList, arguments);
      this._distributeParent();
    },

    _distributeParent: function() {
      if (!useShadow) {
        this.domApi._maybeDistributeParent();
      }
    },

    contains: function() {
      return this.node.classList.contains.apply(this.node.classList,
        arguments);
    }
  }

})();
