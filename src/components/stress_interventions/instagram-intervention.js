const {polymer_ext} = require('libs_frontend/polymer_utils');
const screenshot_utils = require('libs_common/screenshot_utils');

polymer_ext({
  is: 'instagram-intervention',
  properties: {
    width: {
      type: String,
      value: '38px',
    },
    height: {
      type: String,
      value: '38px',
    },
  },
  instagram_intervention_button_clicked: async function() {
  },
});
