const {polymer_ext} = require('libs_frontend/polymer_utils');

polymer_ext({

  is: 'sidebar-tabs',
  properties: {
    items: {
      type: Array
    },
    selected_tab_idx: {
      type: Number,
      notify: true
    },
    isdemo: {
      type: Boolean,
      observer: 'isdemo_changed'
    }
  },
  isdemo_changed: function(isdemo) {
    if (isdemo) {
      this.items = [{name: 'Overview'}, {name: 'Settings'}];
      this.selected_tab_idx = 0;
    }
  },
  tab_elem_selected: function(evt) {
    this.selected_tab_idx = evt.target.idx;
  }
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'SM',
    'text_if_equal'
  ]
})
