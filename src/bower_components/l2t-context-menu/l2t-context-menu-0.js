
  ( function () {
    Polymer({
      is: 'l2t-context-menu',
      properties: {
        /**
        * Sting for storing class name
        * of which classes should be listened too
        *
        * @attribute parentclass
        * @type String
        * @default "default"
        */
        parentclass: {
        type: String,
        value: 'default',
        notify: true
        },
        /** 
        * Boolean for storing value
        * for menu state
        *
        * @attribute _menuState
        * @type Boolean
        * @default "false"
        */
        _menuState: {
        type: Boolean,
        value: 'false',
        notify: true
        },
      },
      /**
      * Method to show the menu
      * updates class and vibrates on phones
      *
      */
      _toggleMenuOn: function (){
        1!==this._menuState&&(this._menuState=1,
        Polymer.dom(this.root).querySelector("#context-menu").classList.add('context-menu--active'));
        // Error catcher for IE and Edge
        if (typeof navigator.vibrate === "function") { 
          navigator.vibrate([25])
        }
      },
      /**
      * Method to hide the menu
      * updates class
      *
      */
      _toggleMenuOff: function(){
        0!==this._menuState&&(this._menuState=0,
        Polymer.dom(this.root).querySelector("#context-menu").classList.remove('context-menu--active'))
      },
      /**
      * Method to work out to place
      * click event and return boolean
      *
      */
      _clickInsideElement: function(e,t) {
        var n=e.srcElement||e.target;
        if(n.classList.contains(t))return n;
        for(;n=n.parentNode;)
        if(n.classList&&n.classList.contains(t))return n;
        return!1
      },
      /**
      * Method to listen for clicks
      * and pass data on to _clickInsideElement
      * hides menu if click is not allowed
      *
      */
      _clickListener: function(){
        var $this = this;
        document.addEventListener("click",function(e){
          var t=$this._clickInsideElement(e,'menu-trigger');
          if(!t)
          var n=e.which||e.button;
          1===n&&$this._toggleMenuOff()
        })
      },
      /**
      * Method to listen for context menu
      * and pass data on to _clickInsideElement
      * shows menu is click is in parentclass
      *
      */
      _contextListener: function(){
        var taskItemInContext,
        $this = this;
        document.addEventListener("contextmenu",function(e){
          taskItemInContext=$this._clickInsideElement(e, $this.parentclass),
          taskItemInContext?(e.preventDefault(),$this._toggleMenuOn(),$this._positionMenu(e)):(taskItemInContext=null,$this._toggleMenuOff())
        })
      },
      /**
      * Method to listen for keyup
      * hides menu is ESC is pressed
      *
      */
      _keyupListener: function(){
        var $this = this;
        window.onkeyup=function(e){
          27===e.keyCode&&$this._toggleMenuOff()
        }
      },
      /**
      * Method to listen for page resize
      * hides menu when actioned
      *
      */
      _resizeListener: function(){
        var $this = this;
        window.onresize=function(){
          $this._toggleMenuOff()
        }
      },
      /**
      * Method to get mouse position
      * and return x and y values
      *
      */
      _getPosition: function(e){
        return {x: e.clientX, y: e.clientY};
      },
      /**
      * Method to start all listeners
      * called when the dom is ready
      *
      */
      _listenerInit : function() {
        this._contextListener();
        this._clickListener();
        this._keyupListener();
        this._resizeListener();
      },
      /**
      * Method to move the menu
      * passes information to _getPosition
      * to get x and y cords, then restyles
      *
      */
      _positionMenu: function(e){
        clickCoords = this._getPosition(e),
        menuSelector = Polymer.dom(this.root).querySelector("#context-menu"),
        menuWidth = menuSelector.offsetWidth + 4,
        menuHeight = menuSelector.offsetHeight + 4,
        windowWidth = window.innerWidth + (clickCoords.x - e.clientX),
        windowHeight = window.innerHeight + (clickCoords.y - e.clientY),
        menuCoordsX = menuWidth > windowWidth-clickCoords.x ? clickCoords.x-menuWidth+"px" : clickCoords.x+"px",
        menuCoordsY = menuHeight > windowHeight-clickCoords.y ? clickCoords.y-menuHeight+"px" : clickCoords.y+"px",
        menuSelector.style.left = menuCoordsX,
        menuSelector.style.top = menuCoordsY
      },
      /**
      * Method the scripts
      * domReady for when the dom is... rea
      *
      */
      ready: function() {
        this._listenerInit();
      }
    });
  })();
