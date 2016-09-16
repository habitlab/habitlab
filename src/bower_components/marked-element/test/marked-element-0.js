
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
      test('has pedantic', function() {
        expect(markedElement.sanitize).to.equal(false);
      });
      test('has smartypants', function() {
        expect(markedElement.sanitize).to.equal(false);
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
          proofElement.innerHTML = '<div camelCase></div>';
          expect(markedElement.$.content).to.equal(markedElement.outputElement);
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

  