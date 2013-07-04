var modeler = require('../')
  , prompt = require('cli-prompt')

modeler.oauthPrompt(function (err, oauth) {
  if (err) throw err;
  var tweets = modeler({
    name: 'tweets',
    oauth: oauth
  });

  prompt('tweet text: ', function (text, end) {
    tweets.create({text: text}, function (err, tweet) {
      if (err) throw err;
      console.log('created tweet', tweet);
      end();
    });
  });
});
