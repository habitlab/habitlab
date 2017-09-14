

    suite('basic', function() {
      test('invalid input shows error', function() {
        var input = fixture('basic');
        input.value='1234';
        forceXIfStamp(input);

        var container = Polymer.dom(input.root).querySelector('paper-input-container');
        assert.ok(container, 'paper-input-container exists');
        assert.isTrue(container.invalid);

        var error = Polymer.dom(input.root).querySelector('paper-input-error');
        assert.ok(error, 'paper-input-error exists');
        assert.notEqual(getComputedStyle(error).display, 'none', 'error is not display:none');
      });

      test('valid input does not show error', function() {
        var input = fixture('basic');
        input.value='batman@gotham.org';
        forceXIfStamp(input);

        var container = Polymer.dom(input.root).querySelector('paper-input-container');
        assert.ok(container, 'paper-input-container exists');
        assert.isFalse(container.invalid);

        var error = Polymer.dom(input.root).querySelector('paper-input-error');
        assert.ok(error, 'paper-input-error exists');
        assert.equal(getComputedStyle(error).visibility, 'hidden', 'error is visibility:hidden');
      });

      test('empty required input shows error on blur', function() {
        var input = fixture('basic');
        forceXIfStamp(input);

        var container = Polymer.dom(input.root).querySelector('paper-input-container');
        var error = Polymer.dom(input.root).querySelector('paper-input-error');
        assert.ok(error, 'paper-input-error exists');
        assert.equal(getComputedStyle(error).visibility, 'hidden', 'error is visibility:hidden');
        assert.isFalse(container.invalid);

        MockInteractions.focus(input);
        MockInteractions.blur(input);

        assert(!input.focused, 'input is blurred');
        assert.notEqual(getComputedStyle(error).visibility, 'hidden', 'error is not visibility:hidden');
        assert.isTrue(container.invalid);
      });

    });

    suite('a11y', function() {

      test('has aria-labelledby', function() {
        var input = fixture('basic');
        assert.isTrue(input.inputElement.hasAttribute('aria-labelledby'))
        assert.equal(input.inputElement.getAttribute('aria-labelledby'), Polymer.dom(input.root).querySelector('label').id, 'aria-labelledby points to the label');
      });

    });

    function testEmail(fixtureName, address, valid) {
      var input = fixture(fixtureName);
      forceXIfStamp(input);

      var container = Polymer.dom(input.root).querySelector('paper-input-container');
      assert.ok(container, 'paper-input-container exists');

      input.value = address;
      var errorString = address + ' should be ' + (valid ? 'valid' : 'invalid');
      assert.equal(container.invalid, !valid, errorString);
    }

    suite('valid email address validation', function() {

      test('valid email', function() {
        testEmail('basic', 'email@domain.com', true);
      });

      test('email with a dot in the address field', function() {
        testEmail('basic', 'firstname.lastname@domain.com', true);
      });

      test('email with a subdomain', function() {
        testEmail('basic', 'email@subdomain.domain.com', true);
      });

      test('weird tlds', function() {
        testEmail('basic', 'testing+contact@subdomain.domain.pizza', true);
      });

      test('plus sign is ok', function() {
        testEmail('basic', 'firstname+lastname@domain.com', true);
      });

      test('domain is valid ip', function() {
        testEmail('basic', 'email@123.123.123.123', true);
      });

      test('digits in address', function() {
        testEmail('basic', '1234567890@domain.com', true);
      });

      test('dash in domain name', function() {
        testEmail('basic', 'email@domain-one.com', true);
      });

      test('dash in address field', function() {
        testEmail('basic', 'firstname-lastname@domain.com', true);
      });

      test('underscore in address field', function() {
        testEmail('basic', '_______@domain-one.com', true);
      });

      test('dot in tld', function() {
        testEmail('basic', 'email@domain.co.jp', true);
      });
    });

    suite('invalid email address validation', function() {
      test('missing @ and domain', function() {
        testEmail('basic', 'plainaddress', false);
      });

      test('missing @', function() {
        testEmail('basic', 'email.domain.com', false);
      });

      test('garbage', function() {
        testEmail('basic', '#@%^%#$@#$@#.com', false);
      });

      test('missing username', function() {
        testEmail('basic', '@domain.com', false);
      });

      test('has spaces', function() {
        testEmail('basic', 'firstname lastname@domain.com', false);
      });

      test('encoded html', function() {
        testEmail('basic', 'Joe Smith <email@domain.com>', false);
      });

      test('two @ signs', function() {
        testEmail('basic', 'email@domain@domain.com', false);
      });

      test('unicode in address', function() {
        testEmail('basic', 'あいうえお@domain.com', false);
      });

      test('text after address', function() {
        testEmail('basic', 'email@domain.com (Joe Smith)', false);
      });

      test('multiple dots in domain', function() {
        testEmail('basic', 'email@domain..com', false);
      });

    });

    suite('custom email address validation', function() {
      test('invalid email', function() {
        testEmail('custom-regex', 'batman', false);
      });

      test('valid email', function() {
        testEmail('custom-regex', 'cat', true);
      });

      test('valid complex email', function() {
        testEmail('custom-regex', 'supercat', true);
      });

    });

    suite('empty regex means no validation', function() {
      test('empty string is valid', function() {
        testEmail('no-regex', '', true);
      });

      test('random string is valid', function() {
        testEmail('no-regex', 'batman', true);
      });

    });

  