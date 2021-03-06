

var ecc = require('eccjs')
var crypto = require('crypto')
var Blake2s = require('blake2s')

var curve = ecc.curves.k256

function hash (message) {
  return new Blake2s().update(message).digest()
}

module.exports = {

  curves: ['k256'],

  generate: function (seed) {
    //we use eccjs.restore here, instead of eccjs.generate
    //because we trust node's random generator much more than
    //sjcl's (via crypto-browserify's polyfil this uses
    //webcrypto's random generator in the browser)

    var keys = ecc.restore(curve, seed || crypto.randomBytes(32))

    return {
      curve: 'k256',
      public: keys.public,
      private: keys.private
    }
  },

  sign: function (private, message) {
    return ecc.sign(curve, private, hash(message))
  },

  verify: function (public, sig, message) {
    return ecc.verify(curve, public, sig, hash(message))
  },

  restore: function (seed) {
    return ecc.restore(curve, seed)
  }

}
