{
  polymer_ext
  list_polymer_ext_tags_with_info
} = require 'libs_frontend/polymer_utils'

polymer_ext {
  is: 'dash-settings'
  tag_link_url: (tagname) ->
    "index.html?tag=#{tagname}"
  tags_with_info: ->
    list_polymer_ext_tags_with_info()
  rerender_privacy_options: ->
    this.$.options_interventions.rerender_privacy_options()
  rerender: ->
    return
    #this.$.options_interventions.rerender()
}, {
  source: require 'libs_frontend/polymer_methods'
  methods: [
    'yaml_stringify'
  ]
}
