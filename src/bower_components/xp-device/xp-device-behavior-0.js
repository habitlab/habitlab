
    (function () {

        // Vars
        var state = 'idle';

        // Prototype
        Polymer.XPDeviceBehaviorImp = {

            // PROPERTIES
            properties: {

                /**
                 * The device's form factor.
                 *
                 * @attribute device
                 * @type "app" | "desktop" | "feature-phone" | "other-mobile" | "other-non-mobile" | "robot" | "smart-tv" | "smartphone" | "tablet"
                 * @notifies
                 * @readonly
                 */
                device: {
                    notify: true,
                    observer: '_deviceObserver',
                    readOnly: true,
                    type: String,
                    value: function () { return this.detectors[0] && this.detectors[0].device; }
                },

                /**
                 * If set to true, the device is a mobile one.
                 *
                 * @attribute mobile
                 * @type boolean
                 * @default false
                 * @notifies
                 * @readonly
                 */
                mobile: {
                    notify: true,
                    readOnly: true,
                    type: Boolean,
                    value: function () { return this.detectors[0] && this.detectors[0].mobile; }
                }
            },

            /**
             * The list of detectors.
             *
             * @property detectors
             * @type Array
             * @default []
             * @readonly
             */
            detectors: [],

            /*********************************************************************/

            // OBSERVER
            _deviceObserver: function () {

                // Vars
                var self  = this,
                    first = self === self.detectors[0],
                    html  = first && document.querySelector('html');

                // Checking
                if (!html) { return; }

                // Setting
                XP.setAttribute(html, 'mobile', self.mobile);
                XP.setAttribute(html, 'device', self.device);
            },

            /*********************************************************************/

            // LISTENER
            ready: function () {

                // Vars
                var self   = this,
                    item   = !self.device && state === 'idle' && localStorage.getItem('device'),
                    script = !self.device && state === 'idle' && !item && document.createElement('xp-script'),
                    device = item && XP.parseJSON(item);

                // Appending
                self.append('detectors', self);

                // Setting
                if (device) { self._setMobile(device.mobile); }
                if (device) { self._setDevice(device.type); }

                // Checking
                if (!script) { return; }

                // Listening
                self.listen(script, 'xp-script-load', '_detectHandler');
                self.listen(script, 'xp-script-state', '_scriptHandler');

                // Requesting
                script.src = 'https://wurfl.io/wurfl.js';
            },

            /*********************************************************************/

            // HANDLER
            _detectHandler: function () {

                // Vars
                var self = this;

                // Setting
                XP.invoke(self.detectors, '_setMobile', WURFL.is_mobile);
                XP.invoke(self.detectors, '_setDevice', WURFL.form_factor);

                // Storing
                localStorage.setItem('device', XP.toJSON({mobile: self.mobile, type: self.device}));
            },

            // HANDLER
            _scriptHandler: function (event) {

                // Setting
                state = event.detail.state;
            }
        };

        Polymer.XPDeviceBehavior = [
            Polymer.XPArrayBehavior,
            Polymer.XPDeviceBehaviorImp
        ];
    }());
