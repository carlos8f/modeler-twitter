var bignum = require('bignum');

module.exports = function home (api) {
  api._tail = function (limit, cb) {
    if (!api.options.oauth) return cb(new Error('home timeline requires user authentication'));
    var max_id;
    (function fetchNext () {
      var params = {};
      if (limit) params.limit = limit;
      if (max_id) params.max_id = max_id.sub(1).toString();
      api._call({
        path: '/1.1/statuses/home_timeline.json',
        params: params
      }, function (err, resp, body) {
        if (err) return cb(err);
        // basic rate limiting
        if (resp.statusCode === 429) return setTimeout(fetchNext, (resp.headers['x-rate-limit-reset'] * 1000) - Date.now());
        if (resp.statusCode !== 200) return cb(new Error('non-200 status returned for /statuses/home_timeline: ' + resp.statusCode + ', ' + JSON.stringify(body, null, 2)));
        body.forEach(function (tweet, idx) {
          if (!max_id) max_id = bignum(tweet.id_str);
          var id = bignum(tweet.id_str);
          if (id.lt(max_id)) max_id = id;
          body[idx] = api._prepare(tweet);
        });
        cb(null, body, fetchNext);
      });
    })();
  };

  return api;
};
