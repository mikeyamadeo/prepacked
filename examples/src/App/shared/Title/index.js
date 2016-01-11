import React from 'react'
import style from './style'

const Title = ({children, main}) => main
  ? <h1 className={style.main}>{children}</h1>
  : <h2 className={style.sub}>{children}</h2>

export default Title
