
  ( function () {
    Polymer({
      is: 'star-rating',
      properties: {
        /**
         * stars: default number of stars to show
         * @type {Number}
         */
        stars: {
          type: Number,
          value: 5
        },
        /**
         * icon: the icon to use. Options: 'star' (defualt), 'heart', 'face'
         * @type {String}
         */
        icon: {
          type: String,
          value: 'star'
        },
        /**
         * customCharIcon: custom Unicode character to be used to create icons (e.g. 'Ω'). It supresses icon attribute //TODO: works when set in JS doesn't work when it is * set in html tag (see demo.html). Neitehr works unicode codes.
         * @type {String}
         */
        customcharicon: {
          type: String,
          value: null,
          notify: true
        },
        /**
         * rate: numbers of star selected
         * @type {Number}
         */
        rate: {
          type: Number,
          value: 0,
          reflectToAttribute: true,
          notify: true
        },
        showtotals: {
          type: Boolean,
          value: false,
          notify: true
        },
        readonly: {
          type: Boolean,
          value: false
        },
        currentStars: {
          type: Object,
          value: []
        },
      },

       ready: function() {
        this.currentStars = [];
        for (var i = this.stars - 1; i >= 0; i--) {
          this.currentStars.push(i+1);
        };
      },
      isCustom: function() {
          return this.customcharicon;
      },
      isStar: function(icon) {
        return icon == 'star' && this.customcharicon == null;
      },
      isHeart: function(icon) {
        return icon == 'heart' && self.customcharicon == null;
      },
      isFace: function(icon) {
        return icon == 'face' && this.customcharicon == null;
      },
      isActive: function(index, rate) {
        if ((index - this.stars) * -1 == rate) {
          return "active";
        }
      },
      withTotal: function(showtotals) {
        return showtotals;
      },
      _setRate: function(e) {
      var deep = Polymer.dom(this.root);
        if(!this.readonly){
          var index = e.model.index;
          var indexOld = (this.rate * -1) + this.stars;
          this.rate = (index - this.stars) * -1;
          if (indexOld < this.stars) {
            deep.querySelector('[data-index="'+ indexOld +'"]').classList.remove("active");
          }
          deep.querySelector('[data-index="'+ index +'"]').classList.add("active");
        }
      }
    });
   })();
