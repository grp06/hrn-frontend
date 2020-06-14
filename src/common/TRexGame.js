import * as React from 'react'

const classes = {
  runnerWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

class TRexGame extends React.Component {
  outerContainerEl

  constructor(props) {
    console.log('props from TrexGame', props)
    super(props)
    this.state = {
      outerContainerEl: props.outerContainerEl.current,
    }
  }

  async componentDidMount() {
    const config = {
      id: 'runner',
      width: this.outerContainerEl.offsetWidth,
    }
    const { Runner } = await import('./Runner')
    const runner = new Runner(this.outerContainerEl, config)
    runner.init()
  }

  render() {
    return <div ref={this.state.outerContainerEl} className={classes.runnerWrapper} />
  }
}

export default TRexGame
