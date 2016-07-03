export import_dom_modules = (element_dom) !->
  element_dom_parsed_list = parseHTML(element_dom)
  for element_dom_parsed in element_dom_parsed_list
    if element_dom_parsed.nodeName.toLowerCase() == 'dom-module'
      recreateDomModule(element_dom_parsed)

recreateDomModule = (element_dom_parsed) !->
  DOM_MODULE = document.createElement('dom-module')
  DOM_MODULE.innerHTML = element_dom_parsed.innerHTML
  DOM_MODULE.id = element_dom_parsed.id
  DOM_MODULE.createdCallback?!

parseHTML = (str) ->
  tmp = document.implementation.createHTMLDocument()
  tmp.body.innerHTML = str
  return tmp.body.children
