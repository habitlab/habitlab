export sendExtension = (type, data, callback) ->
  chrome.runtime.sendMessage autosurvey_extension_id, {type, data}, (response) ->
    if callback?
      callback(response)
