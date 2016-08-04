/*
 * From https://github.com/defunctzombie/node-util/blob/master/support/isBufferBrowser.js
 */

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}