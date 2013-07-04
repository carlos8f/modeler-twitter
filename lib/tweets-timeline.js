var bignum = require('bignum');

module.exports = function (api, name) {
  api._head = function (offset, limit, cb) {
    return cb(new Error('head() is not supported for timelines - please use tail() instead'));
  };
  api._tail = function (max_id, limit, cb) {
    if (max_id) max_id = bignum(max_id);
    (function fetchNext () {
      var params = {
        user_id: api.options.user_id,
        screen_name: api.options.screen_name
      };
      if (limit) params.count = limit;
      if (max_id) params.max_id = max_id.sub(1).toString();
      api._call({
        path: '/1.1/statuses/' + name + '_timeline.json',
        params: params
      }, function (err, resp, body) {
        if (err) return cb(err);
        // basic rate limiting
        if (resp.statusCode === 429) return setTimeout(fetchNext, (resp.headers['x-rate-limit-reset'] * 1000) - Date.now());
        if (resp.statusCode !== 200) return cb(new Error('non-200 status returned for ' + params.path + ': ' + resp.statusCode + ', ' + JSON.stringify(body, null, 2)));
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
