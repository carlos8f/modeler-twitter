var search = require('./tweets-search')
  , timeline = require('./tweets-timeline')

module.exports = function (api) {
  if (api.options.q) api = search(api);
  else api = timeline(api, api.options.timeline || 'home');

  api._prepare = function (entity) {
    entity.created = new Date(entity.created_at);
    entity.rev = 1;
    entity.id = entity.id_str;
    return entity;
  }

  api._load = function (id, cb) {
    api._call({
      path: '/1.1/statuses/show.json',
      params: {
        id: id
      }
    }, function (err, resp, entity) {
      if (err) return cb(err);
      if (resp.statusCode !== 200) return cb(new Error('status ' + resp.statusCode + ' for /statuses/show: ' + body));
      cb(null, api._prepare(entity));
    });
  };

  api._save = function (entity, cb) {
    if (!api.options.oauth) return cb(new Error('saving tweet requires user authentication'));
    api._call({
      path: '/1.1/statuses/update.json',
      method: 'post',
      body: entity.text ? {status: entity.text} : entity
    }, function (err, resp, body) {
      if (err) return cb(err);
      if (resp.statusCode !== 200) return cb(new Error('status ' + resp.statusCode + ' for /statuses/update: ' + body));
      cb(null, api._prepare(body));
    });
  };

  api._destroy = function (id, cb) {
    if (!api.options.oauth) return cb(new Error('destroying tweet requires user authentication'));
    api._call({
      path: '/1.1/statuses/destroy/' + id + '.json',
      method: 'post'
    }, function (err, resp, body) {
      if (err) return cb(err);
      if (resp.statusCode !== 200) return cb(new Error('status ' + resp.statusCode + ' for /statuses/destroy: ' + body));
      cb(null, api._prepare(body));
    });
  };

  return api;
};
