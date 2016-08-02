
  var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    mode: "scheme",
    lineNumbers: true
  });
  var pending;
  editor.on("change", function() {
    clearTimeout(pending);
    pending = setTimeout(update, 400);
  });
  function looksLikeScheme(code) {
    return !/^\s*\(\s*function\b/.test(code) && /^\s*[;\(]/.test(code);
  }
  function update() {
    editor.setOption("mode", looksLikeScheme(editor.getValue()) ? "scheme" : "javascript");
  }
