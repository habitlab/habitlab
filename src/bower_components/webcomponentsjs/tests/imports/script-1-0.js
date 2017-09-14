
  var d = document._currentScript.ownerDocument.querySelector('div');
  assert.ok(document._currentScript);
  assert.equal(d.innerHTML, 'me', '_currentScript can locate element in import')
