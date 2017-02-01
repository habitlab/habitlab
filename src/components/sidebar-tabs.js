Polymer({

  is: 'sidebar-tabs',
  properties: {
    items: {
      type: Array
    }
  },
  tab_elem_selected: function(evt) {
    var name = evt.target.name
    this.fire('tab-elem-selected', {name: name, idx: this.items.indexOf(name)})
  }
});
