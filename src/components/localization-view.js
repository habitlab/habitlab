const {
  to_ascii_localization_keyname
} = require('libs_common/localization_utils');

Polymer({
  is: 'localization-view',
  properties: {
    messages_json_output_text: {
      type: String,
      value: ''
    }
  },
  ready: async function() {
    let unlocalized_strings_num_encounters = localStorage.getItem('unlocalized_strings_num_encounters');
    if (unlocalized_strings_num_encounters == null) {
      return;
    }
    unlocalized_strings_num_encounters = JSON.parse(unlocalized_strings_num_encounters);
    let unlocalized_strings = Object.keys(unlocalized_strings_num_encounters);
    let messages_json_output = {};
    for (let x of unlocalized_strings) {
      const key = to_ascii_localization_keyname(x);
      messages_json_output[key] = {
        message: x
      }
    }
    messages_json_output = Object.keys(messages_json_output).sort().reduce((c, d) => (c[d] = messages_json_output[d], c), {});
    this.messages_json_output_text = JSON.stringify(messages_json_output, null, 2);
  }
})
