
(function() {

  var propertyUtils = Polymer.StyleProperties;
  var styleUtil = Polymer.StyleUtil;
  var cssParse = Polymer.CssParse;
  var styleDefaults = Polymer.StyleDefaults;
  var styleTransformer = Polymer.StyleTransformer;
  var applyShim = Polymer.ApplyShim;
  var debounce = Polymer.Debounce;
  var settings = Polymer.Settings;

  var updateDebouncer;

  Polymer({

    is: 'custom-style',
    extends: 'style',
    _template: null,

    properties: {
      // include is a property so that it deserializes
      /**
       * Specify `include` to identify a `dom-module` containing style data which
       * should be used within the `custom-style`. By using `include` style data
       * may be shared between multiple different `custom-style` elements.
       *
       * To include multiple `dom-modules`, use `include="module1 module2"`.
       */
      include: String
    },

    ready: function() {
      // NOTE: we cannot just check attached because custom elements in
      // HTMLImports do not get attached.
      this.__appliedElement = this.__appliedElement || this;
      this.__cssBuild = styleUtil.getCssBuildType(this)
      // forward css-build status to applied element in main document
      if (this.__appliedElement !== this) {
        this.__appliedElement.__cssBuild = this.__cssBuild;
      }
      // needed becuase elements in imports do not get 'attached'
      // TODO(sorvell): we could only do this if and only if
      // this.ownerDocument != document;
      // however, if we do that, we also have to change the `attached`
      // code to go at `_beforeAttached` time because this is when
      // elements produce styles (otherwise this breaks @apply shim)
      this._tryApply();
    },

    // needed to support dynamic custom styles created outside document
    // and then added to it.
    attached: function() {
      this._tryApply();
    },

    _tryApply: function() {
      if (!this._appliesToDocument) {
        // only apply variables if and only if this style is not inside
        // a dom-module
        if (this.parentNode &&
          (this.parentNode.localName !== 'dom-module')) {
          this._appliesToDocument = true;
          var e = this.__appliedElement;
          // used applied element from HTMLImports polyfill or this
          if (!settings.useNativeCSSProperties) {
            // if default style properties exist when
            // this element tries to apply styling then,
            // it has been loaded async and needs to trigger a full updateStyles
            // to guarantee properties it provides update correctly.
            this.__needsUpdateStyles = styleDefaults.hasStyleProperties();
            styleDefaults.addStyle(e);
          }
          // we may not have any textContent yet due to parser yielding
          // if so, wait until we do...
          if (e.textContent || this.include) {
            this._apply(true);
          } else {
            var self = this;
            var observer = new MutationObserver(function() {
              observer.disconnect();
              self._apply(true);
            });
            observer.observe(e, {childList: true});
          }
        }
      }
    },

    _updateStyles: function() {
      Polymer.updateStyles();
    },

    // polyfill this style with root scoping and
    // apply custom properties!
    _apply: function(initialApply) {
      // used applied element from HTMLImports polyfill or this
      var e = this.__appliedElement;
      if (this.include) {
        e.textContent = styleUtil.cssFromModules(this.include, true) +
          e.textContent;
      }
      if (!e.textContent) {
        return;
      }
      // static shimming
      // (css build will already process document rule and apply shim)
      // cases:
      // build = shady, use = shady => do nothing
      // build = shadow, use = shadow => do nothing
      // build = shady, use = shadow => not supported
      // build = shadow, use = shady => needs shimming.
      // build = none => needs shimming
      var buildType = this.__cssBuild;
      var targetedBuild = styleUtil.isTargetedBuild(buildType);

      // bail early if the style is already built for current settings
      if (settings.useNativeCSSProperties && targetedBuild) {
        return;
      }
      var styleRules = styleUtil.rulesForStyle(e);
      if (!targetedBuild) {
        styleUtil.forEachRule(styleRules,
          function(rule) {
            // shim the selector for current runtime settings
            styleTransformer.documentRule(rule);
            // run the apply shim if unbuilt and using native css custom properties
            if (settings.useNativeCSSProperties && !buildType) {
              applyShim.transformRule(rule);
            }
          }
        );
      }
      // custom properties shimming
      // (if we use native custom properties, no need to apply any property shimming)
      if (settings.useNativeCSSProperties) {
        // there's no targeted build, so the shimmed styles must be applied.
        e.textContent = styleUtil.toCssText(styleRules);
      // otherwise needs property shimming...
      } else {
        // Allow all custom-styles defined in this turn to register
        // before applying any properties. This helps ensure that all properties
        // are defined before any are consumed.
        // Premature application of properties can occur in 2 cases:
        // (1) A property `--foo` is consumed in a custom-style
        // before another custom-style produces `--foo`.
        // In general, we require custom properties to be defined before being
        // used in elements so supporting this for custom-style
        // is dubious but is slightly more like native properties where this
        // is supported.
        // (2) A set of in order styles (A, B) are re-ordered due to a parser
        // yield that makes A wait for textContent. This reorders its
        // `_apply` after B.
        // This case should only occur with native webcomponents.
        var self = this;
        var fn = function fn() {
          self._flushCustomProperties();
        }
        if (initialApply) {
          Polymer.RenderStatus.whenReady(fn);
        } else {
          fn();
        }
      }
    },

    _flushCustomProperties: function() {
      // if this style has not yet applied at all and it was loaded asynchronously
      // (detected by Polymer being ready when this element tried to apply), then
      // do a full updateStyles to ensure that
      if (this.__needsUpdateStyles) {
        this.__needsUpdateStyles = false;
        updateDebouncer = debounce(updateDebouncer, this._updateStyles);
      } else {
        this._applyCustomProperties();
      }
    },

    _applyCustomProperties: function() {
      var element = this.__appliedElement;
      this._computeStyleProperties();
      var props = this._styleProperties;
      var rules = styleUtil.rulesForStyle(element);
      if (!rules) {
        return;
      }
      element.textContent = styleUtil.toCssText(rules, function(rule) {
        var css = rule.cssText = rule.parsedCssText;
        if (rule.propertyInfo && rule.propertyInfo.cssText) {
          // remove property assignments
          // so next function isn't confused
          // NOTE: we have 3 categories of css:
          // (1) normal properties,
          // (2) custom property assignments (--foo: red;),
          // (3) custom property usage: border: var(--foo); @apply(--foo);
          // In elements, 1 and 3 are separated for efficiency; here they
          // are not and this makes this case unique.
          css = cssParse.removeCustomPropAssignment(css);
          // replace with reified properties, scenario is same as mixin
          rule.cssText = propertyUtils.valueForProperties(css, props);
        }
      });
    }

  });

})();
