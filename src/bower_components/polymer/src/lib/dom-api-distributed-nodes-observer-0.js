
(function() {
  'use strict';

    var DomApi = Polymer.DomApi.ctor;
    var Settings = Polymer.Settings;

    /**
     * DomApi.DistributedNodesObserver notifies when the list returned by 
     * a <content> element's `getDistributedNodes()` may have changed.
     * It is not meant to be used directly; it is used by
     * `Polymer.dom(node).observeNodes(callback)` to observe changes to
     * `<content>.getDistributedNodes()`.
     */
    DomApi.DistributedNodesObserver = function(domApi) {
      DomApi.EffectiveNodesObserver.call(this, domApi);
    };

    DomApi.DistributedNodesObserver.prototype = 
      Object.create(DomApi.EffectiveNodesObserver.prototype);

    Polymer.Base.extend(DomApi.DistributedNodesObserver.prototype, {

      // NOTE: ShadyDOM distribute provokes notification of these observers
      // so no setup is required.
      _setup: function() {},

      _cleanup: function() {},

      // no need to update sub-elements since <content> does not nest
      // (but note that <slot> will)
      _beforeCallListeners: function() {},

      _getEffectiveNodes: function() {
        return this.domApi.getDistributedNodes();
      }

    });

    if (Settings.useShadow) {
      
      Polymer.Base.extend(DomApi.DistributedNodesObserver.prototype, {
        
        // NOTE: Under ShadowDOM we must observe the host element for
        // changes.
        _setup: function() {
          if (!this._observer) {
            var root = this.domApi.getOwnerRoot();
            var host = root && root.host;
            if (host) {
              var self = this;
              this._observer = Polymer.dom(host).observeNodes(function() {
                self._scheduleNotify();
              });
              // NOTE: we identify this listener as needed for <content>
              // notification so that enableShadowAttributeTracking 
              // can find these observers an ensure that we pass always 
              // pass notifications down.
              this._observer._isContentListener = true;
              if (this._hasAttrSelect()) {
                Polymer.dom(host).observer.enableShadowAttributeTracking();
              }
            }
          }
        },

        _hasAttrSelect: function() {
          var select = this.node.getAttribute('select');
          return select && select.match(/[[.]+/);
        },

        _cleanup: function() {
          var root = this.domApi.getOwnerRoot();
          var host = root && root.host;
          if (host) {
            Polymer.dom(host).unobserveNodes(this._observer);
          }
          this._observer = null;
        }

      });
    
    }

})();

