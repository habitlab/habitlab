var _ = require("underscore")

var Predictor = function() {

    var self = {}
    self.totalCount = 0
    self.classCounts = {}
    self.conditionalCounts = {}

    self.learn = function(prediction, result) {
        self.totalCount++ 
        self.classCounts[result] = self.classCounts[result] === undefined ? 1 : self.classCounts[result] + 1
        if(self.conditionalCounts[result] === undefined) {
            self.conditionalCounts[result] = new Array(prediction.length+1).join('0').split('').map(parseFloat)
        }
        prediction.forEach(function(value, i) {
            self.conditionalCounts[result][i] += value
        })
    }

    function computePriors(classCounts, totalCount) {
        var priors = {}
        _.keys(classCounts).forEach(function(className) {
            priors[className] = classCounts[className] / totalCount 
        })
        return priors
    }

    function computeConditionals(conditionalCounts, classCounts) {
        var conditionals = {}
        _.keys(classCounts).forEach(function(className) {
            var classCount = classCounts[className]
            conditionals[className] = {}
            conditionalCounts[className].forEach(function(featureValue, i) {
                conditionals[className][i] = featureValue / classCount 
            })
        })
        return conditionals
    }

    self.predict = function(prediction) {
        var priors = computePriors(self.classCounts, self.totalCount)
        var conditionals = computeConditionals(self.conditionalCounts, self.classCounts)
        var classProbabilities = {}

        _.keys(self.classCounts).forEach(function(className) {
            classProbabilities[className] = Math.log(priors[className])
            prediction.forEach(function(featureValue, i) {
                if(featureValue > 0) {
                    classProbabilities[className] += Math.log(conditionals[className][i])
                }
            })
        })
        var maxProbability = _.max(classProbabilities)
        return parseFloat(_.invert(classProbabilities)[maxProbability])
    }
    

    return self
}

module.exports.Predictor = Predictor
