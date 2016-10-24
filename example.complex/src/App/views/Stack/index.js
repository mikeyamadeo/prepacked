import styles from './style'
import Async from 'App/shared/util.AsyncComponent'
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { StyleSheet, css } from 'aphrodite'
import { clr } from 'App/style/settings'

import { capitalize } from 'utils.rendering'
import { Y } from 'obj.Layout'

const Stack = ({specs}) =>
  <Y className={css(style.container)}>
    <h1 className={`${css(style.h1)} ${styles.title}`}>
      made with <span className={css(style.heart)}>&#9829;</span> and
    </h1>
    <Y tag='ul' className={css(style.list)}>
      {specs.map((item, i) =>
        <li key={i} className={css(style.listItem)}>
          { capitalize(item) }
        </li>
      )}
    </Y>
    <Async loader={(cb) => System.import('./components/Hello').then((module) =>
        cb(module)
      , 'passwordResetEmail')} />
  </Y>

Stack.propTypes = {
  specs: PropTypes.array
}

const mapStateToProps = ({ appSpecs }) => ({
  specs: appSpecs
})

export default connect(mapStateToProps)(Stack)

const style = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: '100%'
  },
  h1: {
    width: '100%',
    margin: 0,
    padding: '15px 0',
    minHeight: '70px',
    textAlign: 'center',
    backgroundColor: 'white'
  },
  list: {
    listStyle: 'none',
    padding: '20px 0'
  },
  listItem: {
    fontSize: '2em',
    marginTop: '10px',
    textAlign: 'center',
    '@media (min-width: 31.25em)': {
      fontSize: '3em'
    }
  },
  heart: {
    color: clr.negative
  }
})
