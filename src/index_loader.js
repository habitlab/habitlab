var allow_indexjs_caching = localStorage.getItem('allow_indexjs_caching') == 'true'
var download_indexjs = true
if (allow_indexjs_caching) {
  var index_js_contents = localStorage.getItem('cached_indexjs')
  if (index_js_contents != null) {
    download_indexjs = false
    eval(index_js_contents)
  }
}
if (download_indexjs) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/index.js', false)
  xhr.send()
  if (xhr.status == 200) {
    if (localStorage.getItem('allow_indexjs_caching') == 'true') {
      localStorage.setItem('cached_indexjs', xhr.responseText)
    }
    eval(xhr.responseText)
  }
}