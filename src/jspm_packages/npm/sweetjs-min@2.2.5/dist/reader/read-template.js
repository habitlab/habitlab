'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = readTemplateLiteral;

var _immutable = require('immutable');

var _readtable = require('readtable');

var _utils = require('./utils');

var _tokenReader = require('./token-reader');

var _tokens = require('../tokens');

function readTemplateLiteral(stream, prefix) {
  let element,
      items = [];
  stream.readString();

  do {
    element = readTemplateElement.call(this, stream);
    items.push(element);
    if (element.interp) {
      element = this.readToken(stream, (0, _immutable.List)(), false);
      items.push(element);
    }
  } while (!element.tail);

  return new _tokens.TemplateToken({
    items: (0, _immutable.List)(items)
  });
}


function readTemplateElement(stream) {
  let char = stream.peek(),
      idx = 0,
      value = '',
      octal = null;
  const startLocation = Object.assign({}, this.locationInfo, stream.sourceInfo);
  while (!(0, _readtable.isEOS)(char)) {
    switch (char) {
      case '`':
        {
          stream.readString(idx);
          const slice = (0, _tokenReader.getSlice)(stream, startLocation);
          stream.readString();
          return new _tokens.TemplateElementToken({
            tail: true,
            interp: false,
            value,
            slice
          });
        }
      case '$':
        {
          if (stream.peek(idx + 1) === '{') {
            stream.readString(idx);
            const slice = (0, _tokenReader.getSlice)(stream, startLocation);
            stream.readString();

            return new _tokens.TemplateElementToken({
              tail: false,
              interp: true,
              value,
              slice
            });
          }
          break;
        }
      case '\\':
        {
          let newVal;
          [newVal, idx, octal] = _utils.readStringEscape.call(this, '', stream, idx, octal);
          if (octal != null) throw this.createILLEGAL(octal);
          value += newVal;
          --idx;
          break;
        }
      default:
        {
          value += char;
        }
    }
    char = stream.peek(++idx);
  }
  throw this.createILLEGAL(char);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFkZXIvcmVhZC10ZW1wbGF0ZS5qcyJdLCJuYW1lcyI6WyJyZWFkVGVtcGxhdGVMaXRlcmFsIiwic3RyZWFtIiwicHJlZml4IiwiZWxlbWVudCIsIml0ZW1zIiwicmVhZFN0cmluZyIsInJlYWRUZW1wbGF0ZUVsZW1lbnQiLCJjYWxsIiwicHVzaCIsImludGVycCIsInJlYWRUb2tlbiIsInRhaWwiLCJjaGFyIiwicGVlayIsImlkeCIsInZhbHVlIiwib2N0YWwiLCJzdGFydExvY2F0aW9uIiwiT2JqZWN0IiwiYXNzaWduIiwibG9jYXRpb25JbmZvIiwic291cmNlSW5mbyIsInNsaWNlIiwibmV3VmFsIiwiY3JlYXRlSUxMRUdBTCJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBV3dCQSxtQjs7QUFWeEI7O0FBS0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRWUsU0FBU0EsbUJBQVQsQ0FBNkJDLE1BQTdCLEVBQWlEQyxNQUFqRCxFQUFzRjtBQUNuRyxNQUFJQyxPQUFKO0FBQUEsTUFBYUMsUUFBUSxFQUFyQjtBQUNBSCxTQUFPSSxVQUFQOztBQUVBLEtBQUc7QUFDREYsY0FBVUcsb0JBQW9CQyxJQUFwQixDQUF5QixJQUF6QixFQUErQk4sTUFBL0IsQ0FBVjtBQUNBRyxVQUFNSSxJQUFOLENBQVdMLE9BQVg7QUFDQSxRQUFJQSxRQUFRTSxNQUFaLEVBQW9CO0FBQ2xCTixnQkFBVSxLQUFLTyxTQUFMLENBQWVULE1BQWYsRUFBdUIsc0JBQXZCLEVBQStCLEtBQS9CLENBQVY7QUFDQUcsWUFBTUksSUFBTixDQUFXTCxPQUFYO0FBQ0Q7QUFDRixHQVBELFFBT1EsQ0FBQ0EsUUFBUVEsSUFQakI7O0FBU0EsU0FBTywwQkFBa0I7QUFDdkJQLFdBQU8scUJBQUtBLEtBQUw7QUFEZ0IsR0FBbEIsQ0FBUDtBQUdEOzs7QUFFRCxTQUFTRSxtQkFBVCxDQUE2QkwsTUFBN0IsRUFBdUU7QUFDckUsTUFBSVcsT0FBT1gsT0FBT1ksSUFBUCxFQUFYO0FBQUEsTUFBMEJDLE1BQU0sQ0FBaEM7QUFBQSxNQUFtQ0MsUUFBUSxFQUEzQztBQUFBLE1BQStDQyxRQUFRLElBQXZEO0FBQ0EsUUFBTUMsZ0JBQWdCQyxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLQyxZQUF2QixFQUFxQ25CLE9BQU9vQixVQUE1QyxDQUF0QjtBQUNBLFNBQU8sQ0FBQyxzQkFBTVQsSUFBTixDQUFSLEVBQXFCO0FBQ25CLFlBQVFBLElBQVI7QUFDRSxXQUFLLEdBQUw7QUFBVTtBQUNSWCxpQkFBT0ksVUFBUCxDQUFrQlMsR0FBbEI7QUFDQSxnQkFBTVEsUUFBUSwyQkFBU3JCLE1BQVQsRUFBaUJnQixhQUFqQixDQUFkO0FBQ0FoQixpQkFBT0ksVUFBUDtBQUNBLGlCQUFPLGlDQUF5QjtBQUM5Qk0sa0JBQU0sSUFEd0I7QUFFOUJGLG9CQUFRLEtBRnNCO0FBRzlCTSxpQkFIOEI7QUFJOUJPO0FBSjhCLFdBQXpCLENBQVA7QUFNRDtBQUNELFdBQUssR0FBTDtBQUFVO0FBQ1IsY0FBSXJCLE9BQU9ZLElBQVAsQ0FBWUMsTUFBSSxDQUFoQixNQUF1QixHQUEzQixFQUFnQztBQUM5QmIsbUJBQU9JLFVBQVAsQ0FBa0JTLEdBQWxCO0FBQ0Esa0JBQU1RLFFBQVEsMkJBQVNyQixNQUFULEVBQWlCZ0IsYUFBakIsQ0FBZDtBQUNBaEIsbUJBQU9JLFVBQVA7O0FBRUEsbUJBQU8saUNBQXlCO0FBQzlCTSxvQkFBTSxLQUR3QjtBQUU5QkYsc0JBQVEsSUFGc0I7QUFHOUJNLG1CQUg4QjtBQUk5Qk87QUFKOEIsYUFBekIsQ0FBUDtBQU1EO0FBQ0Q7QUFDRDtBQUNELFdBQUssSUFBTDtBQUFXO0FBQ1QsY0FBSUMsTUFBSjtBQUNBLFdBQUNBLE1BQUQsRUFBU1QsR0FBVCxFQUFjRSxLQUFkLElBQXVCLHdCQUFpQlQsSUFBakIsQ0FBc0IsSUFBdEIsRUFBNEIsRUFBNUIsRUFBZ0NOLE1BQWhDLEVBQXdDYSxHQUF4QyxFQUE2Q0UsS0FBN0MsQ0FBdkI7QUFDQSxjQUFJQSxTQUFTLElBQWIsRUFBbUIsTUFBTSxLQUFLUSxhQUFMLENBQW1CUixLQUFuQixDQUFOO0FBQ25CRCxtQkFBU1EsTUFBVDtBQUNBLFlBQUVULEdBQUY7QUFDQTtBQUNEO0FBQ0Q7QUFBUztBQUNQQyxtQkFBU0gsSUFBVDtBQUNEO0FBckNIO0FBdUNBQSxXQUFPWCxPQUFPWSxJQUFQLENBQVksRUFBRUMsR0FBZCxDQUFQO0FBQ0Q7QUFDRCxRQUFNLEtBQUtVLGFBQUwsQ0FBbUJaLElBQW5CLENBQU47QUFDRCIsImZpbGUiOiJyZWFkLXRlbXBsYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCB7IExpc3QgfSBmcm9tICdpbW11dGFibGUnO1xuXG5pbXBvcnQgdHlwZSB7IENoYXJTdHJlYW0gfSBmcm9tICdyZWFkdGFibGUnO1xuaW1wb3J0IHR5cGUgU3ludGF4IGZyb20gJy4uL3N5bnRheCc7XG5cbmltcG9ydCB7IGlzRU9TIH0gZnJvbSAncmVhZHRhYmxlJztcbmltcG9ydCB7IHJlYWRTdHJpbmdFc2NhcGUgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IGdldFNsaWNlIH0gZnJvbSAnLi90b2tlbi1yZWFkZXInO1xuaW1wb3J0IHsgVGVtcGxhdGVUb2tlbiwgVGVtcGxhdGVFbGVtZW50VG9rZW4gfSBmcm9tICcuLi90b2tlbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWFkVGVtcGxhdGVMaXRlcmFsKHN0cmVhbTogQ2hhclN0cmVhbSwgcHJlZml4OiBMaXN0PFN5bnRheD4pOiBUZW1wbGF0ZVRva2VuIHtcbiAgbGV0IGVsZW1lbnQsIGl0ZW1zID0gW107XG4gIHN0cmVhbS5yZWFkU3RyaW5nKCk7XG5cbiAgZG8ge1xuICAgIGVsZW1lbnQgPSByZWFkVGVtcGxhdGVFbGVtZW50LmNhbGwodGhpcywgc3RyZWFtKTtcbiAgICBpdGVtcy5wdXNoKGVsZW1lbnQpO1xuICAgIGlmIChlbGVtZW50LmludGVycCkge1xuICAgICAgZWxlbWVudCA9IHRoaXMucmVhZFRva2VuKHN0cmVhbSwgTGlzdCgpLCBmYWxzZSk7XG4gICAgICBpdGVtcy5wdXNoKGVsZW1lbnQpO1xuICAgIH1cbiAgfSB3aGlsZSghZWxlbWVudC50YWlsKTtcblxuICByZXR1cm4gbmV3IFRlbXBsYXRlVG9rZW4oe1xuICAgIGl0ZW1zOiBMaXN0KGl0ZW1zKVxuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVhZFRlbXBsYXRlRWxlbWVudChzdHJlYW06IENoYXJTdHJlYW0pOiBUZW1wbGF0ZUVsZW1lbnRUb2tlbiB7XG4gIGxldCBjaGFyID0gc3RyZWFtLnBlZWsoKSwgaWR4ID0gMCwgdmFsdWUgPSAnJywgb2N0YWwgPSBudWxsO1xuICBjb25zdCBzdGFydExvY2F0aW9uID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5sb2NhdGlvbkluZm8sIHN0cmVhbS5zb3VyY2VJbmZvKTtcbiAgd2hpbGUgKCFpc0VPUyhjaGFyKSkge1xuICAgIHN3aXRjaCAoY2hhcikge1xuICAgICAgY2FzZSAnYCc6IHtcbiAgICAgICAgc3RyZWFtLnJlYWRTdHJpbmcoaWR4KTtcbiAgICAgICAgY29uc3Qgc2xpY2UgPSBnZXRTbGljZShzdHJlYW0sIHN0YXJ0TG9jYXRpb24pO1xuICAgICAgICBzdHJlYW0ucmVhZFN0cmluZygpO1xuICAgICAgICByZXR1cm4gbmV3IFRlbXBsYXRlRWxlbWVudFRva2VuKHtcbiAgICAgICAgICB0YWlsOiB0cnVlLFxuICAgICAgICAgIGludGVycDogZmFsc2UsXG4gICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgc2xpY2VcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjYXNlICckJzoge1xuICAgICAgICBpZiAoc3RyZWFtLnBlZWsoaWR4KzEpID09PSAneycpIHtcbiAgICAgICAgICBzdHJlYW0ucmVhZFN0cmluZyhpZHgpO1xuICAgICAgICAgIGNvbnN0IHNsaWNlID0gZ2V0U2xpY2Uoc3RyZWFtLCBzdGFydExvY2F0aW9uKTtcbiAgICAgICAgICBzdHJlYW0ucmVhZFN0cmluZygpO1xuXG4gICAgICAgICAgcmV0dXJuIG5ldyBUZW1wbGF0ZUVsZW1lbnRUb2tlbih7XG4gICAgICAgICAgICB0YWlsOiBmYWxzZSxcbiAgICAgICAgICAgIGludGVycDogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgc2xpY2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ1xcXFwnOiB7XG4gICAgICAgIGxldCBuZXdWYWw7XG4gICAgICAgIFtuZXdWYWwsIGlkeCwgb2N0YWxdID0gcmVhZFN0cmluZ0VzY2FwZS5jYWxsKHRoaXMsICcnLCBzdHJlYW0sIGlkeCwgb2N0YWwpO1xuICAgICAgICBpZiAob2N0YWwgIT0gbnVsbCkgdGhyb3cgdGhpcy5jcmVhdGVJTExFR0FMKG9jdGFsKTtcbiAgICAgICAgdmFsdWUgKz0gbmV3VmFsO1xuICAgICAgICAtLWlkeDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHZhbHVlICs9IGNoYXI7XG4gICAgICB9XG4gICAgfVxuICAgIGNoYXIgPSBzdHJlYW0ucGVlaygrK2lkeCk7XG4gIH1cbiAgdGhyb3cgdGhpcy5jcmVhdGVJTExFR0FMKGNoYXIpO1xufVxuIl19