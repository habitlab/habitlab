function gexport_item(pagename, str) {
  const eval_page = window[`eval_${pagename}`]
  if (!eval_page) {
    console.log(`gexport_item for ${str} failed as eval_${pagename} is not defined`)
    return
  }
  eval_page(`gexport({'${str}': ${str}})`)
  window[str] = window.global_exports[str]
}

function gexport_finish_exporting_modules() {
  for (let k of Object.keys(window.global_exports)) {
    window[k] = window.global_exports[k]
  }
  if (!window.global_exports.gexport_eval_funcs) {
    return
  }
  for (let pagename of Object.keys(window.global_exports.gexport_eval_funcs)) {
    const eval_page = window.global_exports.gexport_eval_funcs[pagename]
    const exports_page = eval_page('module.exports')
    window[`exports_${pagename}`] = exports_page
    for (let k of Object.keys(exports_page)) {
      window[k] = exports_page[k]
    }
    window[`gexport_item_${pagename}`] = (str) => gexport_item(pagename, str)
  }
}

window.gexport_all = gexport_finish_exporting_modules
