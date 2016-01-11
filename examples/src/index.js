import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const node = document.getElementById('app')

const props = __DEV__
  ? { name: 'development', theme: 'dev' }
  : { name: 'production', theme: 'prod' }

ReactDOM.render(
  <App { ...props } />,
  node
)
