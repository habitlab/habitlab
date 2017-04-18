import $ from 'jquery'

export async function ajax(options) {
  return await $.ajax(options);
}
