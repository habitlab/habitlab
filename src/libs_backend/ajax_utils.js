const $ = require('jquery');

async function ajax(options) {
  return await $.ajax(options);
}

module.exports = {
  ajax
}
