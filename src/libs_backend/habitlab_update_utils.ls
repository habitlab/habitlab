{cfy} = require 'cfy'

require! {
  semver
}

{
  gexport
  gexport_module
} = require 'libs_common/gexport'


chrome_manifest = chrome.runtime.getManifest()
habitlab_version = chrome_manifest.version
developer_mode = not chrome_manifest.update_url?

export run_check_for_update_if_needed = ->
  if developer_mode
    return
  if not (chrome.runtime.id == 'obghclocpdgcekcognpkblghkedcpdgd' or chrome.runtime.id == 'bleifeoekkfhicamkpadfoclfhfmmina')
    return
  last_time_update_checked = localStorage.getItem('habitlab_last_time_checked_for_updates')
  if last_time_update_checked?
    last_time_update_checked = parseInt(last_time_update_checked)
  else
    last_time_update_checked = 0
  current_time = Date.now()
  if last_time_update_checked + 1000*60*15 > current_time # within the past 15 minutes
    return
  localStorage.setItem('habitlab_last_time_checked_for_updates', current_time)
  chrome.runtime.requestUpdateCheck (status, details) ->
    return

export get_latest_habitlab_version = cfy ->*
  chrome_runtime_id = 'obghclocpdgcekcognpkblghkedcpdgd'
  if chrome.runtime.id == 'bleifeoekkfhicamkpadfoclfhfmmina'
    chrome_runtime_id = 'bleifeoekkfhicamkpadfoclfhfmmina'
  latest_version_info = yield fetch('https://habitlab.herokuapp.com/app_version?appid=' + chrome_runtime_id).then((.json!))
  if (not latest_version_info?version?) or (not semver.valid(latest_version_info.version))
    return null
  return latest_version_info.version

export is_habitlab_update_available = cfy ->*
  latest_version = yield get_latest_habitlab_version()
  if not latest_version?
    return false
  return semver.gt(latest_version, habitlab_version)

export check_if_update_available_and_run_update = cfy ->*
  if developer_mode
    return false
  if not (chrome.runtime.id == 'obghclocpdgcekcognpkblghkedcpdgd' or chrome.runtime.id == 'bleifeoekkfhicamkpadfoclfhfmmina')
    return false
  update_available = yield is_habitlab_update_available()
  if update_available
    run_check_for_update_if_needed()
  return update_available

gexport_module 'habitlab_update_utils', -> eval(it)
