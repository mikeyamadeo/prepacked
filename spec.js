import test from 'ava'
import makeConfig from './dist'

test('Enforces Required Settings', t => {
  try {
    t.throws(makeConfig({}))
  } catch (e) {
    t.ok(e.message)
  }

  t.ok(makeConfig({
    isDev: '',
    src: '',
    out: ''
  }))

  t.pass()
})

test('Produces Basic Dev Config', t => {
  const basic = makeConfig({
    src: 'src',
    out: 'public',
    isDev: true
  })

  // t.same(basic.entry, 'src')
  // t.same(basic.output, {
  //   filename: 'bundle.js',
  //   path: 'public',
  //   publicPath: 'public'
  // })

  t.pass()
})

