var modeler = require('../')
  , prompt = require('cli-prompt')

prompt('consumer key: ', function (key) {
  prompt('consumer secret: ', function (secret) {
    prompt('screen name: ', function (screen_name) {
      modeler.getBearerToken(key, secret, function (err, token) {
        if (err) throw err;
        var tweets = modeler({
          name: 'tweets',
          screen_name: screen_name,
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
