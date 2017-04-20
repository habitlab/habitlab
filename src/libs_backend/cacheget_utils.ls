require! {
  localforage
}

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

localforage_store = null
get_store = ->
  if not localforage_store?
    manifest = chrome.runtime.getManifest()
    if manifest.update_url? or localStorage.getItem('devmode_use_cache') == 'true'
      localforage_store := localforage.createInstance({name: 'localget'})
    else
      localforage_store := {
        setItem: ->>
          return
        getItem: ->>
          return
      }
  return localforage_store

localforage_store_remote = null
get_store_remote = ->
  if not localforage_store_remote?
    localforage_store_remote := localforage.createInstance({name: 'remoteget'})
  return localforage_store_remote

/**
 * Clears the cache used by localget and localget_json
 */
export clear_cache_localget = ->>
  store = get_store()
  await store.clear()

/**
 * Clears the cache used by remoteget and remoteget_json
 */
export clear_cache_remoteget = ->>
  store = get_store_remote()
  await store.clear()

/**
 * Fetches a local URL and returns the content as text. This is for data that is local to the extension, ie chrome-extension URLs - for remote HTTP/HTTPS URLs, use remoteget. Result is cached - if you need to clear the cache, use clear_cache_remoteget.
 * @param {string} url - The URL that we should fetch
 * @return {Promise<string>} Content of the remote URL, as text
 */
export localget = (url) ->>
  store = get_store()
  res = await store.getItem(url)
  if res?
    return res
  request = await fetch(url)
  res = await request.text()
  await store.setItem(url, res)
  return res

/**
 * Fetches a local URL and returns the content as JSON. This is for data that is local to the extension, ie chrome-extension URLs - for remote HTTP/HTTPS URLs, use remoteget. Result is cached - if you need to clear the cache, use clear_cache_remoteget.
 * @param {string} url - The URL that we should fetch
 * @return {Promise<Object|Array>} Content of the remote URL, as parsed JSON (either an Object or Array)
 */
export localget_json = (url) ->>
  text = await localget url
  if text?
    return JSON.parse text
  return null

export localget_base64 = (url) ->>
  text = await localget url
  if text?
    return 'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(text)))
  return null

/**
 * Fetches a remote URL and returns the content as text. Result is cached - if you need to clear the cache, use clear_cache_remoteget.
 * @param {string} url - The URL that we should fetch
 * @return {Promise<string>} Content of the remote URL, as text
 */
export remoteget = (url) ->>
  store = get_store_remote()
  res = await store.getItem(url)
  if res?
    return res
  request = await fetch(url)
  res = await request.text()
  await store.setItem(url, res)
  return res

/**
 * Fetches a remote URL and returns the content as parsed JSON. Result is cached - if you need to clear the cache, use clear_cache_remoteget.
 * @param {string} url - The URL that we should fetch
 * @return {Promise<Object|Array>} Content of the remote URL, as parsed JSON (either an Object or Array)
 */
export remoteget_json = (url) ->>
  text = await remoteget url
  if text?
    return JSON.parse text
  return null

export remoteget_base64 = (url) ->>
  text = await remoteget url
  if text?
    return 'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(text)))
  return null

gexport_module 'cacheget_utils', -> eval(it)