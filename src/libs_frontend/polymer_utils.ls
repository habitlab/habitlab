{gexport} = require 'libs_common/gexport'
$ = require 'jquery'
{import_dom_modules} = require 'libs_frontend/dom_utils'

require 'bower_components/polymer/polymer.deps'
#require 'bower_components/iron-flex-layout/iron-flex-layout.deps'
#require 'bower_components/paper-styles/color.deps'
#require 'bower_components/paper-styles/typography.deps'
#require 'bower_components/paper-styles/shadow.deps'
#require 'bower_components/polymer-themes/ice.deps'

PropertyIntrospectionBehavior = {
  properties: {
    propertieslist: {
      type: Array
      value: []
    }
  }
  getdata: ->
    output = {}
    for x in this.propertieslist
      output[x] = this[x]
    return output
}

polymer_ext_registered_tags = []
polymer_ext_tag_to_info = {}

export list_polymer_ext_tags = ->
  return [x for x in polymer_ext_registered_tags]

export list_polymer_ext_tags_with_info = ->
  return [polymer_ext_tag_to_info[x] for x in polymer_ext_registered_tags]

process_extra_methods_sources = (extra_methods_sources) ->
  extra_methods = {}
  if not extra_methods_sources?
    return extra_methods
  if extra_methods_sources.source? and extra_methods_sources.methods?
    # format is as follows
    /*
    {
      source: require('libs_frontend/polymer_methods'),
      methods: ['S', 'once_available'],
    }
    */
    extra_methods_sources = [extra_methods_sources]
  if Array.isArray(extra_methods_sources)
    # format is as follows
    /*
    [
      {
        source: require('libs_frontend/polymer_methods'),
        methods: ['S', 'once_available'],
      },
      { source: ..., methods: ... },
    ]
    */
    for method_source in extra_methods_sources
      for method in method_source.methods
        extra_methods[method] = method_source.source[method]
  else
    # format is as follows
    /*
    methods = require('libs_frontend/polymer_methods')
    {
      S: methods.S
      once_available: methods.once_available
    }
    */
    extra_methods = extra_methods_sources
  return extra_methods

PolymerWithPropertyIntrospection = (dom_module_text, tag_info, extra_methods_sources) ->
  if typeof(dom_module_text) == 'string'
    if dom_module_text.indexOf("</dom-module>") == -1
      dom_module_text = "<dom-module>\n" + dom_module_text + "\n</dom-module>"
    import_dom_modules(dom_module_text, {tagname: tag_info.is})
  else
    extra_methods_sources = tag_info
    tag_info = dom_module_text
  extra_methods = process_extra_methods_sources extra_methods_sources
  tag_info = $.extend(true, {}, tag_info)
  tagname = tag_info.is
  if not tagname?
    console.log 'called polymer_ext but missing "is" property'
  if polymer_ext_tag_to_info[tagname]?
    console.log "polymer_ext_tag_to_info called multiple times for #{tagname}"
  property_names = []
  if not tag_info.behaviors?
    tag_info.behaviors = []
  behavior = $.extend(true, {}, PropertyIntrospectionBehavior)
  for k,v of extra_methods
    behavior[k] = v
  tag_info.behaviors.push behavior
  if not tag_info.properties?
    tag_info.properties = {}
  property_names = [k for k,v of tag_info.properties]
  if not tag_info.properties.propertieslist?
    tag_info.properties.propertieslist = {
      type: Array
      value: property_names
    }
  polymer_ext_registered_tags.push tagname
  polymer_ext_tag_to_info[tagname] = $.extend(true, {}, tag_info)
  Polymer(tag_info)

export polymer_ext = PolymerWithPropertyIntrospection
