function median(values) {
  if ( !Array.isArray(values) ) {
    throw new TypeError('You need to pass an Array not ' + typeof values )
  }
  if ( values.length == 1 ) {
    return values[0]
  }
  values.sort( function sortValues (a, b) {
    return a - b
  })
  var half = Math.floor(values.length / 2)
  if ( values.length % 2 )
    return values[half]
  else
    return ( values[half - 1] + values[half] ) / 2.0
}

module.exports.median = median;
