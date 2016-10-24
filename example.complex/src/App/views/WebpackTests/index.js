import styles from './style'
import Async from 'App/shared/util.AsyncComponent'
import React from 'react'
import { Y } from 'obj.Layout'

// the kb form these functions shouldn't show up in build
import { shake, shake2 } from './shake'

const water = [
  'squirtle',
  'starmie',
  'horsea'
]

const fire = [
  'charmeleon',
  'magmar',
  'ninetales'
]

const WebpackTests = ({specs}) =>
  <Y >
    <Y>
      <h4>in Development: {'' + __DEV__}</h4>
      <h4>in Production: {'' + __PROD__}</h4>
    </Y>
    <ul>
      This list of fire & water pokes was made using spread operator:
      {[...water, ...fire].map(
        poke =>
          <li key={poke}>
            {poke}
          </li>
      )}
    </ul>
    <h1 className={styles.title}>If I'm blue postcss-next and postcss-import are working.</h1>
    <Async loader={(cb) => System.import('./CodeSplit').then((module) =>
      cb(module)
    , 'CodeSplit')} />
  </Y>

export default WebpackTests
