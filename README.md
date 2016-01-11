# prepacked

The power of webpack with simplified configuration. All the tools to effectively build in development and then ship for production with minimal setup.

Built for those who want to ship production level apps with a 1st class develepment experience and the latest web technologies without the hassle and intimidation inherent with webpack configuration.

#### Dev

This

```js

// webpack.config.js
var getConfig = require('prepacked')

module.exports = getConfig({
  isDev: true,
  src: 'src',
  out: 'public'
})

```

+

```json
{
  "scripts": {
    "start": "webpack-dev-server --inline --hot"
  }
}
```

+

`npm start`

Will allow you to:
* write your javascript using es6 and jsx
* style your app using [CSS Modules](http://glenmaddern.com/articles/css-modules) & [cssnext](http://cssnext.io/)
* view your app at `localhost:8080` (default: see `port` config for other options)
* have app automatically refresh on every save



To Document:
* use of env variables to declare isDev value / choose html to use.
* default html
* feature flags



