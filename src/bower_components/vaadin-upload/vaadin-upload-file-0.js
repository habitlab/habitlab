

  Polymer({

    is: 'vaadin-upload-file',

    properties: {
      /**
       * File metadata, upload status and progress information.
       */
      file: Object
    },

    observers: [
      '_fileChanged(file.*)',
      '_fileAborted(file.abort)'
    ],

    _fileChanged: function() {
      this.$.progress.updateStyles();
    },

    _fileAborted: function(abort) {
      if (abort) {
        this.toggleClass('fade-out', true);
        var animationName = window.getComputedStyle(this).animationName;
        if (!animationName || animationName === 'none') {
          this.fire('file-remove', {file: this.file});
        } else {
          this.addEventListener('animationend', function() {
            this.fire('file-remove', {file: this.file});
          }.bind(this));
        }
      }
    },

    _fireFileEvent: function(e) {
      e.preventDefault();
      var button = Polymer.dom(e).localTarget;
      return this.fire(button.getAttribute('file-event'), {file: this.file});
    }

   /**
    * Fired when the retry button is pressed. It is listened by `vaadin-upload`
    * which will start a new upload process of this file.
    *
    * @event file-retry
    * @param {Object} detail
    *  @param {Object} detail.file file to retry upload of
    */

    /**
     * Fired when abort button is pressed. It is listened by `vaadin-upload` which
     * will abort the upload in progress, but will not remove the file from the list
     * to allow the animation to hide the element to be run.
     *
     * @event file-abort
     * @param {Object} detail
     *  @param {Object} detail.file file to abort upload of
     */

    /**
     * Fired after the animation to hide the element has finished. It is listened
     * by `vaadin-upload` which will actually remove the file from the upload
     * file list.
     *
     * @event file-remove
     * @param {Object} detail
     *  @param {Object} detail.file file to remove from the  upload of
     */
  });

