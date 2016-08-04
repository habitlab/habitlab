# Percipio - Easy Data Science (Machine Learning) in JavaScript & Node

Percipio is a simple minimalistic JavaScript library for understanding & making decisions with data.

# Features

- Bayesian Bandit algorithm (using Thompson sampling)
- Naive Bayes classifier

# Install

    npm install percipio

# Quick Start

Let's find out which programming language is better! Java or C#, anyone? (this might be a bit contrived example...)
We can model this using simple Multi-armed bandit experiment ([Multi-armed bandit experiments are even used by Google](https://support.google.com/analytics/answer/2844870?hl=en))

### Experiment setup

We define 2 arms (possible outcomes) as follows 

- <em>Arm 1</em> - id: 1, reward: Java
- <em>Arm 2</em> - id: 2, reward: C#

and create the Bandit predictor

```javascript
var bandits = require('percipio').bandits
var BanditPredictor = bandits.Predictor

var rewards = ["Java", "C#"]
var armIds = [0, 1]

var predictor = BanditPredictor([
    bandits.createArm(armIds[0], rewards[0]),
    bandits.createArm(armIds[1], rewards[1])
])
```

### Hidden probabilities

Next let's choose the probabilities which the predictor should find

```javascript 
var hiddenProbabilities = [0.5, 0.7] 
```

### Simulation

Let's define our result simulation function (in the real world you should get results from your app, users etc.)

```javascript
function simulateResult(p){
    return Math.random() < p ? 1 : 0
}
```

And run the simulation

```javascript
for (var i = 0; i < 1000; i++) {
    var arm = predictor.predict() 
    var p = hiddenProbabilities[arm.id]
    predictor.learn(arm, simulateResult(p))
}
```

### Result

Now the predictor has (hopefully) learned the hidden probabilities and we can get them

```javascript
var javaProbabilities = predictor.posteriorProbabilities()[0]
var cSharpProbabilities = predictor.posteriorProbabilities()[1]
console.log(javaProbabilities)
console.log(cSharpProbabilities)
```

### Complete example

Now try to run this yourself

```javascript
var bandits = require('percipio').bandits
var BanditPredictor = bandits.Predictor

var rewards = ["Java", "C#"]
var armIds = [0, 1]

var predictor = BanditPredictor([
    bandits.createArm(armIds[0], rewards[0]),
    bandits.createArm(armIds[1], rewards[1])
])

var hiddenProbabilities = [0.5, 0.7]

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
```

# Current state

Pretty alphaish, I guess. Looking forward to implement

- kNN
- Linear regression
- Data loaders/importers

# Wanna help out?

Hop right in!

## Development setup

```bash
git clone git@github.com:naughtyspirit/percipio.git
cd percipio
npm install
```

## Run tests

```bash
npm test
```

# License

MIT
