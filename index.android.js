import React, { Component } from 'react'
import {
  AppRegistry, View, Text,
  Button, Alert
} from 'react-native'
import {
  styles
} from './styles/styles'
import {
  intervalLength, Timer
} from './components/timer'
import {
  Hole, human, enableSecretLevel, disableSecretLevel
} from './components/hole'

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
    if (newState.humansKilled === 7 && newState.aliensKilled === 9) {
      enableSecretLevel()
    }
    this.setState(newState)
  }

  onTimeEnd = () => {
    clearInterval(this.intervalObj)
    Alert.alert(
      'Time out!',
      "You've run out of time, start over\n\n" +
      this.state.humansKilled + ' humans killed\n' +
      this.state.aliensKilled + ' aliens killed',
      [ { text: 'RESET', onPress: this.resetGame }
//        Add this line to enable alert cancel button for debugging
//        , { text: 'debugCANCEL', onPress: () => {} }
      ],
      { cancelable: false }
    )
  }

  resetGame = () => {
    disableSecretLevel()
    this.resetHoles()
    this.refs.timer.resetTimer()
    this.setState(this.initialState())
  }
}

AppRegistry.registerComponent('zadanie2', () => zadanie2)
