for (const k of Object.keys(global_exports)) {
  this[k] = global_exports[k]
}

const gexport_item = ((pagename, str) => {
  const eval_page = this[`eval_${pagename}`]
  if (!eval_page) {
    console.log(`gexport_item for ${str} failed as eval_${pagename} is not defined`)
    return
  }
  eval_page(`gexport({'${str}': ${str}})`)
  this[str] = global_exports[str]
}).bind(this)

const gexport_item_background = (str) => gexport_item('background', str)
const gexport_item_background_common = (str) => gexport_item('background_common', str)

const gexport_all = ((pagename) => {
  const eval_page = this[`eval_${pagename}`]
  if (!eval_page) {
    return
  }
  const exports_page = eval_page(`get_exports_${pagename}()`)
  this[`exports_${pagename}`] = exports_page
  for (const k of Object.keys(exports_page)) {
    this[k] = exports_page[k]
  }
}).bind(this)

gexport_all('background')
gexport_all('background_common')

