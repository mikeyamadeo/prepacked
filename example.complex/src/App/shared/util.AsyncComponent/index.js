import React from 'react'
// import Loading from 'atm.Loading'

const AsyncComponent = React.createClass({
  getInitialState () {
    return {
      component: null
    }
  },

  propTypes: {
    loader: React.PropTypes.func.isRequired,
    renderPlaceholder: React.PropTypes.func
  },

  componentDidMount () {
    this.props.loader((componentModule) => {
      this.setState({
        component: componentModule.default
      })
    })
  },

  renderPlaceholder () {
    return <h1>'loading'</h1>
  },

  render () {
    if (this.state.component) {
      return <this.state.component {...this.props}/>
    }

    return (this.props.renderPlaceholder || this.renderPlaceholder)()
  }
})

export default AsyncComponent
