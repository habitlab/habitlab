
      Polymer({
        is: 'paper-range-slider',

        behaviors: [
          Polymer.IronRangeBehavior,
        ],

        properties: {
            /**
             * the width of the element in pixels.
             */
            sliderWidth: {
                type: String,
                value: "",
                notify: true,
                reflectToAttribute: true
            },

            /**
             * the minimal value (lower range) of the slider.
             */
            min: {
                type: Number,
                value: 0,
                notify: true,
                reflectToAttribute: true
            },

            /**
             * the maximal value (upper range) of the slider.
             */
            max: {
                type: Number,
                value: 100,
                notify: true,
                reflectToAttribute: true
            },

            /**
             * the current value of the lower range of the slider.
             */
            valueMin: {
                type: Number,
                value: 0,
                notify: true,
                reflectToAttribute: true
            },

            /**
             * the current value of the upper range of the slider.
             */
            valueMax: {
                type: Number,
                value: 100,
                notify: true,
                reflectToAttribute: true
            },

            /**
             * the minimal step-change of a knob on the slider
             */
            step: {
                type: Number,
                value: 1,
                notify: true,
                reflectToAttribute: true
            },

            /**
             * optional minimal value for the difference between valueMin and valueMax
             * by default this is negative (valueDiffMin is ignored)
             */
            valueDiffMin: {
                type: Number,
                value: -1,
                notify: true,
                reflectToAttribute: true
            },

            /**
             * optional maximal value for the difference between valueMin and valueMax
             * by default this is negative (valueDiffMax is ignored)
             */
            valueDiffMax: {
                type: Number,
                value: -1,
                notify: true,
                reflectToAttribute: true
            },

            /**
             * if true, pins with numeric value label are shown when the slider thumb
             * is pressed. Use for settings for which users need to know the exact
             * value of the setting.
             */
            alwaysShowPin: {
              type: Boolean,
              value: false,
              notify: true
            },

            /**
             * if true, pins with numeric value label are shown when the slider thumb
             * is pressed. Use for settings for which users need to know the exact
             * value of the setting.
             */
            pin: {
              type: Boolean,
              value: false,
              notify: true
            },

            /**
             * if true, the slider thumb snaps to tick marks evenly spaced based
             * on the `step` property value.
             */
            snaps: {
              type: Boolean,
              value: false,
              notify: true
            },
        },

        // initial settings
        ready: function() {
            // some initializations
            this.init();

            // set the padding for the parent container
            this.setPadding();

            // setup listeners for updating everything whenever a knob is affected 
            var this_ = this;

            this.$.sliderMin.addEventListener('immediate-value-change', function(customEvent) {
                this_._setValueMinMax(this_._getValuesMinMax(this.immediateValue,null));

                this_.$.sliderMin._expandKnob();
                this_.$.sliderMax._expandKnob();
            });
            
            this.$.sliderMax.addEventListener('immediate-value-change', function(customEvent) {
                // console.log('immed-change..',this.immediateValue,this_.valueMax)
                this_._setValueMinMax(this_._getValuesMinMax(null,this.immediateValue));
            });

            this.$.sliderMin.addEventListener('change', function(customEvent) {
                this_._setValueMinMax(this_._getValuesMinMax(this.immediateValue,null));

                if(this_.alwaysShowPin) {
                    this_.$.sliderMin._expandKnob();
                }
            });
        
            this.$.sliderMax.addEventListener('change', function(customEvent) {
                // console.log('final-change..',this.immediateValue,this_.valueMax)
                this_._setValueMinMax(this_._getValuesMinMax(null,this.immediateValue));

                if(this_.alwaysShowPin) {
                    this_.$.sliderMax._expandKnob();
                }
            });

            return;
        },

        attached: function() {
        },

        // set padding for the element
        setPadding: function() {
            // the creation of the element can never be trusted to derive the offsetHeight
            // (if e.g., it is in a collapsed container). We therefore add a fake element to the
            // DOM to get the basic text-heigh, then we remove this element.
            var beforeEle = document.createElement("div");
            beforeEle.setAttribute("style","position:absolute; top:0px; opacity:0;");
            beforeEle.innerHTML = "invisibleText"; // must have some content
            document.body.insertBefore(beforeEle, document.body.children[0]);
            var height = beforeEle.offsetHeight / 2;  //console.log( 'qqq',beforeEle.offsetHeight)

            this.style.paddingTop    = height+"px"
            this.style.paddingBottom = height+"px"

            beforeEle.remove();
            return;
        },

        // internal variables for minimal/maximal difference between this.valueMin, this.valueMax
        // each one is between zero and the maximal difference available in the range, and
        // the this._valueDiffMin can not be larger than this._valueDiffMax
        _setValueDiff: function() {

            this._valueDiffMax = (this.valueDiffMax > 0) ? this.valueDiffMax : -1;
            this._valueDiffMin = (this.valueDiffMin > 0) ? this.valueDiffMin : -1;
            
            return;
        },

        // get a new set of min/max values, following predefined rules for overlap of the two
        _getValuesMinMax: function(valueMin,valueMax) {
            var hasMin = (valueMin != null && valueMin >= this.min && valueMin <= this.max);
            var hasMax = (valueMax != null && valueMax >= this.min && valueMax <= this.max);

            if(!hasMin && !hasMax) { return [this.valueMin,this.valueMax]; }

            var valueNowMin = hasMin ? valueMin : this.valueMin;
            var valueNowMax = hasMax ? valueMax : this.valueMax;

            valueNowMin = Math.min(Math.max(valueNowMin, this.min), this.max)
            valueNowMax = Math.min(Math.max(valueNowMax, this.min), this.max)

            var diffNow  = valueNowMax - valueNowMin;

            // the anchor is the valueMin if it is explicitly provided
            if(hasMin) {
                if(diffNow < this._valueDiffMin) {
                    valueNowMax = Math.min(this.max, valueNowMin + this._valueDiffMin);
                    diffNow  = valueNowMax - valueNowMin;
                    if(diffNow < this._valueDiffMin) {
                        valueNowMin = valueNowMax - this._valueDiffMin;
                    }
                }
                else if(diffNow > this._valueDiffMax && this._valueDiffMax > 0) {
                    valueNowMax = valueNowMin + this._valueDiffMax;
                }
            }
            // if no valueMin given, decide the anchor is valueMax
            else {
                if(diffNow < this._valueDiffMin) {
                    valueNowMin = Math.max(this.min, valueNowMax - this._valueDiffMin);
                    diffNow  = valueNowMax - valueNowMin;
                    if(diffNow < this._valueDiffMin) {
                        valueNowMax = valueNowMin + this._valueDiffMin;
                    }
                }
                else if(diffNow > this._valueDiffMax && this._valueDiffMax > 0) {
                    valueNowMin = valueNowMax - this._valueDiffMax;
                }
            }

            return [valueNowMin, valueNowMax];
        },

        // set the value of the low edge of the selected range
        _setValueMin: function(value) {
            value = Math.max(value, this.min);
            this.$.sliderMin.value = value;
            this.valueMin          = value;
            
            return;
        },

        // set the value of the high edge of the selected range
        _setValueMax: function(value) {
            value = Math.min(value, this.max);
            this.$.sliderMax.value = value;
            this.valueMax          = value;

            return;
        },

        // set the values of the low/high edges of the selected range and broadcast the change
        _setValueMinMax: function(valuesMinMax) {
            this._setValueMin(valuesMinMax[0]);
            this._setValueMax(valuesMinMax[1]);

            // setting of the div which spans the space between the two knobs
            this._updateDiffDiv();

            // fire to indicate an update of this.valueMin and/or this.valueMax
            this.updateValues();

            return;
        },

        // interface for functions to control the draggable invisible div which
        // spans the distance between the knobs
        _diffDivOnTrack: function(event) {
          event.stopPropagation();
          
          switch (event.detail.state) {
            case 'start':
              this._trackStart(event);
              break;
            case 'track':
              this._trackX(event);
              break;
            case 'end':
              this._trackEnd();
              break;
          }

          return;
        },

        // placeholder function for possible later implementation
        _trackStart: function(event) { return; },

        // function to enable dragging both knobs by using the invisible
        // div which spans the distance in between
        _trackX: function(e) {
            this._x1_Min = this._x0_Min + e.detail.dx;
            var immediateValueMin = this._calcStep(this._getRatioPos(this.$.sliderMin, this._x1_Min/this._xWidth));

            this._x1_Max = this._x0_Max + e.detail.dx;
            var immediateValueMax = this._calcStep(this._getRatioPos(this.$.sliderMax, this._x1_Max/this._xWidth));

            if(immediateValueMin >= this.min && immediateValueMax <= this.max) {
                this.valueMin = immediateValueMin;
                this.valueMax = immediateValueMax;

                // setting of the div which spans the space between the two knobs
                this._updateDiffDiv();
                
                // fire to indicate an update of this.valueMin and/or this.valueMax
                this.updateValues();
            }

            return;
        },
        
        // placeholder function for possible later implementation
        _trackEnd: function() { return; },

        // _sliderMinDown, _sliderMaxDown, _sliderMinUp, _sliderMaxUp
        //      show/hide pins (if defined) for one knob, when the other knob is pressed
        _sliderMinDown: function() {
            this.$.sliderMax._expandKnob();
            
            return;
        },
        _sliderMaxDown: function() {
            this.$.sliderMin._expandKnob();

            return;
        },
        _sliderMinUp: function() {
            if(this.alwaysShowPin) this.$.sliderMin._expandKnob();
            else                   this.$.sliderMax._resetKnob();
            
            return;
        },
        _sliderMaxUp: function() {
            if(this.alwaysShowPin) this.$.sliderMax._expandKnob();
            else                   this.$.sliderMin._resetKnob();
            
            return;
        },

        // initialization before starting the dragging of the invisible
        // div which spans the distance in between
        _diffDivDown: function(event) {
            // show pins if defined
            this._sliderMinDown();
            this._sliderMaxDown();

            // get the initial positions of knobs before dragging starts
            this._xWidth = this.$.sliderMin.querySelector('#sliderBar').offsetWidth;
            this._x0_Min = this.$.sliderMin.ratio * this._xWidth;
            this._x0_Max = this.$.sliderMax.ratio * this._xWidth;
            
            return;
        },

        // finalization after ending the dragging of the invisible
        // div which spans the distance in between
        _diffDivUp: function() {
            // hide pins if defined
            this._sliderMinUp();
            this._sliderMaxUp();

            return;
        },

        // placeholder function for possible later implementation
        _diffDivTransEnd: function(event) { return; },

        // setting of the div which spans the space between the two knobs
        _updateDiffDiv: function() {
            return;
            // var dragAnywhere = true;
            
            // // the dragg area is the entire width of the slider
            // if(dragAnywhere) {
            //     var width  = Number((this.sliderWidth).replace('px',''));
            //     this.$.diffDiv.style.width      = width+'px'//((1 + 2*extra) * diff)+'px'
            //     this.$.diffDiv.style.marginLeft = (-width)+'px'//(posMin - width - extra * diff)+'px'
            // }
            // // the dragg area is only between the two knobs
            // else {
            //     var posMin = this._getPos(this.$.sliderMin);
            //     var posMax = this._getPos(this.$.sliderMax);
            //     var width  = Number((this.sliderWidth).replace('px',''));
            //     var diff   = Math.min(width, Math.max(0,(posMax - posMin)));
            //     var extra  = 0.05;

            //     this.$.diffDiv.style.width      = ((1 + 2*extra) * diff)+'px'
            //     this.$.diffDiv.style.marginLeft = (posMin - width - extra * diff)+'px'
            // }
            // return;
        },

        // the current position of the knob for a given single-slider
        _getPos: function(sliderIn) {
            return (sliderIn.ratio) * Number(sliderIn.style.width.replace('px',''));
        },

        // the position of the knob for a given single-slider, for a given ratio
        _getRatioPos: function(this_,ratio) {
            return (this_.max - this_.min) * ratio + this_.min;
        },

        /**
         * initialize basic properties
         * @method init
         */
        init: function() {
            if(this.alwaysShowPin) { this.pin = true; }

            // some basic properties
            this.$.sliderMin.pin              = this.pin
            this.$.sliderMax.pin              = this.pin
            this.$.sliderMin.snaps            = this.snaps
            this.$.sliderMax.snaps            = this.snaps
            
            // this.$.sliderMin.style.width      = this.sliderWidth
            // this.$.sliderMax.style.width      = this.sliderWidth
            // this.$.sliderMin.style.marginLeft = ("-"+this.sliderWidth)
            if(this.sliderWidth != "") {
                this.$.sliderOuterDiv.style.width = this.sliderWidth;
            }

            // disable some of the interface of the two single-sliders, but keep the knobs active
            this.$.sliderMax.querySelector('#sliderContainer').style.pointerEvents = "none"
            this.$.sliderMin.querySelector('#sliderContainer').style.pointerEvents = "none"

            this.$.sliderMax.querySelector('#sliderKnobInner').style.pointerEvents = "auto"
            this.$.sliderMin.querySelector('#sliderKnobInner').style.pointerEvents = "auto"

            // since the two single-sliders are overlaid, we need to remove forground color
            this.$.sliderMin.querySelector('#sliderBar').querySelector('#progressContainer').style.background = "transparent";

            // internal variable to prevent unneeded fire on updates
            this._prevUpdateValues = [this.min, this.max]

            // set internal variables to control the minimal and maximal difference between selected values
            this._setValueDiff();

            // initial setting after verifying this._valueDiffMin, this._valueDiffMax
            this._setValueMinMax(this._getValuesMinMax(this.valueMin, this.valueMax));

            // setting of the div which spans the space between the two knobs
            this._updateDiffDiv();

            // activate the pins, and never hide
            if(this.alwaysShowPin) {
                this.$.sliderMin._expandKnob();
                this.$.sliderMax._expandKnob();
            }

            return;
        },

        /**
         * set this.valueMin and/or this.valueMax (can input null values or out-of-range
         * values in order to set only one of the two)
         * @method setValues
         */
        setValues: function(valueMin,valueMax) {
            // some sanity checks/changes
            if(valueMin != null) {
                if(valueMin < this.min || valueMin > this.max) valueMin = null;
            }
            if(valueMax != null) {
                if(valueMax < this.min || valueMax > this.max) valueMax = null;
            }
            if(valueMin != null && valueMax != null) {
                valueMin = Math.min(valueMin,valueMax);
            }

            // now update the values
            this._setValueMinMax(this._getValuesMinMax(valueMin,valueMax));

            return;
        },

        /**
         * fire whenever this.valueMin or this.valueMax are changed
         * @method updateValues
         */
        updateValues: function() {
            if(this._prevUpdateValues[0] != this.valueMin || this._prevUpdateValues[1] != this.valueMax) {
                this._prevUpdateValues = [this.valueMin, this.valueMax];

                // fire the event
                this.async(function() { this.fire('updateValues'); });
            }
            return;
        },        

        /**
         * set the minimal value (lower range) of the slider
         * @method setMin
         */
        setMin: function(minIn) {
            // paper-slider needs a safety chek that the min value we are going to set is
            // not larger than the max value whic is already sey
            if(this.max < minIn) this.max = minIn;

            this.min = minIn;
            this._prevUpdateValues = [this.min, this.max]
            return;
        },
        /**
         * set the maximal value (upper range) of the slider
         * @method setMax
         */
        setMax: function(maxIn) {
            // paper-slider needs a safety chek that the min value we are going to set is
            // not larger than the max value whic is already sey
            if(this.min > maxIn) this.min = maxIn;

            this.max = maxIn;
            this._prevUpdateValues = [this.min, this.max]
            return;
        },
        /**
         * set the minimal step-change of a knob on the slider
         * @method setMax
         */
        setStep: function(stepIn) {
            this.step = stepIn;
            return;
        },
        /**
         * set the minimal difference between selected values
         * @method setValueDiffMin
         */
        setValueDiffMin: function(valueDiffMin) {
            this._valueDiffMin = valueDiffMin;
            return;
        },
        /**
         * set the maximal difference between selected values
         * @method setValueDiffMax
         */
        setValueDiffMax: function(valueDiffMax) {
            this._valueDiffMax = valueDiffMax;
            return;
        },

      });
    