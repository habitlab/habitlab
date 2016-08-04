var _ = require("underscore")
var rbeta = require("./stats").rbeta
var pdfbeta = require("./stats").pdfbeta
var beta = require("./stats").beta

var Predictor = function(arms) {

    var self = {}
    var bayesianBanditStrategy = BayesianBanditStrategy(arms)

    self.predict = function() {
        var arm = bayesianBanditStrategy.maxPrizeArm()
        return arm
    }

    self.learn = function(prediction, result) {
        bayesianBanditStrategy.update(prediction, result)
    }

    self.posteriorProbabilities = function() {
        return bayesianBanditStrategy.armPosteriors()
    }

    return self
}

function createArm(id, reward) {
    return Arm(id, reward, 0 ,0)
}

var Arm = function(id, reward, wins, trials) {

    var self = {}

    self.id = id
    self.reward = reward
    self.wins = wins
    self.trials = trials

    self.losses = function() {
        return self.trials - self.wins
    }

    self.prizeProbability = function() {
        return rbeta(1 + self.wins, 1 + self.losses())
    }

    self.posterior = function(range) {
        return pdfbeta(range, 1 + self.wins, 1 + self.losses()) 
    }

    return self
}

var BayesianBanditStrategy = function(arms) {

    var self = {}
    self.arms = arms

    self.maxPrizeArm = function() {
        return _.max(self.arms, function(a) { return a.prizeProbability() })
    }

    self.update = function(arm, result) {
        var arm = _.find(self.arms, function(a) { return a.id == arm.id })
        arm.wins += result
        arm.trials += 1
    }

    self.armPosteriors = function() {
        x = _.range(0, 1, 0.01)
        return self.arms.map(function(a) { return a.posterior(x) })
    }

    return self
}

module.exports.Predictor = Predictor
module.exports.Arm = Arm
module.exports.createArm = createArm
