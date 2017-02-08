export as_array = (data) ->
  if Array.isArray(data)
    return data
  return [k for k,v of data when v == true]

export as_dictset = (data) ->
  if Array.isArray(data)
    return {[k, true] for k in data}
  return data

export remove_key_from_localstorage_dict = (dictname, key) ->
  dict_text = localStorage.getItem dictname
  if dict_text?
    dict = JSON.parse dict_text
  else
    dict = {}
  if dict[key]?
    delete dict[key]
  localStorage.setItem dictname, JSON.stringify(dict)
  return

export remove_keys_matching_patternfunc_from_localstorage_dict = (dictname, patternfunc) ->
  dict_text = localStorage.getItem dictname
  if dict_text?
    dict = JSON.parse dict_text
  else
    dict = {}
  keys_to_remove = Object.keys(dict).filter patternfunc
  for key in keys_to_remove
    if dict[key]?
      delete dict[key]
  localStorage.setItem dictname, JSON.stringify(dict)
  return


export add_key_val_to_localstorage_dict = (dictname, key, val) ->
  dict_text = localStorage.getItem dictname
  if dict_text?
    dict = JSON.parse dict_text
  else
    dict = {}
  dict[key] = val
  localStorage.setItem dictname, JSON.stringify(dict)
  return

export add_dict_to_localstorage_dict = (dictname, dict_to_add) ->
  dict_text = localStorage.getItem dictname
  if dict_text?
    dict = JSON.parse dict_text
  else
    dict = {}
  for key,val of dict_to_add
    dict[key] = val
  localStorage.setItem dictname, JSON.stringify(dict)
  return

export remove_item_from_localstorage_list = (listname, item) ->
  list_text = localStorage.getItem listname
  if list_text?
    list = JSON.parse list_text
  else
    list = []
  list = list.filter -> it != item
  localStorage.setItem listname, JSON.stringify(list)

export remove_items_matching_patternfunc_from_localstorage_list = (listname, patternfunc) ->
  list_text = localStorage.getItem listname
  if list_text?
    list = JSON.parse list_text
  else
    list = []
  list = list.filter -> !patternfunc(it)
  localStorage.setItem listname, JSON.stringify(list)

export add_item_to_localstorage_list = (listname, item) ->
  list_text = localStorage.getItem listname
  if list_text?
    list = JSON.parse list_text
  else
    list = []
  if list.indexOf(item) == -1
    list.push item
  localStorage.setItem listname, JSON.stringify(list)
