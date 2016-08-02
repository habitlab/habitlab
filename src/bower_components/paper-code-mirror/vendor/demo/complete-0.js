
var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  lineNumbers: true,
  extraKeys: {"Ctrl-Space": "autocomplete"},
  mode: {name: "javascript", globalVars: true}
});

if (typeof Promise !== undefined) {
  var comp = [
    ["here", "hither"],
    ["asynchronous", "nonsynchronous"],
    ["completion", "achievement", "conclusion", "culmination", "expirations"],
    ["hinting", "advive", "broach", "imply"],
    ["function","action"],
    ["provide", "add", "bring", "give"],
    ["synonyms", "equivalents"],
    ["words", "token"],
    ["each", "every"],
  ]

  function synonyms(cm, option) {
    return new Promise(function(accept) {
      setTimeout(function() {
        var cursor = cm.getCursor(), line = cm.getLine(cursor.line)
        var start = cursor.ch, end = cursor.ch
        while (start && /\w/.test(line.charAt(start - 1))) --start
        while (end < line.length && /\w/.test(line.charAt(end))) ++end
        var word = line.slice(start, end).toLowerCase()
        for (var i = 0; i < comp.length; i++) if (comp[i].indexOf(word) != -1)
          return accept({list: comp[i],
                         from: CodeMirror.Pos(cursor.line, start),
                         to: CodeMirror.Pos(cursor.line, end)})
        return accept(null)
      }, 100)
    })
  }

  var editor2 = CodeMirror.fromTextArea(document.getElementById("synonyms"), {
    extraKeys: {"Ctrl-Space": "autocomplete"},
    lineNumbers: true,
    lineWrapping: true,
    mode: "text/x-markdown",
    hintOptions: {hint: synonyms}
  })
}
