require! {
  localforage
}

{cfy} = require 'cfy'

localforage_store = null
get_store = ->
  if not localforage_store?
    manifest = chrome.runtime.getManifest()
    if manifest.update_url? or localStorage.getItem('devmode_use_cache') == 'true'
      localforage_store := localforage.createInstance({name: 'localget'})
    else
      localforage_store := {
        setItem: ->
          (callback) -> callback(null, null)
        getItem: ->
          (callback) -> callback(null, null)
      }
  return localforage_store

export localget = cfy (url) ->*
  store = get_store()
  res = yield store.getItem(url)
  if res?
    return res
  request = yield fetch(url)
  res = yield request.text()
  yield store.setItem(url, res)
  return res

export localget_json = cfy (url) ->*
  text = yield localget url
  if text?
    return JSON.parse text
  return null

export localget_base64 = cfy (url) ->*
  text = yield localget url
  if text?
    return 'data:text/plain;base64,' + btoa(text)
  return null
