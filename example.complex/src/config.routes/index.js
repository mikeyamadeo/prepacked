import React from 'react'

import { MatchWithSubRoutes } from 'utils.routing'

import App from 'App'
import WebpackTests from 'App/views/WebpackTests'

const routesData = [
  {pattern: '/', component: App, routes: [
    {pattern: '/', component: WebpackTests}
  ]}
]

const routes =
  <div>
    {routesData.map((route, i) =>
      <MatchWithSubRoutes {...{ ...route, key: i }} />
    )}
  </div>

export default routes
