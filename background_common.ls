export getSurveyInfo = (survey_name, callback) ->
  survey_info_text <- $.get "/surveys/#{survey_name}.yaml"
  survey_info = jsyaml.safeLoad survey_info_text
  callback survey_info

export getExperimentInfo = (experiment_name, callback) ->
  experiment_info_text <- $.get "/experiments/#{experiment_name}/experiment.yaml"
  experiment_info = jsyaml.safeLoad experiment_info_text
  callback experiment_info

export get_experiments = memoizeSingleAsync (callback) ->
  $.get '/experiments/experiments_list.yaml', (experiments_list_text) ->
    experiments_list = jsyaml.safeLoad experiments_list_text
    output = {}
    errors,results <- async.mapSeries experiments_list, (experiment_name, ncallback) ->
      experiment_info <- getExperimentInfo experiment_name
      if not experiment_info.nomatches?
        experiment_info.nomatches = []
      if not experiment_info.matches?
        experiment_info.matches = []
      if not experiment_info.scripts?
        experiment_info.scripts = []
      if not experiment_info.css?
        experiment_info.css = []
      experiment_info.match_regexes = [new RegExp(x) for x in experiment_info.matches]
      experiment_info.nomatch_regexes = [new RegExp(x) for x in experiment_info.nomatches]
      output[experiment_name] = experiment_info
      ncallback null, null
    callback output

export list_available_experiments_for_location = (location, callback) ->
  all_experiments <- get_experiments()
  possible_experiments = []
  for experiment_name,experiment_info of all_experiments
    blacklisted = false
    for regex in experiment_info.nomatch_regexes
      if regex.test(location)
        blacklisted = true
        break
    if blacklisted
      continue
    matches = false
    for regex in experiment_info.match_regexes
      if regex.test(location)
        matches = true
        break
    if matches
      possible_experiments.push experiment_name
  callback possible_experiments

export getDb = memoizeSingleAsync (callback) ->
  new minimongo.IndexedDb {namespace: 'autosurvey'}, callback

export getCollection = (collection_name, callback) ->
  db <- getDb()
  collection = db.collections[collection_name]
  if collection?
    callback collection
    return
  <- db.addCollection collection_name
  callback db.collections[collection_name]

export getVarsCollection = memoizeSingleAsync (callback) ->
  getCollection 'vars', callback

export getListsCollection = memoizeSingleAsync (callback) ->
  getCollection 'lists', callback

export setvar = (name, val, callback) ->
  data <- getVarsCollection()
  result <- data.upsert {_id: name, val: val}
  if callback?
    callback()

export getvar = (name, callback) ->
  data <- getVarsCollection()
  result <- data.findOne {_id: name}
  if result?
    callback result.val
    return
  else
    callback null
    return
  # if var is not set, return null instead

export clearvar = (name, callback) ->
  data <- getVarsCollection()
  <- data.remove name
  if callback?
    callback()

export printvar = (name) ->
  result <- getvar name
  console.log result

export addtolist = (name, val, callback) ->
  data <- getListsCollection()
  result <- data.upsert {name: name, val: val}
  if callback?
    callback()

export getlist = (name, callback) ->
  data <- getListsCollection()
  result <- data.find({name: name}).fetch()
  callback [x.val for x in result]

export clearlist = (name, callback) ->
  data <- getListsCollection()
  result <- data.find({name: name}).fetch()
  <- async.eachSeries result, (item, ncallback) ->
    <- data.remove item['_id']
    ncallback()
  if callback?
    callback()

export printlist = (name) ->
  result <- getlist name
  console.log result

export clear_all_lists = (callback) ->
  data <- getListsCollection()
  result <- data.find({}).fetch()
  <- async.eachSeries result, (item, ncallback) ->
    <- data.remove item['_id']
    ncallback()
  if callback?
    callback()

export clear_all_vars = (callback) ->
  data <- getVarsCollection()
  result <- data.find({}).fetch()
  <- async.eachSeries result, (item, ncallback) ->
    <- data.remove item['_id']
    ncallback()
  if callback?
    callback()

export clear_all = (callback) ->
  <- async.series [
    clear_all_vars
    clear_all_lists
  ]
  if callback?
    callback()
