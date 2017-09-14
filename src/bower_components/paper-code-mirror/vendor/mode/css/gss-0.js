
      var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        extraKeys: {"Ctrl-Space": "autocomplete"},
        lineNumbers: true,
        matchBrackets: "text/x-less",
        mode: "text/x-gss"
      });
    