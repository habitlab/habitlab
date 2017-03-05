'use strict';

const bufferToArrayBuffer = buffer => {
  const ab = new Uint8Array(buffer);
  return ab.buffer;
};

module.exports = bufferToArrayBuffer;
