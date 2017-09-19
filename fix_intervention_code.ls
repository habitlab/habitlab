require! {
  fs
}

filename = 'dist/interventions/youtube/prompt_before_watch/frontend.js' 

intervention_code = fs.readFileSync filename, 'utf-8'

add_habitlab_prefix_to_polymer_elements = require './add_habitlab_prefix_to_polymer_elements'

#console.log make_replacements(intervention_code)
fs.writeFileSync filename, add_habitlab_prefix_to_polymer_elements(intervention_code)
#console.log intervention_code
#fs.writeFileSync ''
