# prepacked

Use the power of webpack to effectively build in development and then ship for production with minimal setup.


✅ ship production level react apps

✅  enjoy 1st class development experience

✅ use latest web technologies

🚫 avoid the hassle and intimidation inherent with modern day project configuration


### peerDependencies
`npm i -save-dev babel-core babel-loader css-loader file-loader postcss-loader style-loader url-loader webpack webpack-dev-server babel-preset-es2015 babel-preset-react`

### Dev

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




