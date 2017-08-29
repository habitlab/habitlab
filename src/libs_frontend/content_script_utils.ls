send_message_to_background = (type, data) ->
  return new Promise (resolve, reject) ->
    chrome.runtime.sendMessage {
      type
      data
    }, (result) ->
      resolve(result)
    return true

export load_css_file = (filename) ->>
  await send_message_to_background 'load_css_file', {css_file: filename}
  return

export load_css_code = (css_code) ->>
  await send_message_to_background 'load_css_code', {css_code: css_code}
  return

export set_alternative_url_to_track = (url) ->>
  await send_message_to_background 'set_alternative_url_to_track', {url: url}
  return

export register_listener_for_tab_focus = ->>
  await send_message_to_background 'register_listener_for_tab_focus', {}
  return

export remove_listener_for_tab_focus = ->>
  await send_message_to_background 'remove_listener_for_tab_focus', {}
  return