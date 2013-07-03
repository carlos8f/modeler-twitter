var request = require('request')
  , formatUrl = require('url').format
  , qs = require('querystring')

module.exports = function (_opts, cb) {
  var options = {};
  Object.keys(_opts).forEach(function (k) {
    options[k] = _opts[k];
  });

  // allow bind() with defaults
  Object.keys(this).forEach(function (k) {
    if (typeof options[k] === 'undefined') {
      options[k] = this[k];
    }
  }, this);

  if (options.bearerToken) {
    options.headers || (options.headers = {});
    options.headers['Authorization'] = 'Bearer ' + options.bearerToken;
  }

  var uri = formatUrl({
    protocol: 'https',
    host: 'api.twitter.com',
    pathname: options.path,
    query: options.params || options.query
  });

  var reqOpts = {
    uri: uri,
    method: options.method,
    headers: options.headers,
    body: typeof options.body === 'object' ? qs.stringify(options.body) : options.body,
    oauth: options.oauth
  };

  request(reqOpts, function (err, resp, body) {
    if (err) return cb(err);
    if (!options.raw) {
      if (resp.headers['content-type'].match(/json/)) {
        try {
          body = JSON.parse(body);
        }
        catch (e) {
          return cb(e);
        }
      }
      // urlencoded result as text/html? really twitter?
      else if (resp.headers['content-type'].match(/urlencoded|html/)) {
        try {
          body = qs.parse(body);
        }
        catch (e) {
          return cb(e);
        }
      }
    }
    cb(null, resp, body);
  });
};
