
    Polymer({

        // ELEMENT
        is: 'xp-device',

        // BEHAVIORS
        behaviors: [
            Polymer.XPDeviceBehavior
        ],

        /*********************************************************************/

        // LISTENER
        created: function () {

            // Classifying
            this.classList.add('device');
        }
    });
