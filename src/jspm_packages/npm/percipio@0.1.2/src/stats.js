var _ = require("underscore")

function sum(x) {
    return x.reduce(function(a, b) {
        return a + b
    })
}

function mean(x) {
    return sum(x) / x.length
}

function min(x) {
    return _.min(x)
}

function max(x) {
    return _.max(x)
}

function variance(x) {
    var xMean = mean(x)
    var deviations = x.map(function(value) {
        return Math.pow(value - xMean, 2)
    })
    return mean(deviations)
}
function pdfbeta(x,a,b){
    _beta = beta(a, b)
    function _pdfbeta(y){
        return (Math.pow(y,a-1)*Math.pow(1-y, b - 1) )/_beta 
    }
    return x.map(_pdfbeta)
}

function beta(a,b){
    var log_n = Math.log(a)*(a - 0.5) + Math.log(b)*( b-0.5)
    var log_d = Math.log( a + b)*(a+ b-0.5)
    return Math.sqrt( 2*Math.PI)*Math.exp(log_n - log_d)
}


function rbeta(a,b){

    var p = a/b
    if (Math.min(a,b) <= 1){
        var lambda =  Math.min(a,b)
    }else{
        var lambda = Math.sqrt( (2*a*b - a - b)/(a+b-2) )
    }

    while (true) {
        var R1 = Math.random()
        var R2 = Math.random()
        var y = Math.pow( ( 1./R1 - 1.), 1./lambda )
        if ( 4*R1*R2*R2 < (Math.pow(y, a - lambda)*Math.pow(  (1.+ p)/(1 + p*y) , a + b ) )){
            return (p*y)/(1+ p*y) 
        }
    }
}

module.exports.sum = sum
module.exports.mean = mean
module.exports.min = min
module.exports.max = max
module.exports.variance = variance
module.exports.beta = beta
module.exports.rbeta = rbeta
module.exports.pdfbeta = pdfbeta
