make_suffix_tree = (str_list) ->
  output = {}
  for x in str_list
    node = output
    for c in x
      if not node[c]?
        node[c] = {}
      node = node[c]
    node.ok = true
  return output

make_prefix_tree = (str_list) ->
  output = {}
  for x in str_list
    node = output
    for c in x[to].reverse().join('')
      if not node[c]?
        node[c] = {}
      node = node[c]
    node.ok = true
  return output

is_in_suffix_tree = (tree, word) ->
  node = tree
  for c in word
    if not node[c]?
      return false
    node = node[c]
  return node.ok == true

is_in_prefix_tree = (tree, word) ->
  node = tree
  for c in word[to].reverse().join('')
    if not node[c]?
      return false
    node = node[c]
  return node.ok == true

find_match_from_start_for_suffix_tree = (text, startpos, tree) ->
  idx = startpos
  node = tree
  while true
    c = text[idx]
    node = node[c]
    if not node?
      return null
    if node.ok == true
      return text.substr(startpos, idx - startpos + 1)
    idx += 1

find_match_length_from_start_for_suffix_tree = (text, startpos, tree) ->
  idx = startpos
  node = tree
  while true
    c = text[idx]
    node = node[c]
    if not node?
      return 0
    if node.ok == true
      return idx - startpos + 1
    idx += 1

add_habitlab_prefix_to_polymer_elements = (intervention_code) ->

  # elements_to_replace = [
  #   'paper-button'
  #   'paper-ripple-behavior'
  #   'iron-overlay-behavior'
  #   'iron-checked-element-behavior'
  #   'iron-button-state'
  #   'paper-ripple'
  #   'iron-flex-layout'
  #   'paper-styles/default-theme'
  #   'neon-animation-runner-behavior'
  #   'iron-icon'
  #   'paper-inky-focus-behavior'
  #   'paper-dialog-scrollable'
  #   'paper-dialog'
  #   'paper-textarea'
  #   'paper-checkbox'
  #   'paper-input-container'
  #   'paper-input-error'
  #   'paper-char-counter'
  #   'paper-tooltip'
  # ]

  find_next_index_from_pos = (text, startpos, char) ->
    i = startpos
    while i < text.length
      if text[i] == char
        return i
      i += 1
    return i

  # list_all_custom_polymer_elements = (input_text) ->
  #   i = 0
  #   input_text = input_text.split(' ').join('').split('\n').join('').split('\t').join('')
  #   output = []
  #   while i < input_text.length
  #     pattern = "Polymer({is:'"
  #     if input_text.substr(i, pattern.length) == pattern
  #       i += pattern.length
  #       word_end = find_next_index_from_pos(input_text, i, "'")
  #       word = input_text.substr(i, word_end - i)
  #       output.push word
  #       i = word_end
  #       continue
  #     i += 1
  #   return output

  list_all_custom_polymer_elements = (text) ->
    i = 0
    text = text.split(' ').join('').split('\n').join('').split('\t').join('')
    output = []
    while i < text.length - 13
      if (text[i] == 'P' and
          text[i+1] == 'o' and
          text[i+2] == 'l' and
          text[i+3] == 'y' and
          text[i+4] == 'm' and
          text[i+5] == 'e' and
          text[i+6] == 'r' and
          text[i+7] == '(' and
          text[i+8] == '{' and
          text[i+9] == 'i' and
          text[i+10] == 's' and
          text[i+11] == ':' and
          text[i+12] == "'")
        i += 13
        word_end = find_next_index_from_pos(text, i, "'")
        word = text.substr(i, word_end - i)
        output.push word
        i = word_end
        continue
      i += 1
    return output

  elements_to_replace = list_all_custom_polymer_elements(intervention_code)
  elements_to_replace = elements_to_replace.concat [
    'dom-module'
  ]

  element_to_replacement = {}
  for x in elements_to_replace
    element_to_replacement[x] = 'habitlab-' + x

  tree = make_suffix_tree elements_to_replace

  # make_replacements_old = (input_text) ->
  #   i = 0
  #   output = []
  #   ol = 0
  #   while i < input_text.length
  #     made_replacement = false
  #     for to_replace in elements_to_replace
  #       if input_text.substr(i, to_replace.length) == to_replace
  #         output[ol] = element_to_replacement[to_replace]
  #         ol += 1
  #         made_replacement = true
  #         i += to_replace.length
  #         break
  #     if made_replacement
  #       continue
  #     output[ol] = input_text[i]
  #     ol += 1
  #     i += 1
  #   return output.join('')

  # make_replacements = (input_text) ->
  #   i = 0
  #   output = []
  #   while i < input_text.length
  #     match_length = find_match_length_from_start_for_suffix_tree(input_text, i, tree)
  #     if match_length == 0
  #       output.push(input_text[i])
  #       i += 1
  #     else
  #       matched_text = input_text.substr(i, match_length)
  #       output.push(element_to_replacement[matched_text])
  #       #for ti from i til i + match_length
  #       #  output.push(input_text[i])
  #       i += match_length
  #   return output.join('')

  make_replacements = (text) ->
    output = []
    text_lines = text.split('\n')
    for line in text_lines
      if line.endsWith(':') and (line.startsWith('/***/ "./src/bower_components/') or line.startsWith('/***/ "./src/components/'))
        output.push(line)
        continue
      if line.indexOf('__webpack_require__') != -1
        output.push(line)
        continue
      i = 0
      idx = 0
      node = null
      match_length = 0
      matched_text = null
      output_lines = []
      while i < line.length
        idx = i
        node = tree
        match_length = 0
        while true
          c = line[idx]
          node = node[c]
          if not node?
            break
          if node.ok == true
            match_length = idx - i + 1
            break
          idx += 1
        if match_length == 0
          output_lines.push(line[i])
          i += 1
        else
          matched_text = line.substr(i, match_length)
          output_lines.push(element_to_replacement[matched_text])
          #for ti from i til i + match_length
          #  output.push(text[i])
          i += match_length
      output.push(output_lines.join(''))
    return output.join('\n')
  return make_replacements(intervention_code)

module.exports = add_habitlab_prefix_to_polymer_elements
