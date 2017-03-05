module.exports = (function xmlparser() {
  //common browsers
  if (typeof window.DOMParser !== 'undefined') {
    return function(str) {
      var parser = new window.DOMParser()
      return parser.parseFromString(str, 'application/xml')
    }
  } 

  //IE8 fallback
  if (typeof window.ActiveXObject !== 'undefined'
      && new window.ActiveXObject('Microsoft.XMLDOM')) {
    return function(str) {
      var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM")
      xmlDoc.async = "false"
      xmlDoc.loadXML(str)
      return xmlDoc
    }
  }

  //last resort fallback
  return function(str) {
    var div = document.createElement('div')
    div.innerHTML = str
    return div
  }
})()