import React, { Component } from 'react'
import {
  AppRegistry, StyleSheet, View, Text, Image,
  Button, TouchableOpacity, Dimensions, Alert
} from 'react-native'

const randomElementOf = (items) => {
  return items[Math.floor(Math.random() * items.length)]
}

const randomIntegerBetween = (min, max) => {
  return Math.random() * (max - min) + min
}

const human = require('./img/human.png')
const alien = require('./img/alien.png')

const intervalLength = 50
const maxSeconds = 30 //TODO
const maxTicks = maxSeconds * 1000 / intervalLength

class Timer extends Component {
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

class Hole extends Component {
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

class zadanie2 extends Component {
  constructor (props) {
    super(props)
    this.holesNumber = 4
    this.state = this.initialState()
  }

  initialState () {
    return { aliensKilled: 0, humansKilled: 0, gameStarted: false }
  }

  componentDidMount = () => {
    if (!this.state.gameStarted) {
      this.intervalObj = setInterval(this.refs.timer.decreaseTimer, intervalLength)
      const newState = Object.assign({}, this.state)
      newState.gameStarted = true
      this.setState(newState)
    }
  }

  componentDidUpdate = this.componentDidMount

  render () {
    let holes = []
    for (let i = 0; i < this.holesNumber; i++) {
      holes.push(<Hole key={i} ref={'' + i} onKill={this.onKill} />)
    }

    return (
      <View>
        <Timer ref='timer' onTimeEnd={this.onTimeEnd} />
        <View style={styles.holeContainer} >
          {holes}
        </View>
        <Text style={styles.label} > Humans killed: {this.state.humansKilled} </Text>
        <Text style={styles.label} > Aliens killed: {this.state.aliensKilled} </Text>
        <Button title='RESPAWN' onPress={this.resetHoles} />
      </View>
    )
  }

  resetHoles = () => {
    for (let i = 0; i < this.holesNumber; i++) {
      this.refs[i].resetHole()
    }
  }

  onKill = (unit) => {
    const newState = Object.assign({}, this.state)
    if (unit === human) newState.humansKilled++
    else newState.aliensKilled++
    this.setState(newState)
  }

  onTimeEnd = () => {
    clearInterval(this.intervalObj)
    Alert.alert(
      'Time out!',
      "You've run out of time, start over\n\n" +
      this.state.humansKilled + ' humans killed\n' +
      this.state.aliensKilled + ' aliens killed',
      [ { text: 'RESET', onPress: this.resetGame },
      { text: 'debugCANCEL', onPress: () => {} } ],
      { cancelable: false }
    )
  }

  resetGame = () => {
    this.resetHoles()
    this.refs.timer.resetTimer()
    this.setState(this.initialState())
  }
}

const styles = StyleSheet.create({
  holeContainer: {
    borderWidth: 2,
    borderColor: '#516300',
    padding: 9,
    margin: 8,
    top: 0
  },
  label: {
    fontSize: 15
  },
  hole: {
    borderWidth: 2,
    height: 100,
    width: 100,
    backgroundColor: '#595959',
    borderColor: '#000000',
    borderRadius: 50,
    margin: 3
  },
  timer: {
    backgroundColor: '#7fef43',
    margin: 8,
    height: 30,
    left: 0
  },
  icon: {
    width: 100,
    height: 100,
    right: 2,
    bottom: 2
  }
})

AppRegistry.registerComponent('zadanie2', () => zadanie2)
