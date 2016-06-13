export open_page = (page_name, options) ->
  newpage = $("<#{page_name}>")
  if options?
    for k,v of options
      newpage.attr k, v
  $('#contents').html newpage

export open_survey = (survey_name) ->
  open_page survey_name + '-survey'

export return_home = ->
  #open_page 'experiment-view'
  open_page 'popup-view'

export view_data = (survey_name) ->
  # open_page 'view_data?' + $.param {survey: survey_name}
  # window.open 'popup.html?' + $.param {
  #  tag: 'view-data'
  #  survey: survey_name
  #}
  open_page 'view-data', {survey: survey_name}
