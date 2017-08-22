function escape_as_html(text) {
  let tmp_elem = document.createElement('span')
  tmp_elem.innerText = text
  return tmp_elem.innerHTML
}

module.exports = {
  escape_as_html
}