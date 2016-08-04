[![Build Status](https://travis-ci.org/doug-martin/array-extended.png?branch=master)](https://travis-ci.org/doug-martin/array-extended)

[![browser support](https://ci.testling.com/doug-martin/array-extended.png)](https://ci.testling.com/doug-martin/array-extended)

# array-extended

`array-extended` is a Javascript library that can be used standalone or incorporated into [`extended`](https://github.com/doug-martin/extended)

```javascript
var array = require("array-extended");
```

Or

```javascript
var myextended = require("extended")
	.register(require("array-extended"));
```

## Installation

```
npm install array-extended
```

Or [download the source](https://raw.github.com/doug-martin/array-extended/master/index.js) ([minified](https://raw.github.com/doug-martin/array-extended/master/array-extended.min.js))

## Usage

`array-extended` includes many useful methods that for array. All of the functions can be chained together using `array-exteded` as a function or you can use the functions directly as shown in the examples.

 The following native `ES5` methods are included for completeness.

 * `forEach`
 * `map`
 * `filter`
 * `reduce`
 * `reduceRight`
 * `some`
 * `every`
 * `indexOf`
 * `lastIndexOf`

**Note** `forEach` returns the original array for chaining purposes.

**`sum`**

Sums the values of an array.

```javascript

array.sum([1,2,3]); //6

array([1,2,3]).sum().value(); //6

```

**`avg`**

Finds the average of an array of numbers.

```javascript

array.avg([1,2,3]); //2

array([1,2,3]).avg().value(); //2

```

**`sort`**

Sorts an array based on a property, by natural ordering, or by a custom comparator.

**Note** this does not change the original array.

```javascript

array.sort([{a: 1},{a: 2},{a: -2}], "a"); //[{a: -2},{a: 1},{a: 2}];

array([{a: 1},{a: 2},{a: -2}]).sort("a"); //[{a: -2},{a: 1},{a: 2}];


```

**`min`**

Finds the minimum value in an array based on a property, by natural ordering, or by a custom comparator.

```javascript

array.min([ 3, -3, -2, -1, 1, 2]); //-3

array.min([{a: 1},{a: 2},{a: -2}], "a"); //{a : -2}

array([ 3, -3, -2, -1, 1, 2]).min(); //-3

array([{a: 1},{a: 2},{a: -2}]).min("a"); //{a : -2}

```

**`max`**

Finds the maximum value in an array based on a property, by natural ordering, or by a custom comparator.

```javascript

array.max([ 3, -3, -2, -1, 1, 2]); //2

array.max([{a: 1},{a: 2},{a: -2}], "a"); //{a : 2}

array([ 3, -3, -2, -1, 1, 2]).max(); //2

array([{a: 1},{a: 2},{a: -2}]).max("a"); //{a : 2}

```

**`difference`**

Finds the difference between two arrays.

```javascript
array.difference([1, 2, 3], [2]); //[1, 3]
array.difference([true, false], [false]); //[true]
array.difference(["a", "b", 3], [3]); //["a", "b"]

var a = , b = , c = ;
array.difference([{a: 1}, {a: 2}, {a: 3}], [{a: 2}, {a: 3}]); //[{a: 1}]

array([true, false]).difference([false]).value()// [true]
array([1, 2, 3]).difference([2]).value()// [1, 3]
array([1, 2, 3]).difference([2], [3]).value(); //[1]
array(["a", "b", 3]).difference([3]).value(); ["a", "b"]
array([{a: 1}, {a: 2}, {a: 3}]).difference([{a: 2}, {a: 3}]).value(); [{a: 1}]
```

**`unique`**

Removed duplicate values from an array.

```javascript

array.unique([1, 2, 2, 3, 3, 3, 4, 4, 4]); //[1, 2, 3, 4]
array([1, 2, 2, 3, 3, 3, 4, 4, 4]).unique().value();  //[1, 2, 3, 4]

array(["a", "b", "b"]).unique().value(); //["a", "b"]
array.unique(["a", "b", "b"]); //["a", "b"]

```

**`rotate`**

Rotates an array by the number of places for 1 position by default.

```javascript

var arr = array(["a", "b", "c", "d"])
arr.rotate().value();   //["b", "c", "d", "a"]
arr.rotate(2).value();  //["c", "d", "a", "b"]
arr.rotate(3).value();  //["d", "a", "b", "c"]
arr.rotate(4).value();  //["a", "b", "c", "d"]
arr.rotate(-1).value(); //["d", "a", "b", "c"]
arr.rotate(-2).value(); //["c", "d", "a", "b"]
arr.rotate(-3).value(); //["b", "c", "d", "a"]
arr.rotate(-4).value(); //["a", "b", "c", "d"]

var arr = ["a", "b", "c", "d"];
array.rotate(arr);     //["b", "c", "d", "a"]
array.rotate(arr, 2);  //["c", "d", "a", "b"]
array.rotate(arr, 3);  //["d", "a", "b", "c"]
array.rotate(arr, 4);  //["a", "b", "c", "d"]
array.rotate(arr, -1)  //["d", "a", "b", "c"]
array.rotate(arr, -2); //["c", "d", "a", "b"]
array.rotate(arr, -3); //["b", "c", "d", "a"]
array.rotate(arr, -4); //["a", "b", "c", "d"]

```

**`permutations`**

Finds all permutations of an array.

```javascript

array([1, 2, 3]).permutations(); //[
                                 //   [ 1, 2, 3 ],
                                 //   [ 1, 3, 2 ],
                                 //   [ 2, 3, 1 ],
                                 //   [ 2, 1, 3 ],
                                 //   [ 3, 1, 2 ],
                                 //   [ 3, 2, 1 ]
                                 //]

array([1, 2, 3]).permutations(2);//[
                                 //   [ 1, 2],
                                 //   [ 1, 3],
                                 //   [ 2, 3],
                                 //   [ 2, 1],
                                 //   [ 3, 1],
                                 //   [ 3, 2]
                                 //]

array.permutations([1, 2, 3]);   //[
                                 //   [ 1, 2, 3 ],
                                 //   [ 1, 3, 2 ],
                                 //   [ 2, 3, 1 ],
                                 //   [ 2, 1, 3 ],
                                 //   [ 3, 1, 2 ],
                                 //   [ 3, 2, 1 ]
                                 //]

array.permutations(([1, 2, 3], 2);//[
                                 //   [ 1, 2],
                                 //   [ 1, 3],
                                 //   [ 2, 3],
                                 //   [ 2, 1],
                                 //   [ 3, 1],
                                 //   [ 3, 2]
                                 //]

```

**`zip`**

Zips the values of multiple arrays into a single array.

```javascript

array([1]).zip([2], [3]).value();                    //[
                                                     //  [ 1, 2, 3 ]
                                                     //];

array([1, 2]).zip([2], [3]).value();                 //[
                                                     //  [ 1, 2, 3 ],
                                                     //  [2, null, null]
                                                     //]

array([1, 2, 3]).zip([ 4, 5, 6 ], b).value();        //[
                                                     //  [1, 4, 7],
                                                     //  [2, 5, 8],
                                                     //  [3, 6, 9]
                                                     //]

array([1, 2]).zip([ 4, 5, 6 ],  [7, 8, 9 ]).value(); //[
                                                     //  [1, 4, 7],
                                                     //  [2, 5, 8]
                                                     //]

array([ 4, 5, 6 ]).zip([1, 2], [8]).value(),         //[
                                                     //  [4, 1, 8],
                                                     //  [5, 2, null],
                                                     //  [6, null, null]
                                                     //]


array.zip([1], [2], [3]);                   //[
                                            //  [ 1, 2, 3 ]
                                            //]

array.zip([1, 2], [2], [3]);                //[
                                            //  [ 1, 2, 3 ],
                                            //  [2, null, null]
                                            //]

array.zip([1, 2, 3], [4,5,6],  [7, 8, 9 ]); //[
                                            //  [1, 4, 7],
                                            //  [2, 5, 8],
                                            //  [3, 6, 9]
                                            //]

array.zip([1, 2], [4,5,6],  [7, 8, 9 ]);    //[
                                            //  [1, 4, 7],
                                            //  [2, 5, 8]
                                            //]

array.zip([ 4, 5, 6 ], [1, 2], [8]);        //[
                                            //  [4, 1, 8],
                                            //  [5, 2, null],
                                            //  [6, null, null]
                                            //]

```

**`transpose`**

Transpose a multi dimensional array.

```javascript
array([[1, 2, 3],[4, 5, 6]]).transpose().value();   //[ [ 1, 4 ], [ 2, 5 ], [ 3, 6 ] ]
array([[1, 2],[3, 4],[5, 6]]).transpose().value();  //[ [ 1, 3, 5 ], [ 2, 4, 6 ] ]
array([[1],[3, 4],[5, 6]]).transpose().value();     //[ [1] ]


array.transpose([[1, 2, 3],[4, 5, 6]]);             //[ [ 1, 4 ], [ 2, 5 ], [ 3, 6 ] ]
array.transpose([[1, 2],[3, 4],[5, 6]]);            //[ [ 1, 3, 5 ], [ 2, 4, 6 ] ]
array.transpose([[1],[3, 4],[5, 6]]);               //[ [1] ]
```

**`valuesAt`**

Gathers values and the specified indexes.

```javascript

var arr = array(["a", "b", "c", "d"]);
arr.valuesAt(1, 2, 3).value();      //["b", "c", "d"]
arr.valuesAt(1, 2, 3, 4).value();   //["b", "c", "d", null]
arr.valuesAt(0, 3).value();         //["a", "d"]

arr = ["a", "b", "c", "d"];
array.valuesAt(arr, 1, 2, 3);       //["b", "c", "d"]
array.valuesAt(arr, 1, 2, 3, 4);    //["b", "c", "d", null]
array.valuesAt(arr, 0, 3);          //["a", "d"]
```

**`union`**

Finds the union of two arrays.

```javascript
array(["a", "b", "c"]).union(["b", "c", "d"]).value();  //["a", "b", "c", "d"]);
array(["a"]).union(["b"], ["c"], ["d"], ["c"]).value(); //["a", "b", "c", "d"]);

array.union(["a", "b", "c"], ["b", "c", "d"]);          //["a", "b", "c", "d"]);
array.union(["a"], ["b"], ["c"], ["d"], ["c"]);         //["a", "b", "c", "d"]);
```

**`intersect`**

Finds the intersection of two arrays.

```javascript
array([1, 2]).intersect([2, 3], [2, 3, 5]).value();                     //[2]);
array([1, 2, 3]).intersect([2, 3, 4, 5], [2, 3, 5]).value();            //[2, 3]);
array([1, 2, 3, 4]).intersect([2, 3, 4, 5], [2, 3, 4, 5]).value();      //[2, 3, 4]);
array([1, 2, 3, 4, 5]).intersect([1, 2, 3, 4, 5], [1, 2, 3]).value();   //[1, 2, 3]);
array([[1, 2, 3, 4, 5],[1, 2, 3, 4, 5],[1, 2, 3]]).intersect().value(); //[1, 2, 3]);

array.intersect([1, 2], [2, 3], [2, 3, 5]);                             //[2]
array.intersect([1, 2, 3], [2, 3, 4, 5], [2, 3, 5]);                    //[2, 3]
array.intersect([1, 2, 3, 4], [2, 3, 4, 5], [2, 3, 4, 5]);              //[2, 3, 4]
array.intersect([1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 2, 3]);           //[1, 2, 3]);
array.intersect([[1, 2, 3, 4, 5],[1, 2, 3, 4, 5], [1, 2, 3]]);          //[1, 2, 3]);
```

**`powerSet`**

Finds the powerset of a given array.

```javascript
array([1, 2, 3]).powerSet().value();
array.powerSet([1, 2, 3]);
//[
//  [],
//  [ 1 ],
//  [ 2 ],
//  [ 1, 2 ],
//  [ 3 ],
//  [ 1, 3 ],
//  [ 2, 3 ],
//  [ 1, 2, 3 ]
//]
```

**`cartesian`**

Finds the cartesian product of arrays.

```javascript
array([1, 2]).cartesian([2, 3]).value();
array.cartesian([1, 2], [2, 3]);
//[
//  [1, 2],
//  [1, 3],
//  [2, 2],
//  [2, 3]
//]
```

**`compact`**

Compacts the values of an array.

```javascript
array([1, null, null, x, 2]).compact().value(); //[1, 2]

array([1, 2]).compact().value();  //[1, 2]


array.compact([1, null, null, x, 2]); //[1, 2]
array.compact([1, 2]); //[1, 2]
```

**`multiply`**

Repoduces the values in an array the given number of times.

```javascript
array([1, 2]).multiply(2).value(); //[1, 2, 1, 2, 1, 2]

array.multiply([1, 2, 3], 2); //[1, 2, 3, 1, 2, 3]
```

**`flatten`**

Flatten multiple arrays into a single array.

```javascript

array([ [1], [2], [3] ]).flatten().value(); //[1, 2, 3]

array.flatten([1, 2], [2, 3], [3, 4]); //[1, 2, 2, 3, 3, 4]

```

**`pluck`**

Pluck properties from values in an array.

```javascript
var arr = [
    {name: {first: "Fred", last: "Jones"}, age: 50, roles: ["a", "b", "c"]},
    {name: {first: "Bob", last: "Yukon"}, age: 40, roles: ["b", "c"]},
    {name: {first: "Alice", last: "Palace"}, age: 35, roles: ["c"]},
    {name: {first: "Johnny", last: "P."}, age: 56, roles: []}
];

array.pluck(arr, "name.first"); //["Fred", "Bob", "Alice", "Johnny"]
array(arr).pluck("age"); //[50, 40, 35, 56]

```

**`invoke`**

Invokes the specified method on each value in an array.

```javascript

function person(name, age) {
    return {
        getName: function () {
            return name;
        },

        getOlder: function () {
            age++;
            return this;
        },

        getAge: function () {
            return age;
        }
    };
};

var arr = [person("Bob", 40), person("Alice", 35), person("Fred", 50), person("Johnny", 56)];

array.invoke(arr, "getName"); //["Bob", "Alice", "Fred", "Johnny"];
array(arr).invoke("getName").value(); //["Bob", "Alice", "Fred", "Johnny"];

array(arr).invoke("getOlder").invoke("getAge").value(); //[41, 36, 51, 57];
```
