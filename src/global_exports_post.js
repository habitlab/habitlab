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

const gexport_finish_exporting_modules = (() => {
  if (!global_exports.gexport_eval_funcs) {
    return
  }
  for (const pagename of Object.keys(global_exports.gexport_eval_funcs)) {
    const eval_page = global_exports.gexport_eval_funcs[pagename]
    const exports_page = eval_page('module.exports')
    this[`exports_${pagename}`] = exports_page
    for (const k of Object.keys(exports_page)) {
      this[k] = exports_page[k]
    }
    this[`gexport_item_${pagename}`] = (str) => gexport_item(pagename, str)
  }
}).bind(this)

gexport_finish_exporting_modules()
