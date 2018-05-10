const {
  polymer_ext,
  list_polymer_ext_tags_with_info
} = require('libs_frontend/polymer_utils')

polymer_ext({
  is: 'difficulty-selector',
  tag_link_url: function(tagname) {
    return "index.html?tag=#{tagname}"
  },
  tags_with_info: function() {
    list_polymer_ext_tags_with_info()
  },
}, {
  source: require('libs_frontend/polymer_methods'),
  methods: [
    'json_stringify'
  ]
})

