prepacked
=========

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)


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
    "start": "prepacked-dev-server",
    "build": "cross-env NODE_ENV=production prepacked-build-script"
  },
  "devDependencies": {
    "cross-env": "1.0.7",
    "prepacked": "1.4.0"
  }
}
```

###### Development
Running `npm start` in your terminal will allow you to:
* write your javascript using es6 and jsx
* style your app using [CSS Modules](http://glenmaddern.com/articles/css-modules) & [cssnext](http://cssnext.io/)
* view app at `localhost:8080`. changes automatically update on every save.

###### Production
Running `npm run build` in your terminal will spit out minified, bundled, sourcemapped js and css goodness for you to ship a la:
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

To Document:
* how prepacked generates html & how to cutomize it
* adding feature flags like __DEV__ && __PROD__
* adding entry point for styles
* resolves
* devServer configuration / adding host for hot reloading over the network




