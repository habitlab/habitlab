require! {
  localforage
}

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

manifest = chrome.runtime.getManifest()
habitlab_version = manifest.version.split('.').join('-')
is_production = manifest.update_url? or localStorage.getItem('devmode_use_cache') == 'true'
localforage_store = null
get_store = ->
  if not localforage_store?
    if is_production
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

localforage_store_systemjs = null
get_store_systemjs = ->
  if not localforage_store_systemjs?
    localforage_store_systemjs := localforage.createInstance({name: 'systemjsget'})
  return localforage_store_systemjs

/**
 * Clears the cache used by {@link #localget|localget} and {@link #localget_json|localget_json}
 */
export clear_cache_localget = ->>
  store = get_store()
  await store.clear()

/**
 * Clears the cache used by {@link #remoteget|remoteget} and {@link #remoteget_json|remoteget_json}
 */
export clear_cache_remoteget = ->>
  store = get_store_remote()
  await store.clear()

export clear_cache_systemjs = ->>
  store = get_store_systemjs()
  await store.clear()

/**
 * Fetches a local URL and returns the content as text. This is for data that is local to the extension, ie chrome-extension URLs - for remote HTTP/HTTPS URLs, use {@link #remoteget|remoteget} instead. Result is cached - if you need to clear the cache, use {@link #clear_cache_localget|clear_cache_localget}.
 * @param {string} url - The URL that we should fetch
 * @return {Promise.<string>} Content of the remote URL, as text
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
 * Fetches a local URL and returns the content as JSON. This is for data that is local to the extension, ie chrome-extension URLs - for remote HTTP/HTTPS URLs, use {@link #remoteget_json|remoteget_json} instead. Result is cached - if you need to clear the cache, use {@link #clear_cache_localget|clear_cache_localget}.
 * @param {string} url - The URL that we should fetch
 * @return {Promise.<Object|Array>} Content of the remote URL, as parsed JSON (either an Object or Array)
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
 * Fetches a remote URL and returns the content as text. This is for external HTTP/HTTPS URLs - for data that is local to the extension, use {@link #localget|localget} instead. Result is cached - if you need to clear the cache, use {@link #clear_cache_remoteget|clear_cache_remoteget}.
 * @param {string} url - The URL that we should fetch
 * @return {Promise.<string>} Content of the remote URL, as text
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
 * Fetches a remote URL and returns the content as parsed JSON. This is for external HTTP/HTTPS URLs - for data that is local to the extension, use {@link #localget_json|localget_json} instead. Result is cached - if you need to clear the cache, use {@link #clear_cache_remoteget|clear_cache_remoteget}.
 * @param {string} url - The URL that we should fetch
 * @return {Promise.<Object|Array>} Content of the remote URL, as parsed JSON (either an Object or Array)
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

export systemjsget = (url) ->>
  if not is_production
    url = url.replace(chrome.extension.getURL('/'), '')
    return await fetch(chrome.extension.getURL('/' + url)).then((.text!))
  store = get_store_systemjs()
  url = url.replace(chrome.extension.getURL('/'), '')
  res = await store.getItem(url)
  if res?
    return res
  request = await fetch('https://habitlab-dist-' + habitlab_version + '.netlify.com/' + url)
  res = await request.text()
  await store.setItem(url, res)
  return res

gexport_module 'cacheget_utils', -> eval(it)