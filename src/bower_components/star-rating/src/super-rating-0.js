
    (function() {
        Polymer({
            is: 'super-rating',
            properties: {

                stars: {
                    type: Number,
                    value: 4
                },
                icon: {
                    type: String,
                    value: 'star'
                },
                customicon: {
                    type: String,
                    value: null,
                    notify: true
                },

                currentStars: {
                    type: Object,
                    value: []
                },
            },

            ready: function() {
                this.currentStars = [];
                for (var i = this.stars - 1; i >= 0; i--) {
                    this.currentStars.push(i + 1);
                };
            },
            isCustom: function() {
                return this.customicon;
            },
            isStar: function(icon) {
                return icon == 'star' && this.customicon == null;
            }
        });
    })();
