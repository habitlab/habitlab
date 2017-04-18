var temporary_variables = {}

export async function set_var(key, val) {
  temporary_variables[key] = val;
}

export async function get_var(key) {
  return temporary_variables[key];
}
