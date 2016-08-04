var _ = require("underscore")

function totalRegret(probabilities, choices) {
    var regret = []
    var maxProbability = _.max(probabilities)
    var cumulative = 0
    choices.forEach(function(c) {
        cumulative += maxProbability - probabilities[c]
        regret.push(cumulative)
    })
    return regret
}

module.exports.totalRegret = totalRegret
