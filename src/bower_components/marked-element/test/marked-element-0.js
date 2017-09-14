
    'use strict';

    // Thanks IE10.
    function isHidden(element) {
      var rect = element.getBoundingClientRect();
      return (rect.width == 0 && rect.height == 0);
    }

    // Replace reserved HTML characters with their character entity equivalents to match the
    // transform done by Markdown.
    //
    // The Marked library itself is not used because it wraps code blocks in `<code><pre>`, which is
    // superfluous for testing purposes.
    function escapeHTML(string) {
      var span = document.createElement('span');
      span.textContent = string;
      return span.innerHTML;
    }

    suite('<marked-element> has some options of marked available', function( ){
      var markedElement;
      var outputElement;
      setup(function() {
        markedElement = fixture('SmartyPants');
        outputElement = document.getElementById('output');
      });
      test('has sanitize', function() {
        expect(markedElement.sanitize).to.equal(false);
      });
      test('has sanitizer', function() {
        expect(markedElement.sanitizer).to.equal(null);
      });
      test('has pedantic', function() {
        expect(markedElement.pedantic).to.equal(false);
      });
      test('has breaks', function() {
        expect(markedElement.breaks).to.equal(false);
      });
      test('has smartypants', function() {
        expect(markedElement.smartypants).to.equal(true);
      });
    });

    suite('<marked-element> has some options of marked available', function( ){
      var markedElement;
      var proofElement;
      var outputElement;
      setup(function() {
        markedElement = fixture('CustomCallbackFunction');
        proofElement = document.createElement('div');
        outputElement = document.getElementById('output');
      });
      test('calls callback after render', function() {
        proofElement.innerHTML = '<div>Overridden!</div>'
        markedElement.callback = function(err, text) {
          assert.equal(text, '<p>Some content</p>\n');
          return '<div>Overridden!</div>';
        }
        expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
      });
    });

    suite('<marked-element> with .markdown-html child', function() {

      suite('ignores no content', function() {
        var markedElement;
        var proofElement;
        var outputElement;

        setup(function() {
          markedElement = fixture('NoContent');
          proofElement = document.createElement('div');
          outputElement = document.getElementById('output');
        });

        test('in code blocks', function() {
          proofElement.innerHTML = '';
          expect(outputElement).to.equal(markedElement.outputElement);
          expect(isHidden(markedElement.$.content)).to.be.true;
          expect(markedElement.markdown).to.equal(null);

          expect(outputElement.innerHTML).to.equal(proofElement.innerHTML)
        });
      });

      suite('respects camelCased HTML', function() {
        var markedElement;
        var proofElement;
        var outputElement;

        setup(function() {
          markedElement = fixture('CamelCaseHTML');
          proofElement = document.createElement('div');
          outputElement = document.getElementById('output');
        });

        test('in code blocks', function() {
          proofElement.innerHTML = '<div camelCase></div>';
          expect(outputElement).to.equal(markedElement.outputElement);
          expect(isHidden(markedElement.$.content)).to.be.true;

          // If Markdown content were put into a `<template>` or directly into the DOM, it would be
          // rendered as DOM and be converted from camelCase to lowercase per HTML parsing rules. By
          // using `<script>` descendants, content is interpreted as plain text.
          expect(proofElement.innerHTML).to.eql('<div camelcase=""></div>')
          expect(outputElement.innerHTML).to.include(escapeHTML('<div camelCase>'));
        });
      });

      suite('respects bad HTML', function() {
        var markedElement;
        var proofElement;
        var outputElement;

        setup(function() {
          markedElement = fixture('BadHTML');
          proofElement = document.createElement('div');
          outputElement = document.getElementById('output');
        });

        test('in code blocks', function() {
          proofElement.innerHTML = '<p><div></p></div>';
          expect(outputElement).to.equal(markedElement.outputElement);
          expect(isHidden(markedElement.$.content)).to.be.true;

          // If Markdown content were put into a `<template>` or directly into the DOM, it would be
          // rendered as DOM and close unbalanced tags. Because they are in code blocks they should
          // remain as typed.
          // Turns out, however IE and everybody else have slightly different opinions
          // about how the incorrect HTML should be fixed. It seems that:
          // IE says:       <p><div></p></div> -> <p><div><p></p></div>
          // Chrome/FF say: <p><div></p></div> -> <p></p><div><p></p></div>.
          // So that's cool.
          var isEqualToOneOfThem =
              proofElement.innerHTML === '<p><div><p></p></div>' ||
              proofElement.innerHTML === '<p></p><div><p></p></div>';
          expect(isEqualToOneOfThem).be.true;
          expect(outputElement.innerHTML).to.include(escapeHTML('<p><div></p></div>'));
        });
      });

    });

    suite('<marked-element> without .markdown-html child', function() {

      suite('respects camelCased HTML', function() {
        var markedElement;
        var proofElement;

        setup(function() {
          markedElement = fixture('CamelCaseHTMLWithoutChild');
          proofElement = document.createElement('div');
        });

        test('in code blocks', function() {
          Polymer.dom(proofElement).innerHTML = '<div camelCase></div>';
          expect(markedElement.$.content).to.equal(markedElement.outputElement);
          Polymer.dom.flush();
          expect(isHidden(markedElement.$.content)).to.be.false;

          // If Markdown content were put into a `<template>` or directly into the DOM, it would be
          // rendered as DOM and be converted from camelCase to lowercase per HTML parsing rules. By
          // using `<script>` descendants, content is interpreted as plain text.
          expect(proofElement.innerHTML).to.eql('<div camelcase=""></div>')
          expect(markedElement.$.content.innerHTML).to.include(escapeHTML('<div camelCase>'));
        });
      });

      suite('respects bad HTML', function() {
        var markedElement;
        var proofElement;

        setup(function() {
          markedElement = fixture('BadHTMLWithoutChild');
          proofElement = document.createElement('div');
        });

        test('in code blocks', function() {
          proofElement.innerHTML = '<p><div></p></div>';
          expect(markedElement.$.content).to.equal(markedElement.outputElement);
          Polymer.dom.flush();
          expect(isHidden(markedElement.$.content)).to.be.false;

          // If Markdown content were put into a `<template>` or directly into the DOM, it would be
          // rendered as DOM and close unbalanced tags. Because they are in code blocks they should
          // remain as typed.
          // Turns out, however IE and everybody else have slightly different opinions
          // about how the incorrect HTML should be fixed. It seems that:
          // IE says:       <p><div></p></div> -> <p><div><p></p></div>
          // Chrome/FF say: <p><div></p></div> -> <p></p><div><p></p></div>.
          // So that's cool.
          var isEqualToOneOfThem =
              proofElement.innerHTML === '<p><div><p></p></div>' ||
              proofElement.innerHTML === '<p></p><div><p></p></div>';
          expect(isEqualToOneOfThem).be.true;
          expect(markedElement.$.content.innerHTML).to.include(escapeHTML('<p><div></p></div>'));
        });
      });

    });

    suite('<marked-element> with custom sanitizer', function() {
      var markedElement;
      var outputElement;
      var proofElement;

      setup(function() {
        markedElement = fixture('Sanitizer');
        outputElement = document.getElementById('output');
        proofElement = document.createElement('div');
      });

      test('takes custom sanitizer', function() {
        markedElement.sanitizer = function (input) {
          return input
            .replace(/ onclick="[^"]+"/, '');
        };
        proofElement.innerHTML = '<p><a href="http://url.com&quot; onclick=&quot;alert(1">Link</a>")\n<a href="http://url.com">Link</a></p>\n<pre><code class="lang-html">&lt;a href="http://url.com" onclick="alert(1)"&gt;Link&lt;/a&gt;\n</code></pre>\n';
        expect(outputElement.innerHTML).to.include(proofElement.innerHTML);
      });
    });

    suite('<marked-element> with custom renderer', function() {
      var markedElement;
      var outputElement;
      var proofElement;

      setup(function() {
        markedElement = fixture('Renderer');
        outputElement = document.getElementById('output');
        proofElement = document.createElement('div');
      });

      test('takes custom link renderer', function() {
        markedElement.renderer = function (renderer) {
          renderer.link = (href, title, text) => {
            return `<a href="${href}" target="_blank">${text}</a>`;
          };
        };
        proofElement.innerHTML = '<a href="http://url.com" target="_blank">Link</a>';
        expect(outputElement.innerHTML).to.include(proofElement.innerHTML);
      });
    });

    suite('<marked-element> with remote content', function() {
      var markedElement;
      var markedHost;
      var outputElement;
      var proofElement;

      suite('succesful fetch', function() {
        setup(function() {
          markedElement = fixture('RemoteContent');
          outputElement = document.getElementById('output');
          proofElement = document.createElement('div');
        });

        test('renders remote content', function(done) {
          proofElement.innerHTML = '<h1 id="test">Test</h1>\n<p><a href="http://url.com/">Link</a></p>\n';
          markedElement.addEventListener('marked-loadend', function() {
            expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
            done();
          });
        });

        test('renders content while remote content is loading', function() {
          proofElement.innerHTML = '<h1 id="loading">Loading</h1>\n<p>Please wait...</p>\n';
          expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
        });

        test('renders new remote content when src changes', function(done) {
          markedElement.addEventListener('marked-loadend', function firstCheck() {
            markedElement.removeEventListener('marked-loadend', firstCheck);
            proofElement.innerHTML = '<h1 id="test-2">Test 2</h1>\n';
            Polymer.dom(markedElement).querySelector('[type="text/markdown"]').src = 'test2.md';

            markedElement.addEventListener('marked-loadend', function() {
              expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
              done();
            });
          });
        });
      });

      suite('fails to load', function() {
        setup(function() {
          markedElement = fixture('BadRemoteContent');
          outputElement = document.getElementById('output');
          proofElement = document.createElement('div');
        });

        test('renders error message', function(done) {
          proofElement.innerHTML = '<p>Failed loading markdown source</p>\n';
          markedElement.addEventListener('marked-loadend', function() {
            expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
            done();
          });
        });

        test('doesn\'t render error message when default is prevented', function(done) {
          proofElement.innerHTML = '';
          markedElement.addEventListener('marked-request-error', function(e) {
            e.preventDefault();
            flush(function() {
              expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
              done();
            });
          });
        });
      });

      suite('changing remote content with data binding', function() {
        setup(function() {
          markedHost = fixture('ChangingRemoteContent');

          if (!Polymer.Element) {
            markedHost = markedHost.children[0];
          }

          markedElement = markedHost.$.markedElement;
          outputElement = markedHost.$.output;
          proofElement = document.createElement('div');
        });

        test('renders remote content', function(done) {
          proofElement.innerHTML = '<h1 id="test">Test</h1>\n<p><a href="http://url.com/">Link</a></p>\n';
          markedHost.source = 'test.md';

          markedElement.addEventListener('marked-loadend', function firstCheck() {
            expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
            markedElement.removeEventListener('marked-loadend', firstCheck);

            proofElement.innerHTML = '<h1 id="test-another">Test Another</h1>\n<p><a href="http://url.com/">Link</a></p>\n';
            markedHost.source = 'test1.md';

            markedElement.addEventListener('marked-loadend', function() {
              expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
              done();
            });
          }.bind(this));
        });

        test('renders content while remote content is loading', function(done) {
          proofElement.innerHTML = '<h1 id="loading">Loading</h1>\n<p>Please wait...</p>\n';

          if (outputElement.innerHTML) {
            expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
            done();
          }

          // this is async on FF and Edge
          markedElement.addEventListener('marked-render-complete', function() {
            expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
            done();
          })
        });
      });

      suite('sanitizing remote content', function() {
        suite('sanitized', function() {
          setup(function() {
            markedElement = fixture('SanitizedRemoteContent');
          });

          test('sanitizes remote content', function(done) {
            outputElement = markedElement.querySelector('#output');
            proofElement = document.createElement('div');
            proofElement.innerHTML = '<p>&lt;div&gt;&lt;/div&gt;</p>\n';

            markedElement.addEventListener('marked-loadend', function() {
              assert.isTrue(markedElement.sanitize);
              assert.isNotTrue(markedElement.disableRemoteSanitization);
              expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
              done();
            });
          });
        });

        suite('unsanitized', function() {
          setup(function() {
            markedElement = fixture('UnsanitizedRemoteContent');
          });

          test('does not sanitize remote content', function(done) {
            outputElement = markedElement.querySelector('#output');
            proofElement = document.createElement('div');
            var div = document.createElement('div');
            proofElement.innerHTML = '<div></div>';

            markedElement.addEventListener('marked-loadend', function() {
              assert.isNotTrue(markedElement.sanitize);
              assert.isTrue(markedElement.disableRemoteSanitization);
              expect(outputElement.innerHTML).to.equal(proofElement.innerHTML);
              done();
            });
          });
        });
      });
    });

    suite('events', function() {
      var markedElement;
      var outputElement;

      setup(function() {
        markedElement = fixture('CamelCaseHTML');
        outputElement = document.getElementById('output');
      });

      test('render() fires marked-render-complete', function(done) {
        markedElement.addEventListener('marked-render-complete', function() {
          expect(outputElement.innerHTML).to.not.equal('');
          done();
        });
        markedElement.render();
      });
    });

  