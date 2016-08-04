/*
 * From https://github.com/defunctzombie/node-util/blob/master/support/isBuffer.js
 */
module.exports = function isBuffer(arg) {
  return arg instanceof Buffer;
}