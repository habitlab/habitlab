(function () {
  Polymer({
    is: 'l2t-context-menu',
    properties: {
      /**
      * Sting for storing class name
      * of which classes should be listened too
      *
      * @attribute parentclass
      * @type String
      */
      selector: String,
      /** 
      * Boolean for storing value
      * for menu state
      *
      * @attribute opened
      * @type Boolean
      * @default "false"
      */
      opened: {
        type: Boolean,
        value: false,
        notify: true
      },
      target: {
        type: Object,
        value: null,
        notify: true
      }
    },
    /**
    * Method to show the menu
    * updates class and vibrates on phones
    *
    */
    open: function open() {
      if (this.opened === false && 'vibrate' in navigator)
        // Error catcher for IE and Edge
        navigator.vibrate([25]);
      this.opened = true;
    },

    /**
    * Method to hide the menu
    * updates class
    */
    close: function close() {
      this.opened = false;
      this.target = null;
    },

    /**
    * Method to work out to place
    * click event and return boolean
    *
    */
    _parentMatchingSelector: function _parentMatchingSelector(e, selector) {
      if ($(e).is(selector)) return e;
      while (e = e.parentNode) {
        if ($(e).is(selector)) return e;
      }return false;
    },

    /**
    * Method to listen for clicks
    * and pass data on to _parentMatchingSelector
    * hides menu if click is not allowed
    *
    */
    _clickListener: function _clickListener() {
      var _this = this;

      document.addEventListener("click", function (e) {
        if (_this._parentMatchingSelector(e.target, '.menu-trigger') == false && (e.which || e.button) === 1) _this.close();
      });
    },

    /**
    * Method to listen for context menu
    * and pass data on to _parentMatchingSelector
    * shows menu is click is in parentclass
    *
    */
    _contextListener: function _contextListener() {
      var _this2 = this;

      document.addEventListener("contextmenu", function (e) {
        var elem = _this2._parentMatchingSelector(e.target, _this2.selector);
        if (elem) {
          _this2.target = elem;
          e.preventDefault();
          _this2.open();
          _this2._positionMenu(e);
        } else _this2.close();
      });
    },

    /**
    * Method to listen for keyup
    * hides menu is ESC is pressed
    *
    */
    _keyupListener: function _keyupListener() {
      var _this3 = this;

      window.addEventListener('keyup', function (e) {
        return 27 === e.keyCode && _this3.close();
      });
    },

    /**
    * Method to listen for page resize
    * hides menu when actioned
    *
    */
    _resizeListener: function _resizeListener() {
      var _this4 = this;

      window.addEventListener('resize', function (_) {
        return _this4.close();
      });
    },

    /**
    * Method to get mouse position
    * and return x and y values
    *
    */
    _getPosition: function _getPosition(e) {
      return { x: e.clientX, y: e.clientY };
    },

    /**
    * Method to move the menu
    * passes information to _getPosition
    * to get x and y cords, then restyles
    *
    */
    _positionMenu: function _positionMenu(e) {
      var clickCoords = this._getPosition(e),
          menuSelector = this.$['context-menu'],
          menuWidth = menuSelector.offsetWidth + 4,
          menuHeight = menuSelector.offsetHeight + 4,
          windowWidth = window.innerWidth + (clickCoords.x - e.clientX),
          windowHeight = window.innerHeight + (clickCoords.y - e.clientY),
          menuCoordsX = menuWidth > windowWidth - clickCoords.x ? clickCoords.x - menuWidth + "px" : clickCoords.x + "px",
          menuCoordsY = menuHeight > windowHeight - clickCoords.y ? clickCoords.y - menuHeight + "px" : clickCoords.y + "px";
      menuSelector.style.left = menuCoordsX;
      menuSelector.style.top = menuCoordsY;
    },

    /**
    * Method the scripts
    * domReady for when the dom is... rea
    *
    */
    ready: function ready() {
      this._contextListener();
      this._clickListener();
      this._keyupListener();
      this._resizeListener();
    }
  });
})();