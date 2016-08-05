
Polymer.EventApi = (function() {
  'use strict';

  var DomApi = Polymer.DomApi.ctor;
  var Settings = Polymer.Settings;


  /**
   * DomApi.Event allows maniuplation of events compatible with
   * the scoping concepts in Shadow DOM and compatible with both Shady DOM
   * and Shadow DOM. The general usage is
   * `Polymer.dom(event).property`. The `path` property returns `event.path`
   * matching Shadow DOM. The `rootTarget` property returns the first node
   * in the `path` and is the original event target. The `localTarget` property
   * matches event.target under Shadow DOM and is the scoped event target.
   */
  DomApi.Event = function(event) {
    this.event = event;
  };

  if (Settings.useShadow) {

    DomApi.Event.prototype = {

      get rootTarget() {
        return this.event.path[0];
      },

      get localTarget() {
        return this.event.target;
      },

      get path() {
        var path = this.event.path;
        if (!Array.isArray(path)) {
          path = Array.prototype.slice.call(path);
        }
        return path;
      }

    };

  } else {

    DomApi.Event.prototype = {

      get rootTarget() {
        return this.event.target;
      },

      get localTarget() {
        var current = this.event.currentTarget;
        var currentRoot = current && Polymer.dom(current).getOwnerRoot();
        var p$ = this.path;
        for (var i=0; i < p$.length; i++) {
          if (Polymer.dom(p$[i]).getOwnerRoot() === currentRoot) {
            return p$[i];
          }
        }
      },

      // TODO(sorvell): simulate event.path. This probably incorrect for
      // non-bubbling events.
      get path() {
        if (!this.event._path) {
          var path = [];
          var current = this.rootTarget;
          while (current) {
            path.push(current);
            var insertionPoints = Polymer.dom(current).getDestinationInsertionPoints();
            if (insertionPoints.length) {
              for (var i = 0; i < insertionPoints.length - 1; i++) {
                path.push(insertionPoints[i]);
              }
              current = insertionPoints[insertionPoints.length - 1];
            } else {
              current = Polymer.dom(current).parentNode || current.host;
            }
          }
          // event path includes window in most recent native implementations
          path.push(window);
          this.event._path = path;
        }
        return this.event._path;
      }

    };

  }

  var factory = function(event) {
    if (!event.__eventApi) {
      event.__eventApi = new DomApi.Event(event);
    }
    return event.__eventApi;
  };

  return {
    factory: factory
  };

})();

