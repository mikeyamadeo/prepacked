import './style'

import React from 'react'
import Title from 'App/shared/Title'

const App = ({name, theme}) =>
  <div>
    <Title main={theme === 'dev'}>
      {name}!
    </Title>
  </div>

export default App
