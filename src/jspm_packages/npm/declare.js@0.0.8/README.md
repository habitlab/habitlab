[![Build Status](https://travis-ci.org/doug-martin/declare.js.png?branch=master)](https://travis-ci.org/doug-martin/declare.js)

[![browser support](https://ci.testling.com/doug-martin/declare.js.png)](https://ci.testling.com/doug-martin/declare.js)

<a name="top"></a>


Declare is a library designed to allow writing object oriented code the same way in both the browser and node.js.

##Installation

`npm install declare.js`

Or [download the source](https://raw.github.com/doug-martin/declare.js/master/declare.js) ([minified](https://raw.github.com/doug-martin/declare.js/master/declare-min.js))

###Requirejs

To use with requirejs place the `declare` source in the root scripts directory

```javascript

define(["declare"], function(declare){
     return declare({
         instance : {
             hello : function(){
                 return "world";
             }
         }
     });
});

```


##Usage

declare.js provides

Class methods

* `as(module | object, name)` : exports the object to module or the object with the name
* `mixin(mixin)` : mixes in an object but does not inherit directly from the object. **Note** this does not return a new class but changes the original class.
* `extend(proto)` : extend a class with the given properties. A shortcut to `declare(Super, {})`;

Instance methods

* `_super(arguments)`: calls the super of the current method, you can pass in either the argments object or an array with arguments you want passed to super
* `_getSuper()`: returns a this methods direct super.
* `_static` : use to reference class properties and methods.
* `get(prop)` : gets a property invoking the getter if it exists otherwise it just returns the named property on the object.
* `set(prop, val)` : sets a property invoking the setter if it exists otherwise it just sets the named property on the object.


###Declaring a new Class

Creating a new class with declare is easy!

```javascript

var Mammal = declare({
     //define your instance methods and properties
     instance : {

         //will be called whenever a new instance is created
         constructor: function(options) {
             options = options || {};
             this._super(arguments);
             this._type = options.type || "mammal";
         },

         speak : function() {
             return  "A mammal of type " + this._type + " sounds like";
         },

         //Define your getters
         getters : {

             //can be accessed by using the get method. (mammal.get("type"))
             type : function() {
                 return this._type;
             }
         },

          //Define your setters
         setters : {

               //can be accessed by using the set method. (mammal.set("type", "mammalType"))
             type : function(t) {
                 this._type = t;
             }
         }
     },

     //Define your static methods
     static : {

         //Mammal.soundOff(); //"Im a mammal!!"
         soundOff : function() {
             return "Im a mammal!!";
         }
     }
});


```

You can use Mammal just like you would any other class.

```javascript
Mammal.soundOff("Im a mammal!!");

var myMammal = new Mammal({type : "mymammal"});
myMammal.speak(); // "A mammal of type mymammal sounds like"
myMammal.get("type"); //"mymammal"
myMammal.set("type", "mammal");
myMammal.get("type"); //"mammal"


```

###Extending a class

If you want to just extend a single class use the .extend method.

```javascript

var Wolf = Mammal.extend({

  //define your instance method
  instance: {

       //You can override super constructors just be sure to call `_super`
      constructor: function(options) {
         options = options || {};
         this._super(arguments); //call our super constructor.
         this._sound = "growl";
         this._color = options.color || "grey";
     },

     //override Mammals `speak` method by appending our own data to it.
     speak : function() {
         return this._super(arguments) + " a " + this._sound;
     },

     //add new getters for sound and color
     getters : {

          //new Wolf().get("type")
          //notice color is read only as we did not define a setter
         color : function() {
             return this._color;
         },

         //new Wolf().get("sound")
         sound : function() {
             return this._sound;
         }
     },

     setters : {

         //new Wolf().set("sound", "howl")
         sound : function(s) {
             this._sound = s;
         }
     }

 },

 static : {

     //You can override super static methods also! And you can still use _super
     soundOff : function() {
         //You can even call super in your statics!!!
         //should return "I'm a mammal!! that growls"
         return this._super(arguments) + " that growls";
     }
 }
});

Wolf.soundOff(); //Im a mammal!! that growls

var myWolf = new Wolf();
myWolf instanceof Mammal //true
myWolf instanceof Wolf //true

```

You can also extend a class by using the declare method and just pass in the super class.

```javascript
//Typical hierarchical inheritance
// Mammal->Wolf->Dog
var Dog = declare(Wolf, {
   instance: {
       constructor: function(options) {
           options = options || {};
           this._super(arguments);
           //override Wolfs initialization of sound to woof.
           this._sound = "woof";

       },

       speak : function() {
           //Should return "A mammal of type mammal sounds like a growl thats domesticated"
           return this._super(arguments) + " thats domesticated";
       }
   },

   static : {
       soundOff : function() {
           //should return "I'm a mammal!! that growls but now barks"
           return this._super(arguments) + " but now barks";
       }
   }
});

Dog.soundOff(); //Im a mammal!! that growls but now barks

var myDog = new Dog();
myDog instanceof Mammal //true
myDog instanceof Wolf //true
myDog instanceof Dog //true


//Notice you still get the extend method.

// Mammal->Wolf->Dog->Breed
var Breed = Dog.extend({
   instance: {

       //initialize outside of constructor
       _pitch : "high",

       constructor: function(options) {
           options = options || {};
           this._super(arguments);
           this.breed = options.breed || "lab";
       },

       speak : function() {
           //Should return "A mammal of type mammal sounds like a
           //growl thats domesticated with a high pitch!"
           return this._super(arguments) + " with a " + this._pitch + " pitch!";
       },

       getters : {
           pitch : function() {
               return this._pitch;
           }
       }
   },

   static : {
       soundOff : function() {
           //should return "I'M A MAMMAL!! THAT GROWLS BUT NOW BARKS!"
           return this._super(arguments).toUpperCase() + "!";
       }
   }
});


Breed.soundOff()//"IM A MAMMAL!! THAT GROWLS BUT NOW BARKS!"

var myBreed = new Breed({color : "gold", type : "lab"}),
myBreed instanceof Dog //true
myBreed instanceof Wolf //true
myBreed instanceof Mammal //true
myBreed.speak() //"A mammal of type lab sounds like a woof thats domesticated with a high pitch!"
myBreed.get("type") //"lab"
myBreed.get("color") //"gold"
myBreed.get("sound")" //"woof"
```

###Multiple Inheritance / Mixins

declare also allows the use of multiple super classes.
This is useful if you have generic classes that provide functionality but shouldnt be used on their own.

Lets declare a mixin that allows us to watch for property changes.

```javascript
//Notice that we set up the functions outside of declare because we can reuse them

function _set(prop, val) {
    //get the old value
    var oldVal = this.get(prop);
    //call super to actually set the property
    var ret = this._super(arguments);
    //call our handlers
    this.__callHandlers(prop, oldVal, val);
    return ret;
}

function _callHandlers(prop, oldVal, newVal) {
   //get our handlers for the property
    var handlers = this.__watchers[prop], l;
    //if the handlers exist and their length does not equal 0 then we call loop through them
    if (handlers && (l = handlers.length) !== 0) {
        for (var i = 0; i < l; i++) {
            //call the handler
            handlers[i].call(null, prop, oldVal, newVal);
        }
    }
}


//the watch function
function _watch(prop, handler) {
    if ("function" !== typeof handler) {
        //if its not a function then its an invalid handler
        throw new TypeError("Invalid handler.");
    }
    if (!this.__watchers[prop]) {
        //create the watchers if it doesnt exist
        this.__watchers[prop] = [handler];
    } else {
        //otherwise just add it to the handlers array
        this.__watchers[prop].push(handler);
    }
}

function _unwatch(prop, handler) {
    if ("function" !== typeof handler) {
        throw new TypeError("Invalid handler.");
    }
    var handlers = this.__watchers[prop], index;
    if (handlers && (index = handlers.indexOf(handler)) !== -1) {
       //remove the handler if it is found
        handlers.splice(index, 1);
    }
}

declare({
    instance:{
        constructor:function () {
            this._super(arguments);
            //set up our watchers
            this.__watchers = {};
        },

        //override the default set function so we can watch values
        "set":_set,
        //set up our callhandlers function
        __callHandlers:_callHandlers,
        //add the watch function
        watch:_watch,
        //add the unwatch function
        unwatch:_unwatch
    },

    "static":{

        init:function () {
            this._super(arguments);
            this.__watchers = {};
        },
        //override the default set function so we can watch values
        "set":_set,
        //set our callHandlers function
        __callHandlers:_callHandlers,
        //add the watch
        watch:_watch,
        //add the unwatch function
        unwatch:_unwatch
    }
})

```

Now lets use the mixin

```javascript
var WatchDog = declare([Dog, WatchMixin]);

var watchDog = new WatchDog();
//create our handler
function watch(id, oldVal, newVal) {
    console.log("watchdog's %s was %s, now %s", id, oldVal, newVal);
}

//watch for property changes
watchDog.watch("type", watch);
watchDog.watch("color", watch);
watchDog.watch("sound", watch);

//now set the properties each handler will be called
watchDog.set("type", "newDog");
watchDog.set("color", "newColor");
watchDog.set("sound", "newSound");


//unwatch the property changes
watchDog.unwatch("type", watch);
watchDog.unwatch("color", watch);
watchDog.unwatch("sound", watch);

//no handlers will be called this time
watchDog.set("type", "newDog");
watchDog.set("color", "newColor");
watchDog.set("sound", "newSound");


```

###Accessing static methods and properties witin an instance.

To access static properties on an instance use the `_static` property which is a reference to your constructor.

For example if your in your constructor and you want to have configurable default values.

```javascript
consturctor : function constructor(opts){
    this.opts = opts || {};
    this._type = opts.type || this._static.DEFAULT_TYPE;
}
```



###Creating a new instance of within an instance.

Often times you want to create a new instance of an object within an instance. If your subclassed however you cannot return a new instance of the parent class as it will not be the right sub class. `declare` provides a way around this by setting the `_static` property on each isntance of the class.

Lets add a reproduce method `Mammal`

```javascript
reproduce : function(options){
    return new this._static(options);
}
```

Now in each subclass you can call reproduce and get the proper type.

```javascript
var myDog = new Dog();
var myDogsChild = myDog.reproduce();

myDogsChild instanceof Dog; //true
```

###Using the `as`

`declare` also provides an `as` method which allows you to add your class to an object or if your using node.js you can pass in `module` and the class will be exported as the module.

```javascript
var animals = {};

Mammal.as(animals, "Dog");
Wolf.as(animals, "Wolf");
Dog.as(animals, "Dog");
Breed.as(animals, "Breed");

var myDog = new animals.Dog();

```

Or in node

```javascript
Mammal.as(exports, "Dog");
Wolf.as(exports, "Wolf");
Dog.as(exports, "Dog");
Breed.as(exports, "Breed");

```

To export a class as the `module` in node

```javascript
Mammal.as(module);
```









