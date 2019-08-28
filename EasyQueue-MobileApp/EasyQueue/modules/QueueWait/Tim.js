import React, { Component } from 'react';

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Pie from 'react-native-pie';
export default class StopWatch extends Component {

  constructor(props) {
    super(props);

    this.state = {
      timer: null,
      minutes_set: 5,
      seconds_set: 0,
      minutes_Counter: '05',
      seconds_Counter: '00',
      startDisable: false,
      fraction: [100]
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  onButtonStart = () => {

    let timer = setInterval(() => {

      var num = (Number(this.state.seconds_Counter) - 1).toString(),
        count = this.state.minutes_Counter;

      if (Number(this.state.seconds_Counter) == 0) {
        count = (Number(this.state.minutes_Counter) - 1).toString();
        num = '59';
      }
      var t = Number(this.state.minutes_set)*60 + Number(this.state.seconds_set);
      var x = Number(count) * 60 +Number(num);
      var f = x/t * 100;
      if(x==0){
        clearInterval(this.state.timer);
        this.setState({startDisable : false});
      }
      this.setState({
        minutes_Counter: count.length == 1 ? '0' + count : count,
        seconds_Counter: num.length == 1 ? '0' + num : num,
        fraction: [f]
      });
    }, 1000);
    this.setState({ timer });

    this.setState({startDisable : true})
  }


  onButtonStop = () => {
    clearInterval(this.state.timer);
    this.setState({startDisable : false})
  }


  onButtonClear = () => {
    this.setState({
      timer: null,
      minutes_Counter: '05',
      seconds_Counter: '00',
    });
  }

  render() {
    return (
      <View style={styles.MainContainer}>
        <View>
          <Pie
            radius={50}
            innerRadius={45}
            series={this.state.fraction}
            colors={['green']}
            backgroundColor='#ddd' />
          <View style={styles.gauge}>
            <Text style={styles.gaugeText}>{this.state.minutes_Counter} : {this.state.seconds_Counter}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={this.onButtonStart}
          activeOpacity={0.6}
          style={[styles.button, { backgroundColor: this.state.startDisable ? '#B0BEC5' : '#FF6F00' }]}
          disabled={this.state.startDisable} >

          <Text style={styles.buttonText}>START</Text>

        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonStop}
          activeOpacity={0.6}
          style={[styles.button, { backgroundColor:  '#FF6F00'}]} >

          <Text style={styles.buttonText}>STOP</Text>

        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onButtonClear}
          activeOpacity={0.6}
          style={[styles.button, { backgroundColor: this.state.startDisable ? '#B0BEC5' : '#FF6F00' }]}
          disabled={this.state.startDisable} >

          <Text style={styles.buttonText}> CLEAR </Text>

        </TouchableOpacity>

      </View>

    );
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    width: '80%',
    paddingTop:8,
    paddingBottom:8,
    borderRadius:7,
    marginTop: 10
  },
  buttonText:{
      color:'#fff',
      textAlign:'center',
      fontSize: 20
  },
  counterText:{

    fontSize: 28,
    color: '#000'
  },
  gauge: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeText: {
    backgroundColor: 'transparent',
    color: '#000',
    fontSize: 24,
  },
});
