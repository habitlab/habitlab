
function getNewItem() {
  function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  var names = ['Artur', 'Patrik', 'Henrik', 'Teemu'];
  var surnames = ['Signell', 'Lehtinen', 'Ahlroos', 'Paul'];
  return {
    name: random(names),
    surname: random(surnames),
    effort: Math.floor(Math.random() * 6)
  };
}

function getItems() {
  var items = [];
  for (var i = 0; i < 100; i++) {
    items.push(getNewItem());
  }
  return items;
}
