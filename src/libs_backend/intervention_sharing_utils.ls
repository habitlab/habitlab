{
  post_json
} = require 'libs_backend/ajax_utils'

# author_info.email = the email address
# author_info.id = the author id
export upload_intervention = (intervention_info, author_info, is_sharing) ->>
  console.log intervention_info
  console.log author_info
  # 1. get the server loc
  ### TODO: remove for testing
  localStorage.setItem('local_logging_server', true) 
  ###
  if localStorage.getItem('local_logging_server') == 'true'
    console.log "posting to local server"
    logging_server_url = 'http://localhost:5000/'
  else
    console.log "posting to cloud server"
    logging_server_url = 'https://habitlab.herokuapp.com/'
  # 2. Concat data to transmit
  intervention_info_with_author = intervention_info
  intervention_info_with_author.auther_email = author_info.email
  intervention_info_with_author.author_id = author_info.id
  data = {} <<< intervention_info_with_author
  data.logname = "share_intervention_repo"
  data.is_sharing = is_sharing
  # console.log data
  # 3. Encoding with intervention II
  data.key = author_info.id + Date.now()
  # 4. Send it
  upload_successful = true
  try
    console.log 'Posting data to: ' + logging_server_url + 'sharedintervention'
    response = await post_json(logging_server_url + 'sharedintervention', data)
    if response.success
      if is_sharing
        return {status: 'success', url: logging_server_url + "lookupintervention?share=y&id=" + data.key}
      else
        return {status: 'success', url: logging_server_url + "lookupintervention?share=n&id=" + data.key}
    else
      upload_successful = false
      dlog 'response from server was not successful in upload_intervention'
      dlog response
      dlog data
      console.log 'response from server was not successful in upload_intervention'
      return {status: 'failure', url: 'https://habitlab.stanford.edu'}
  catch
    upload_successful = false
    dlog 'error thrown in upload_intervention'
    dlog e
    dlog data
    dlog data.logname
    console.log 'error thrown in upload_intervention'
    return {status: 'failure', url: 'https://habitlab.stanford.edu'}

# author_info.email = the email address
# author_info.id = the author id
export list_interventions_for_author = (author_info) ->>
  return []


