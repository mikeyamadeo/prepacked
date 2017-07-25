import style from './styles/styleA'
import deaf, { shake, shake2 } from './shake'
import { fA, fB } from './func'
// shake(shake)
fA()
fB()

if (module.hot) {
  console.log('tyranitar')
}
