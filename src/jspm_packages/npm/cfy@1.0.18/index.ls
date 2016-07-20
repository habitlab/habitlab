require! {
  co
  unthenify
}

export add_noerr = (callback) ->
  return (cb) ->
    callback (res) ->
      cb(null, res)

export yfy = (f) ->
  return (...functionArguments) ->
    self = this
    return new Promise (resolve, reject) ->
      callbackFunction = (...args) ->
        return resolve(args[0])
      functionArguments.push(callbackFunction)
      f.apply(self, functionArguments)

export yfy_node = (f) ->
  return (...functionArguments) ->
    self = this
    return new Promise (resolve, reject) ->
      callbackFunction = (...args) ->
        err = args[0]
        if err
          return reject(err)
        return resolve(args[1])
      functionArguments.push(callbackFunction)
      f.apply(self, functionArguments)

export yfy_multi = (f) ->
  return (...functionArguments) ->
    self = this
    return new Promise (resolve, reject) ->
      callbackFunction = (...args) ->
        return resolve(args)
      functionArguments.push(callbackFunction)
      f.apply(self, functionArguments)

export yfy_multi_node = (f) ->
  return (...functionArguments) ->
    self = this
    return new Promise (resolve, reject) ->
      callbackFunction = (...args) ->
        err = args[0]
        if err
          return reject(err)
        return resolve(args.slice(1))
      functionArguments.push(callbackFunction)
      f.apply(self, functionArguments)

export cfy = (f, options) ->
  num_args = f.length
  if options?
    if options.varargs?
      return cfy_varargs(f)
    if options.num_args?
      num_args = options.num_args
  wrapped = co.wrap(f)
  return (...args, callback) ->
    if args.length == num_args and typeof(callback) == 'function'
      # the callback was passed, call the function immediately
      return wrapped.bind(this)(...args).then(callback)
    else
      # return a promise
      return wrapped.bind(this)(...args, callback)

cfy_varargs = (f) ->
  wrapped = co.wrap(f)
  return (...args, callback) ->
    if typeof(callback) == 'function'
      # the callback was passed, call the function immediately
      return wrapped.bind(this)(...args).then(callback)
    else
      # return a promise
      return wrapped.bind(this)(...args, callback)

export cfy_node = (f, options) ->
  num_args = f.length
  if options?
    if options.varargs?
      return cfy_varargs_node(f)
    if options.num_args?
      num_args = options.num_args
  wrapped = co.wrap(f)
  wrapped_cb = unthenify(wrapped)
  return (...args, callback) ->
    if args.length == num_args and typeof(callback) == 'function'
      # the callback was passed, call the function immediately
      return wrapped_cb.bind(this)(...args, callback)
    else
      # return a promise
      return wrapped.bind(this)(...args, callback)

cfy_varargs_node = (f) ->
  wrapped = co.wrap(f)
  wrapped_cb = unthenify(wrapped)
  return (...args, callback) ->
    if typeof(callback) == 'function'
      # the callback was passed, call the function immediately
      return wrapped_cb.bind(this)(...args, callback)
    else
      # return a promise
      return wrapped.bind(this)(...args, callback)
