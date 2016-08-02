
  var nums = "0123456789", space = "          ";
  var colors = ["#fcc", "#f5f577", "#cfc", "#aff", "#ccf", "#fcf"];
  var rulers = [], value = "";
  for (var i = 1; i <= 6; i++) {
    rulers.push({color: colors[i], column: i * 10, lineStyle: "dashed"});
    for (var j = 1; j < i; j++) value += space;
    value += nums + "\n";
  }
  var editor = CodeMirror(document.body.lastChild, {
    rulers: rulers,
    value: value + value + value,
    lineNumbers: true
});
