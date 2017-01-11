{
  yfy
  cfy
  yfy_node
  cfy_node
  yfy_multi
  yfy_multi_node
  add_noerr
} = require('../index')

require! {
  co
  chai
}

{expect} = chai
chai.should()


process.on 'unhandledRejection', (reason, p) ->
  throw new Error(reason)

add_async = (x, y, callback) ->
  setTimeout ->
    callback(x + y)
  , 0

add_async_node = (x, y, callback) ->
  setTimeout ->
    callback(null, x + y)
  , 0

describe 'all tests', ->

  specify 'cfy test callback', (done) ->
    f = cfy ->*
      yield Promise.resolve(5)
    result <- f()
    result.should.equal(5)
    done()

  specify 'cfy test promise', (done) ->
    f = cfy ->*
      yield Promise.resolve(5)
    result <- f().then()
    result.should.equal(5)
    done()

  specify 'cfy_node test callback', (done) ->
    f = cfy_node ->*
      yield Promise.resolve(5)
    err,result <- f()
    result.should.equal(5)
    done()

  specify 'cfy_node test promise', (done) ->
    f = cfy_node ->*
      yield Promise.resolve(5)
    result <- f().then()
    result.should.equal(5)
    done()

  specify 'yfy test', (done) ->
    f = cfy ->*
      yield yfy(add_async)(5, 1)
    result <- f()
    result.should.equal(6)
    done()

  specify 'yfy_node test', (done) ->
    f = cfy ->*
      yield yfy_node(add_async_node)(5, 1)
    result <- f()
    result.should.equal(6)
    done()

  specify 'cfy multiple arguments test', (done) ->
    f = cfy (x, y) ->*
      return 2 + 5
    result <- f(2, 5)
    result.should.equal(7)
    done()

  specify 'cfy multiple arguments nontrivial test', (done) ->
    f = cfy (x, y) ->*
      tmp = yield yfy(add_async) 3, 1
      return tmp + x + y
    result <- f(2, 5)
    result.should.equal(11)
    done()

  specify 'cfy multiple arguments nontrivial promise test', (done) ->
    f = cfy (x, y) ->*
      tmp = yield yfy(add_async) 3, 1
      return tmp + x + y
    result <- f(2, 5).then()
    result.should.equal(11)
    done()

  specify 'cfy yielding each other test', (done) ->
    f1 = cfy ->*
      return 3
    f2 = cfy ->*
      tmp = yield f1()
      return tmp + 1
    result <- f2()
    result.should.equal(4)
    done()

  specify 'cfy yielding each other test basic', (done) ->
    add_then_multiply = cfy (x, y, z) ->*
      tmp = x + y
      return tmp * z
    add_then_multiply_then_divide = cfy (x, y, z, a) ->*
      tmp = yield add_then_multiply(x, y, z)
      return tmp / a
    res1 <- add_then_multiply(2, 4, 3)
    res1.should.equal((2 + 4) * 3)
    res2 <- add_then_multiply_then_divide(2, 4, 3, 9)
    res2.should.equal((2 + 4) * 3 / 9)
    done()

  specify 'cfy yielding each other test nontrivial', (done) ->
    add_then_multiply = cfy (x, y, z) ->*
      tmp = yield yfy(add_async)(x, y)
      return tmp * z
    add_then_multiply_then_divide = cfy (x, y, z, a) ->*
      tmp = yield add_then_multiply(x, y, z)
      return tmp / a
    res1 <- add_then_multiply(2, 4, 3)
    res1.should.equal((2 + 4) * 3)
    res2 <- add_then_multiply_then_divide(2, 4, 3, 9)
    res2.should.equal((2 + 4) * 3 / 9)
    done()

  specify 'yield setTimeout', (done) ->
    sleep = cfy (time) ->*
      sleep_base = (ntime, callback) ->
        setTimeout(callback, ntime)
      yield yfy(sleep_base)(time)
    f = cfy ->*
      x = yield sleep(0)
      return 5
    result <- f()
    result.should.equal(5)
    done()

  specify 'yfy redundant yfy test', (done) ->
    sleep = cfy (time) ->*
      sleep_base = (ntime, callback) ->
        setTimeout(callback, ntime)
      yield yfy(sleep_base)(time)
    f = cfy ->*
      x = yield yfy(sleep)(0)
      return 5
    result <- f()
    result.should.equal(5)
    done()

  specify 'retain this baseline', (done) ->
    this.x = 3
    f = (callback) ->
      callback(this.x)
    res1 <~ f()
    res2 <~ f.bind(this)()
    3.should.not.equal(res1)
    3.should.equal(res2)
    done()

  specify 'retain this with cfy', (done) ->
    this.x = 3
    f = cfy ->*
      return this.x
    res1 <~ f()
    res2 <~ f.bind(this)()
    3.should.not.equal(res1)
    3.should.equal(res2)
    done()

  specify 'retain this with cfy_node', (done) ->
    this.x = 3
    f = cfy_node ->*
      return this.x
    err1,res1 <~ f()
    err2,res2 <~ f.bind(this)()
    3.should.not.equal(res1)
    3.should.equal(res2)
    done()

  specify 'cfy handle functions that yield callbacks correctly callback', (done) ->
    get5 = -> 5
    f = cfy ->*
      return get5
    g <- f()
    5.should.equal(g())
    done()

  specify 'cfy handle functions that yield callbacks correctly promise', (done) ->
    get5 = -> 5
    f = cfy ->*
      return get5
    g <- f().then
    5.should.equal(g())
    done()

  specify 'cfy handle functions that have callbacks as arguments correctly callback', (done) ->
    get5 = -> 5
    f = cfy (f1) ->*
      return f1() + f1()
    g <- f(get5)
    10.should.equal(g)
    done()

  specify 'cfy handle functions that have callbacks as arguments correctly promise', (done) ->
    get5 = -> 5
    f = cfy (f1) ->*
      return f1() + f1()
    g <- f(get5).then
    10.should.equal(g)
    done()

  specify 'yfy test with multi arg promise', (done) ->
    f = yfy (callback) ->
      callback 3, 5
    g <- f().then
    3.should.equal(g)
    done()

  specify 'yfy test with multi arg callback', (done) ->
    f = yfy (callback) ->
      callback 3, 5
    g <- f()
    3.should.equal(g)
    done()

  specify 'yfy_node test with multi arg promise', (done) ->
    f = yfy_node (callback) ->
      callback null, 3, 5
    g <- f().then
    3.should.equal(g)
    done()

  specify 'yfy_node test with multi arg callback', (done) ->
    f = yfy_node (callback) ->
      callback null, 3, 5
    err,g <- f()
    expect(err).to.be.null
    3.should.equal(g)
    done()

  specify 'yfy test with multi arg callback', (done) ->
    f = yfy (callback) ->
      callback 3, 5
    g <- f()
    3.should.equal(g)
    done()

  specify 'yfy_multi test with single arg promise', (done) ->
    f = yfy_multi (callback) ->
      callback 3
    g <- f().then
    1.should.equal(g.length)
    3.should.equal(g[0])
    done()

  specify 'yfy_multi test with single arg callback', (done) ->
    f = yfy_multi (callback) ->
      callback 3
    g <- f()
    3.should.equal(g)
    done()

  specify 'yfy_multi_node test with single arg promise', (done) ->
    f = yfy_multi_node (callback) ->
      callback null, 3
    g <- f().then
    1.should.equal(g.length)
    3.should.equal(g[0])
    done()

  specify 'yfy_multi_node test with single arg callback', (done) ->
    f = yfy_multi_node (callback) ->
      callback null, 3
    err,g <- f()
    expect(err).to.be.null
    3.should.equal(g)
    done()

  specify 'yfy_multi test with multi arg promise', (done) ->
    f = yfy_multi (callback) ->
      callback 3, 5
    g <- f().then
    2.should.equal(g.length)
    3.should.equal(g[0])
    5.should.equal(g[1])
    done()

  specify 'yfy_multi test with multi arg callback', (done) ->
    f = yfy_multi (callback) ->
      callback 3, 5
    g,h <- f()
    3.should.equal(g)
    5.should.equal(h)
    done()

  specify 'yfy_multi_node test with multi arg promise', (done) ->
    f = yfy_multi_node (callback) ->
      callback null, 3, 5
    g <- f().then
    2.should.equal(g.length)
    3.should.equal(g[0])
    5.should.equal(g[1])
    done()

  specify 'yfy_multi_node test with multi arg callback', (done) ->
    f = yfy_multi_node (callback) ->
      callback null, 3, 5
    err,g,h <- f()
    expect(err).to.be.null
    3.should.equal(g)
    5.should.equal(h)
    done()

  specify 'cfy specify number of arguments for variable arguments function callback', (done) ->
    f = (...args) ->* args[0] + args[1]
    0.should.equal(f.length)
    g = cfy f, {num_args: 2}
    res <- g(3, 5)
    8.should.equal(res)
    done()

  specify 'cfy specify number of arguments for variable arguments function promise', (done) ->
    f = (...args) ->* args[0] + args[1]
    0.should.equal(f.length)
    g = cfy f, {num_args: 2}
    res <- g(3, 5).then
    8.should.equal(res)
    done()

  specify 'cfy_node specify number of arguments for variable arguments function callback', (done) ->
    f = (...args) ->* args[0] + args[1]
    0.should.equal(f.length)
    g = cfy_node f, {num_args: 2}
    err,res <- g(3, 5)
    expect(err).to.be.null
    8.should.equal(res)
    done()

  specify 'cfy_node specify number of arguments for variable arguments function promise', (done) ->
    f = (...args) ->* args[0] + args[1]
    0.should.equal(f.length)
    g = cfy_node f, {num_args: 2}
    res <- g(3, 5).then
    8.should.equal(res)
    done()

  specify 'cfy varargs option callback', (done) ->
    f = (...args) ->* args.reduce (+), 0
    0.should.equal(f.length)
    g = cfy f, {varargs: true}
    res <- g(3, 5, 7)
    15.should.equal(res)
    done()

  specify 'cfy varargs option promise', (done) ->
    f = (...args) ->* args.reduce (+), 0
    0.should.equal(f.length)
    g = cfy f, {varargs: true}
    res <- g(3, 5, 7).then
    15.should.equal(res)
    done()

  specify 'cfy_node varargs option callback', (done) ->
    f = (...args) ->* args.reduce (+), 0
    0.should.equal(f.length)
    g = cfy_node f, {varargs: true}
    err,res <- g(3, 5, 7)
    expect(err).to.be.null
    15.should.equal(res)
    done()

  specify 'cfy_node varargs option promise', (done) ->
    f = (...args) ->* args.reduce (+), 0
    0.should.equal(f.length)
    g = cfy_node f, {varargs: true}
    res <- g(3, 5, 7).then
    15.should.equal(res)
    done()

  specify 'add_null_err test', (done) ->
    f = -> it(3)
    g <- f()
    3.should.equal(g)
    err,h <- add_noerr(f)()
    expect(err).to.be.null
    3.should.equal(h)
    done()

  specify 'yield thunk test', (done) ->
    g = cfy ->*
      return yield (cb) -> cb(null, 3)
    res <- g()
    3.should.equal(res)
    done()

  specify 'yield thunk test add_noerr', (done) ->
    g = cfy ->*
      return yield add_noerr -> it(3)
    res <- g()
    3.should.equal(res)
    done()

  /*
  specify 'cfy throw errors callback', (done) ->
    f = cfy ->*
      throw new Error 'an error'
    g = cfy ->*
      yield f()
    <- g()
    done()

  specify 'cfy throw errors promise', (done) ->
    f = cfy ->*
      throw new Error 'an error'
    g = cfy ->*
      yield f()
    <- g().then
    done()
  */

  /*
  specify 'yfy throw errors callback simple', (done) ->
    f = yfy (callback) ->
      callback(throw new Error 'an error')
    <- f()
    done()

  specify 'yfy throw errors callback', (done) ->
    f = yfy (callback) ->
      callback(throw new Error 'an error')
    g = cfy ->*
      yield f()
    <- g()
    done()

  specify 'yfy throw errors promise', (done) ->
    f = yfy (callback) ->
      callback(throw new Error 'an error')
    g = cfy ->*
      yield f()
    <- g().then
    done()

  specify 'cfy throw errors callback simple', (done) ->
    f = cfy ->*
      throw new Error 'an error'
    <- f()
    done()

  specify 'cfy throw errors callback', (done) ->
    f = cfy ->*
      throw new Error 'an error'
    g = cfy ->*
      yield f()
    <- g()
    done()

  specify 'cfy throw errors promise', (done) ->
    f = cfy ->*
      throw new Error 'an error'
    g = cfy ->*
      yield f()
    <- g().then
    done()
  */


  #specify 'yfy_multi test with callback', (done) ->
  #  f = yfy_multi (x, callback) ->
  #    callback x + 1, x + 2
