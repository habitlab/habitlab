/*
$.ajax {
  type: 'POST'
  url: 'https://habitlab.herokuapp.com/add_install'
  dataType: 'json'
  contentType: 'application/json'
  data: JSON.stringify(install_data)
}
*/

function post_json(url, data) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = function() {
      if (xhr.status == 200) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject('error in post_json: ' + xhr.status)
      }
    }
    xhr.onerror = function() {
      reject(xhr)
    }
    xhr.send(JSON.stringify(data))
  })
}

function get_json(url, params) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url+"?"+params, true)
    xhr.onload = function() {
      if (xhr.status == 200) {
        resolve(xhr.responseText)
      } else {
        reject('error in get_json: ' + xhr.status)
      }
    }
    xhr.onerror = function() {
      reject(xhr)
    }
    xhr.send(null)
  })
}

module.exports = {
  post_json,
  get_json
}
