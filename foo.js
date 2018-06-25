var bandits = require('percipio').bandits
var BanditPredictor = bandits.Predictor

var rewards = ["Java", "C#"]
var armIds = [0, 1]

var predictor = BanditPredictor([
    bandits.createArm(armIds[0], rewards[0]),
    bandits.createArm(armIds[1], rewards[1])
])

var hiddenProbabilities = [0.2, 0.8]

function simulateResult(p){
    return Math.random() < p ? 1 : 0
}

for (var i = 0; i < 1000; i++) {
    var arm = predictor.predict() 
    var p = hiddenProbabilities[arm.id]
    predictor.learn(arm, simulateResult(p))
}

var javaProbabilities = predictor.posteriorProbabilities()[0]
var cSharpProbabilities = predictor.posteriorProbabilities()[1]
console.log(javaProbabilities)
console.log(cSharpProbabilities)
console.log(javaProbabilities[21])
console.log(cSharpProbabilities[80])
console.log(cSharpProbabilities.length)