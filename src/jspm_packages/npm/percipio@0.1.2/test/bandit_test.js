var should = require('chai').should()
var _ = require("underscore")
var Predictor = require('../src/bandits').Predictor
var Arm = require('../src/bandits').Arm
var createArm = require('../src/bandits').createArm

describe("Bandit Predictor", function() {

    function simulateResult(p){
        return Math.random() < p ? 1 : 0
    }

    beforeEach(function* () {
        global.rewards = [1, 2]
        global.arm1id = 1
        global.arm2id = 2
        global.predictor = Predictor([
            createArm(arm1id, rewards[0]),
            createArm(arm2id, rewards[1])])
    })

    it("should give reward", function* () {
        var arm = predictor.predict() 
        arm.reward.should.be.within(rewards[0], rewards[1])
    })

    it("should learn hidden probability", function* () {
        var armProbabilities = {}
        armProbabilities[arm1id] = 0.4
        armProbabilities[arm2id] = 0.8
        for (var i = 0; i < 1000; i++) {
            var arm = predictor.predict() 
            var p = armProbabilities[arm.id]
            predictor.learn(arm, simulateResult(p))
        }
        test2Prob = predictor.posteriorProbabilities()[1]
        mode = test2Prob.indexOf(_.max(test2Prob))
        mode.should.be.within(75, 85)
    })

})
