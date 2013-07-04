modeler-twitter
===============

twitter backend for modeler functional entity system

## Authentication

### Use with [app-level bearer token](https://dev.twitter.com/docs/auth/application-only-auth):

```js
var modeler = require('modeler-twitter');

// create a collection
var tweets = modeler({
  name: 'tweets', // required
  token: 'my-bearer-token' // should be a bearer token
});
```

### Use with [user-level OAuth token](https://dev.twitter.com/docs/auth/obtaining-access-tokens):

```js
var modeler = require('modeler-twitter');

// create a collection
var tweets = modeler({
  name: 'tweets', // required
  oauth: {
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
    token: oauth_token,
    token_secret: oauth_token_secret
  }
});
```

## Collection: `tweets`

- Only the `tail()`, `create()` and `destroy()` methods are supported
- Pass `q` option to fetch search results
- Pass `screen_name` or `user_id` option to fetch a user's timeline
- Pass `timeline: 'mentions'` to fetch mentions timeline
- Otherwise defaults to `home` timeline of authenticated user
- Examples: [home timeline](https://github.com/carlos8f/modeler-twitter/blob/master/example/home.js),
  [user timeline](https://github.com/carlos8f/modeler-twitter/blob/master/example/user.js),
  [search](https://github.com/carlos8f/modeler-twitter/blob/master/example/search.js)

### Example: posting a tweet

```js
var modeler = require('modeler')
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
```

## Collection: `friends`

Coming soon

## Collection: `followers`

Coming soon

See [modeler](https://github.com/carlos8f/modeler) for the full API.

- - -

### Developed by [Terra Eclipse](http://www.terraeclipse.com)
Terra Eclipse, Inc. is a nationally recognized political technology and
strategy firm located in Aptos, CA and Washington, D.C.

- - -

### License: MIT

- Copyright (C) 2013 Carlos Rodriguez (http://s8f.org/)
- Copyright (C) 2013 Terra Eclipse, Inc. (http://www.terraeclipse.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
