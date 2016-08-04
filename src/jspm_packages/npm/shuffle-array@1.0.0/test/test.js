if (typeof window === 'undefined') {
  var shuffle = require('../'),
      assert = require('better-assert');
}

var collection = [1, 2, 3, 4, 5];

describe('shuffle-array', function () {

    it('should be defined', function () {
      assert(shuffle !== undefined);
    });

    it('should be a function', function () {
      assert(typeof shuffle === 'function');
    });

    it('should receive an array as parameter', function () {
      try { shuffle(); } catch(e) {
        assert(e instanceof Error);
      }

      try { shuffle({}); } catch(e) {
        assert(e instanceof Error);
      }

      try { shuffle(90); } catch(e) {
        assert(e instanceof Error);
      }

      try { shuffle('string'); } catch(e) {
        assert(e instanceof Error);
      }

    });

    it('should shuffle a given array', function () {
      var i = 0,
          len = collection.length,
          oldCollection = collection.slice(),
          newCollection = shuffle(collection);

      assert(newCollection === collection);

      for (i; i < len; i += 1) {
        if (oldCollection[i] !== collection[i]) {
         return assert(oldCollection[i] !== collection[i]);
        }
      }

    });

    it('should return a shuffled copy of the given array', function () {
      var i = 0,
          len = collection.length,
          newCollection = shuffle(collection, {'copy': true});

      assert(newCollection !== collection);
    });
});

describe('shuffle-array.pick()', function () {

    it('should be defined', function () {
      assert(shuffle.pick !== undefined);
    });

    it('should be a function', function () {
      assert(typeof shuffle.pick === 'function');
    });

    it('should receive an array as parameter', function () {
      try { shuffle.pick(); } catch(e) {
        assert(e instanceof Error);
      }
    });

    it('should return a random element from the given array', function () {
      var randomElement = shuffle.pick(collection);
      assert(collection.indexOf(randomElement) !== -1);
    });

    it('should return a collection of random element from the given array', function () {
      var newCollection = shuffle.pick(collection, {'picks': 2});

      assert(Array.isArray(newCollection));
      assert(collection.indexOf(newCollection[0]) !== -1);
    });

    it('should not return more items than what is in the array', function() {
      var newCollection = shuffle.pick(collection, {'picks': collection.length + 5});

      assert(newCollection.length == collection.length);
    });
});
