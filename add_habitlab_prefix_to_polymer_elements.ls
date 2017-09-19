add_habitlab_prefix_to_polymer_elements = (intervention_code) ->

  elements_to_replace = [
    'paper-button'
    'paper-ripple-behavior'
    'iron-overlay-behavior'
    'iron-checked-element-behavior'
    'iron-button-state'
    'paper-ripple'
    'iron-flex-layout'
    'paper-styles/default-theme'
    'neon-animation-runner-behavior'
    'iron-icon'
    'paper-inky-focus-behavior'
    'paper-dialog-scrollable'
    'paper-dialog'
    'paper-textarea'
    'paper-checkbox'
    'paper-input-container'
    'paper-input-error'
    'paper-char-counter'
    'paper-tooltip'
  ]

  find_next_index_from_pos = (text, startpos, char) ->
    i = startpos
    while i < text.length
      if text[i] == char
        return i
      i += 1
    return i

  list_all_custom_polymer_elements = (input_text) ->
    i = 0
    input_text = input_text.split(' ').join('').split('\n').join('').split('\t').join('')
    output = []
    while i < input_text.length
      pattern = "Polymer({is:'"
      if input_text.substr(i, pattern.length) == pattern
        i += pattern.length
        word_end = find_next_index_from_pos(input_text, i, "'")
        word = input_text.substr(i, word_end - i)
        output.push word
        i = word_end
        continue
      i += 1
    return output

  elements_to_replace = list_all_custom_polymer_elements(intervention_code)
  elements_to_replace = elements_to_replace.concat [
    'dom-module'
  ]

  replacements = elements_to_replace.map(-> [it, 'habitlab-' + it])

  make_replacements = (input_text) ->
    i = 0
    output = []
    ol = 0
    while i < input_text.length
      made_replacement = false
      for [to_replace,replacement] in replacements
        if input_text.substr(i, to_replace.length) == to_replace
          output[ol] = replacement
          ol += 1
          made_replacement = true
          i += to_replace.length
          break
      if made_replacement
        continue
      output[ol] = input_text[i]
      ol += 1
      i += 1
    return output.join('')

  return make_replacements intervention_code

module.exports = add_habitlab_prefix_to_polymer_elements
