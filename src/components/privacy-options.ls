Polymer {
  is: 'privacy-options'
  properties: {
    allow_logging: {
      type: Boolean
      value: do ->
        stored_value = localStorage.getItem('allow_logging')
        if stored_value?
          return stored_value == 'true'
        return true
      observer: 'allow_logging_changed'
    }
  }
  allow_logging_changed: ->
    localStorage.setItem('allow_logging', this.allow_logging)
}