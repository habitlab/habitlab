
  Polymer({
    is: 'default-value',
    properties: {
      val: {
        type: String,
        notify: true,
        value: 'default-value'
      }
    },
  });

  Polymer({
    is: 'on-attached',
    properties: {
      val: {
        type: String,
        notify: true,
        value: 'on-attached-default-value'
      }
    },
    attached: function() {
      if (this.val === 'on-attached-default-value') {
        this.val = 'on-attached';
      }
    }
  });

  Polymer({
    is: 'on-ready',
    properties: {
      val: {
        type: String,
        notify: true,
        value: 'on-ready-default-value'
      }
    },
    ready: function() {
      this.val = 'on-ready';
    }
  });

  Polymer({
    is: 'on-timeout',
    properties: {
      val: {
        type: String,
        notify: true,
        value: 'on-timeout-default-value'
      }
    },
    attached: function() {
      setTimeout(function() {
        this.val = 'on-timeout';
      }.bind(this), 10);
    }
  })
Polymer({is: 'default-before', properties: {val: {type: String}}});Polymer({is: 'attached-before', properties: {val: {type: String}}});Polymer({is: 'ready-before', properties: {val: {type: String}}});Polymer({is: 'timeout-before', properties: {val: {type: String}}});Polymer({is: 'default-after', properties: {val: {type: String}}});Polymer({is: 'attached-after', properties: {val: {type: String}}});Polymer({is: 'ready-after', properties: {val: {type: String}}});Polymer({is: 'timeout-after', properties: {val: {type: String}}});Polymer({is: 'default-below', properties: {val: {type: String}}});Polymer({is: 'attached-below', properties: {val: {type: String}}});Polymer({is: 'ready-below', properties: {val: {type: String}}});Polymer({is: 'timeout-below', properties: {val: {type: String}}});Polymer({is: 'default-above', properties: {val: {type: String}}});Polymer({is: 'attached-above', properties: {val: {type: String}}});Polymer({is: 'ready-above', properties: {val: {type: String}}});Polymer({is: 'timeout-above', properties: {val: {type: String}}});
    Polymer({
      is: 'default-container',
      properties: {val: {type: String, value: 'default-container-val'}}
    });
  
    Polymer({
      is: 'attached-container',
      properties: {val: {type: String, value: 'container-attached-default-val'}},
      attached: function() {
        if (this.val === 'container-attached-default-val') {
          this.val = 'attached-container-val';
        }
      }
    });
  
    Polymer({
      is: 'ready-container', properties: {val: {type: String}},
      ready: function() {
        this.val = 'ready-container-val';
      }
    });
  Polymer({
    is: 'timeout-container',
    properties: {
      val: {
        type: String,
        notify: true
      }
    },
    attached: function() {
      setTimeout(function() {
        this.val = 'on-timeout';
      }.bind(this), 10);
    }
  });