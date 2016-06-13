export import_data_from_json = (jsonfile) ->
  jsondata <- $.getJSON jsonfile
  field_info <- get_field_info()
  output = {}
  for field,info of field_info
    {type} = info
    if jsondata[field]? and (type == 'var' or type == 'list')
      output[field] = jsondata[field]
  console.log output

