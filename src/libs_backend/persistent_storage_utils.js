var temporary_variables = {}

async function set_var(key, val) {
  temporary_variables[key] = val;
}

async function get_var(key) {
  return temporary_variables[key];
}

module.exports = {
  set_var,
  get_var
}