Polymer({
  is: 'time-selector-dialog',

  properties: {
  },

  show: function() {
    this.$$('#start-dialog').toggle()
    this.$$('#start-dialog').style.zIndex = 999999999999;
  }
});



