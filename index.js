var modeler = require('modeler')
  , call = require('./lib/call')
  , prompt = require('cli-prompt')
  , open = require('open')

module.exports = function (_opts) {
  var api = modeler(_opts);

  api._call = call.bind({
    bearerToken: api.options.token,
    oauth: api.options.oauth
  });

  switch (api.options.name) {
    case 'tweets': return require('./lib/tweets')(api);
    default: throw new Error('collection not supported: ' + api.options.name);
  }
};

module.exports.getBearerToken = function (key, secret, cb) {
  call({
    method: 'post',
    path: '/oauth2/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Authorization': 'Basic ' + Buffer(key + ':' + secret).toString('base64')
    },
    body: {
      grant_type: 'client_credentials'
    }
  }, function (err, resp, body) {
    if (err) return cb(err);
    if (resp.statusCode !== 200) return cb(new Error('status ' + resp.statusCode + ' for /oauth2/token: ' + body));
    cb(null, body.access_token);
  });
};

module.exports.oauthPrompt = function (cb) {
  function checkResult (err, resp, body) {
    if (err) {
      cb(err);
      return true;
    }
    if (resp.statusCode !== 200) {
      cb(new Error('non-200 status: ' + resp.statusCode + ', ' + JSON.stringify(body, null, 2)));
      return true;
    }
  }

  var oauth = {
    callback: 'oob'
  };

  prompt('consumer key: ', function (key) {
    oauth.consumer_key = key;
    prompt('consumer secret: ', function (secret) {
      oauth.consumer_secret = secret;
      call({
        method: 'post',
        path: '/oauth/request_token',
        oauth: oauth
      }, function (err, resp, body) {
        if (checkResult(err, resp, body)) return;
        oauth.token = body.oauth_token;
        open('https://api.twitter.com/oauth/authorize?oauth_token=' + oauth.token);
        prompt('enter pin: ', function (pin, end) {
          oauth.verifier = pin;
          call({
            method: 'post',
            path: '/oauth/access_token',
            oauth: oauth
          }, function (err, resp, body) {
            if (checkResult(err, resp, body)) return;

            oauth.token = body.oauth_token;
            oauth.token_secret = body.oauth_token_secret;

            end();
            cb(null, oauth);
          });
        });
      });
    });
  });
};
