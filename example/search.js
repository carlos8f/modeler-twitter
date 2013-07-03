var modeler = require('../')
  , prompt = require('cli-prompt')

prompt('consumer key: ', function (key) {
  prompt('consumer secret: ', function (secret) {
    prompt('search query: ', function (q) {
      modeler.getBearerToken(key, secret, function (err, token) {
        if (err) throw err;
        var tweets = modeler({
          name: 'tweets',
          q: q,
          lang: 'en',
          token: token
        });

        tweets.tail(0, {load: true}, showResult);

        function showResult (err, list, next) {
          if (err) throw err;
          list.forEach(function (tweet) {
            console.log('@' + tweet.user.screen_name + ': ' + tweet.text);
          });
          prompt('----- press ENTER for more -----', next);
        }
      });
    });
  });
});
