
  ( function () {
    Polymer({
      is: 'l2t-star-rating',
      properties: {
        /**
         * stars: maximum number of stars selectable
         * @type {Number}
         */
        stars: {
          type: Number,
          value: 5
        },
        /**
         * icon: the icon to use (iron-icons)
         * @type {String}
         */
        icon: {
          type: String,
          value: 'star'
        },
        /**
         * rate: numbers of star selected (reflectToAttribute)
         * @type {Number}
         */
        rate: {
          type: Number,
          value: 0,
          reflectToAttribute: true,
          notify: true
        },
        /**
         * readonly: can the rate be modified
         * @type {Boolean}
         */
        readonly: {
          type: Boolean,
          value: false
        },
        /**
         * _currentStars: object for storing stars
         * @type {Object}
         */
        _currentStars: {
          type: Object,
          value: []
        },
      },
      /**
      * Generate stars
      */
      attached: function() {
        this._currentStars=[];
        for(var i=0;i<this.stars;i++)
        this._currentStars.push(i);
      },
      /**
      * Determine if element has preset rating, if so update styles
      */
      _isActive: function(index) {
        if (this.stars - index == this.rate) {
          return "active";
        }
      },
      /**
      * Determine if element is in readonly mode, if not update rate and styles ontap)
      */
      _setRate: function(e) {
        deep = Polymer.dom(this.root);
        if(!this.readonly){
          var index = e.model.index;
          var indexOld = this.stars - this.rate;
          this.rate = this.stars - index;
            if(this.stars - indexOld > 0) {
              deep.querySelector('[data-index="'+ indexOld +'"]').classList.remove("active")
            };
          deep.querySelector('[data-index="'+ index +'"]').classList.add("active");
        }
      }
    });
   })();
