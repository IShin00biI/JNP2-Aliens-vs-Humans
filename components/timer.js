import React, { Component } from 'react'
import {
  View, Dimensions
} from 'react-native'
import {
  styles
} from '../styles/styles'

// Modifiable
// Time between timer refreshing
export const intervalLength = 50 // in miliseconds
// Starting time left of timer
export const maxSeconds = 30

// Don't modify without adjusting rest of the code!
export const maxTicks = maxSeconds * 1000 / intervalLength

export class Timer extends Component {
  constructor (props) {
    super(props)
    this.state = this.initialState()
    this.maxWidth = Dimensions.get('window').width -
      2 * styles.timer
  }

  initialState = () => {
    return {
      ticksLeft: maxTicks
    }
  }

  render () {
    let color
    let tickFraction = this.state.ticksLeft * 1.0 / maxTicks
    if (tickFraction > 0.5) color = '#00ff00' // green
    else if (tickFraction > 0.25) color = '#ffff00' // yellow
    else color = '#ff0000' // red
    let dynamicStyle = {
      width: Math.floor(this.maxWidth * tickFraction),
      backgroundColor: color
    }
    return (
      <View style={[styles.timer, dynamicStyle]} />
    )
  }

  decreaseTimer = () => {
    const newState = Object.assign({}, this.state)
    newState.ticksLeft--
    if (newState.ticksLeft > 0) {
      this.setState(newState)
    } else {
      this.props.onTimeEnd()
    }
  }

  resetTimer = () => {
    this.setState(this.initialState())
  }
}
