

    HTMLImports.whenReady(function() {

      Polymer({

        is: 'x-grid',

        properties: {

          apiKey: {
            type: String,
            value: 'c304f1096a06486d3c1e7ab271bf7f3f'
          },

          photos: Array,

          perPage: {
            type: Number,
            value: 100
          },

          page: {
            type: Number,
            value: 0
          },

          searchText: {
            type: String,
            value: 'Big Sur'
          },

          loadingPhotos: Boolean
        },

        observers: [
          '_resetPhotos(searchText)'
        ],

        _getAPIEndpoint: function(apiKey, searchText, page) {
          return 'https://api.flickr.com/services/rest/?method=flickr.photos.search' +
              '&api_key=' + apiKey +
              '&safe_search=1&sort=interestingness-desc'+
              '&text=' + encodeURIComponent(searchText) +
              '&page=' + page +
              '&format=json' +
              '&per_page=' + this.perPage;
        },

        _didReceiveResponse: function(e) {
          var payload = JSON.parse(e.detail.response.match('jsonFlickrApi\\((.*)\\)')[1]);

          if (!payload || !payload.photos || !payload.photos.photo) {
            return;
          }

          payload.photos.photo.forEach(function(photo) {
            this.push('photos', photo);
          }, this);

          this.$.scrollTheshold.clearTriggers();
        },

        _onLowerThreshold: function() {
          this.debounce('_loadPhotos', this._loadMorePhotos, 60);
        },

        _loadMorePhotos: function() {
          if (this.$.ajax.lastRequest) {
            this.$.ajax.lastRequest.abort();
          }
          this.page++;
          this.$.ajax.generateRequest();
        },

        _resetPhotos: function(searchText) {
          this.page = 0;
          this.photos = [];

          if (searchText.trim() !== '') {
            this.debounce('_loadPhotos', this._loadMorePhotos, 400);
          }
        }

      });

    });

  