import React, { Component } from 'react'
import {
  View, Image, TouchableOpacity
} from 'react-native'
import {
  styles
} from '../styles/styles'

const randomElementOf = (items) => {
  return items[Math.floor(Math.random() * items.length)]
}

const randomIntegerBetween = (min, max) => {
  return Math.random() * (max - min) + min
}

export const human = require('../img/human.png')
export const alien = require('../img/alien.png')

export class Hole extends Component {
  constructor (props) {
    super(props)
    this.state = this.initialState()
  }

  initialState = () => {
    return {
      offset: this.randomOffset(),
      character: this.randomCharacter()
    }
  }

  randomOffset = () => {
    return randomIntegerBetween(0, 200)
  }

  randomCharacter = () => {
    return randomElementOf([alien, human, null])
  }

  render () {
    return (
      <TouchableOpacity style={[styles.hole, { left: this.state.offset }]}
        onPress={this.pressHole} >

        {this.state.character ? <Image source={this.state.character}
          style={styles.icon} /> : (<View />) }
      </TouchableOpacity>
    )
  }

  pressHole = () => {
    if (!this.state.character) return
    const newState = Object.assign({}, this.state)
    this.props.onKill(this.state.character)
    newState.character = null
    this.setState(newState)
  }

  resetHole = () => {
    this.setState(this.initialState())
  }
}
