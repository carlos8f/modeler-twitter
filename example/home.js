var modeler = require('../')
  , prompt = require('cli-prompt')

modeler.oauthPrompt(function (err, oauth) {
  if (err) throw err;
  var tweets = modeler({
    name: 'tweets',
    oauth: oauth
  });

  tweets.tail(0, {load: true}, showResult);

  function showResult (err, list, next) {
    if (err) throw err;
    list.forEach(function (tweet) {
      console.log('@' + tweet.user.screen_name + ': ' + tweet.text);
    });
    prompt('press ENTER for more...', next);
  }
});
