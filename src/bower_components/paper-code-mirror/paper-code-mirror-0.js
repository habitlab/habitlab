
        require([
            "./vendor/lib/codemirror",
            "./vendor/mode/python/python",
            "./vendor/mode/ruby/ruby",
            "./vendor/mode/php/php",
            "./vendor/mode/pascal/pascal",
            "./vendor/mode/sql/sql",
            "./vendor/mode/clike/clike",
            "./vendor/mode/xml/xml",
            "./vendor/mode/javascript/javascript",
            "./vendor/mode/css/css",
            "./vendor/mode/vbscript/vbscript",
            "./vendor/mode/htmlmixed/htmlmixed",
            "./vendor/mode/apl/apl",
            "./vendor/mode/asciiarmor/asciiarmor",
            "./vendor/mode/markdown/markdown",
            "./vendor/mode/clojure/clojure",
            "./vendor/mode/cmake/cmake",
            "./vendor/mode/dart/dart",
            "./vendor/mode/fortran/fortran",
            "./vendor/mode/haskell/haskell",
            "./vendor/mode/jade/jade",
            "./vendor/mode/sass/sass",
            "./vendor/mode/shell/shell",
            "./vendor/mode/xml/xml",
            "./vendor/mode/yaml/yaml",
            "./vendor/addon/fold/foldcode",
            "./vendor/addon/fold/foldgutter",
            "./vendor/addon/fold/brace-fold",
            "./vendor/addon/fold/xml-fold",
            "./vendor/addon/fold/markdown-fold",
            "./vendor/addon/fold/comment-fold",
            "./vendor/addon/search/searchcursor",
            "./vendor/addon/format/formatting"
        ], function(CodeMirror) {

            Polymer({
                is : 'paper-code-mirror',
                properties : {
                    value       : {
                        type  : String,
                        value : ''
                    },
                    tabSize     : {
                        type  : Number,
                        value : 2
                    },
                    mode        : {
                        type  : String,
                        value : 'htmlmixed'
                    },
                    theme       : {
                        type  : String,
                        value : 'material'
                    },
                    lineNumbers : {
                        type  : Boolean,
                        value : false
                    },
                    title: {
                        type: String,
                        value: ''
                    }
                },
                ready : function() {
                    var that = this;

                    if(!that.value && that.$.content && that.$.content.children[0]) {
                        that.value = that.$.content.children[0].innerHTML;
                    }

                    that.mirror = CodeMirror(that.$.wrapper, {
                        value       : that.value,
                        mode        : that.mode,
                        theme       : that.theme,
                        lineNumbers : that.lineNumbers,
                        tabSize     : that.tabSize,
                        indentUnit  : 2,
                        smartIndent : true,
                        inputStyle  : 'contenteditable',
                    });

                    that.async(function(){
                        that.mirror.refresh();
                    }, 700);

                    var totalLines = that.mirror.lineCount();
                    that.mirror.autoFormatRange({ line:0, ch:0 }, {line:totalLines});

                    that.attachEvents();
                },
                attachEvents: function(){
                    var that = this;
                    console.log('attachEvents being called')
                    that.mirror.on('change', function(e) {
                        //that.fire('change');
                        var newval = e.getValue().toString();
                        //that.codevalue = newval;
                        //that.value = newval;
                        that.fire('change', {value: newval});
                    });

                    /*
                    that.mirror.on('keydown', function(e) {
                        console.log('keydown called')
                        that.fire('change');
                    });

                    that.mirror.on('keyup', function(e) {
                        that.fire('change');
                    });

                    that.mirror.on('keypress', function(e) {
                        that.fire('change');
                    });
                    */
                },
                attached : function() {
                    var that = this;
                    that.mirror.refresh();
                    //that.focus();
                },
                focus : function() {
                    this.mirror.focus();
                }
            });

        });
