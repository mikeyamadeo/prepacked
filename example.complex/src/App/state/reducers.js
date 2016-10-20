import { createReducer } from 'utils.redux'
import { shake, shake2 } from './shake'

/**
 * This reducer is here in order to demonstrate inputting and retrieving state w/ redux.
 * Because it is only used in one view and does not change, a hard coded array in the
 * component that uses it normally would be plenty appropriate.
 *
 * When removing this reducer, don't forget to unregister it from redux.reducers
 */
export const appSpecs = createReducer([
  'react 😘',
  'redux 🎉',
  'webpack',
  'babel / es6',
  'Aphrodite'
], {})
