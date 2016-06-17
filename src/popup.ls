startPage = ->
  params = getUrlParameters()
  tagname = params.tag
  {survey} = params
  if not tagname?
    if survey?
      tagname = survey + '-survey'
    else
      tagname = 'popup-view'
  tag = $("<#{tagname}>")
  for k,v of params
    if k == 'tag'
      continue
    v = jsyaml.safeLoad(v)
    tag.prop k, v
  tag.appendTo '#contents'

$(document).ready ->
  console.log window.location
  startPage()
  return
  facebook_name <- getvar 'facebook_name'
  facebook_link <- getvar 'facebook_link'
  facebook_birthdate <- getvar 'facebook_birthdate'
  facebook_occupation <- getvar 'facebook_occupation'
  $('#facebook_name').text facebook_name
  $('#facebook_link').text facebook_link
  $('#facebook_occupation').text facebook_occupation
  $('#facebook_birthdate').text facebook_birthdate
  console.log 'popup is getting rendered'
  #$('<div>').text('Where do you spend your time online').appendTo $('#experiment_list')
