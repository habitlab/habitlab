
      CodeMirror.commands.save = function(){ alert("Saving"); };
      var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        mode: "text/x-csrc",
        keyMap: "vim",
        matchBrackets: true,
        showCursorWhenSelecting: true
      });
      var commandDisplay = document.getElementById('command-display');
      var keys = '';
      CodeMirror.on(editor, 'vim-keypress', function(key) {
        keys = keys + key;
        commandDisplay.innerHTML = keys;
      });
      CodeMirror.on(editor, 'vim-command-done', function(e) {
        keys = '';
        commandDisplay.innerHTML = keys;
      });
    