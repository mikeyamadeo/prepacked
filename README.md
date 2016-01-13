[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

prepacked
=========

_Use the power of webpack to effectively build in development and then ship for production with minimal setup._

###### What `you` do:

👌🏼 ️ship production level react apps

🎉 enjoy 1st class development experience

😘 use latest web technologies

😱 avoid the hassle and intimidation inherent with modern day project configuration


###### What `prepacked` does:

👋 assumes you may be new to this javascript app building business

🗿 holds an opinion. favors convention over configuration

✨ avoids magic. requires explicit command instead of making implicit assumptions

## Quick Look

###### webpack.config.js:
```js
// looks to see if you've told the node "environmnet" to be in production
var isDev = process.env.NODE_ENV !== 'production'
var makeConfig = require('prepacked')

module.exports = makeConfig({
  isDev: isDev,
  src: './src',
  out: './public'
})
```

###### package.json:
```json

{
  "scripts": {
    "dev": "webpack-dev-server --inline --hot",
    "prod": "NODE_ENV=production webpack"
  }
}
```

Running `npm run dev` will allow you to:
* write your javascript using es6 and jsx
* style your app using [CSS Modules](http://glenmaddern.com/articles/css-modules) & [cssnext](http://cssnext.io/)
* view app at `localhost:8080`. changes automatically update on every save.

Running `npm run prod` will spit out minified, bundled, sourcemapped js and css goodness for you to ship a la:
```
public
├── app.js
├── app.js.gz
├── app.js.map
├── index.html
├── style.css
├── style.css.gz
└── style.css.map
```

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





To Document:
* use of env variables to declare isDev value / choose html to use.
* default html
* feature flags




