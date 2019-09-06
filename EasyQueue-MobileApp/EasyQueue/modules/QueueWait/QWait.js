import React from 'react';
import {
  ActivityIndicator, Button,
  StatusBar, StyleSheet, View, Text, Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Pie from 'react-native-pie';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import hindi from '../../strings/hindi';
import english from '../../strings/english';
import Tim from './Tim';
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome to EasyQueue',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Show me more of the app" onPress={this._showMoreApp} />
        <Button title="Cancel My Ticket" onPress={this.cancelTicket} />
          <View>
            <Pie
              radius={50}
              innerRadius={45}
              series={[60]}
              colors={['green']}
              backgroundColor='#ddd' />
            <View style={styles.gauge}>
              <Text style={styles.gaugeText}>60%</Text>
            </View>
          </View>
        <Text>{str.god}</Text>
      </View>
    );
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Other');
  };

  cancelConfirm = async () =>{
    var url = await AsyncStorage.getItem('url');
    var token = await AsyncStorage.getItem('token');
    var dept = await AsyncStorage.getItem('dept');
    url = url +'/cancelTicket';
    console.log(url);
    fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
        dept: dept
      })
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      Alert.alert("Please contact the help desk.")
      console.error(error);
    });
    await AsyncStorage.clear();
    this.props.navigation.navigate('QRegister');
  }
  cancelTicket = async () => {
    Alert.alert(
      'Confirm Cancel',
      'Are you sure you want to cancel your token',
      [
        {text: 'NO', onPress: () =>  console.log("cancel cancel hahaha"),style: 'cancel'},
        {text: 'YES', onPress: () => this.cancelConfirm()},
      ]
    );
  };
}
var str = english;
class OtherScreen extends React.Component {
  static navigationOptions = {
    title: 'Lots of features here',
  };
  constructor() {
    super();
    this._checkLanguage();
  }

  _checkLanguage = async () => {
    await AsyncStorage.setItem('language', 'hindi');
    const lang = await AsyncStorage.getItem('language');
    console.log(lang);
    if(lang == 'hindi'){
      console.log("Match Hindi");
      str = hindi;
    }
    else{
      str = english;
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>{str.god}</Text>
          <View>
            <Pie
              radius={50}
              innerRadius={45}
              series={[60]}
              colors={['green']}
              backgroundColor='#ddd' />
            <View style={styles.gauge}>
              <Text style={styles.gaugeText}>60%</Text>
            </View>
          </View>
        <Button title="I'm done, sign me out" onPress={this._signOutAsync} />
        <StatusBar barStyle="default" />
      </View>
    );
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('QRegister');
  };
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

export default createStackNavigator({ Home: HomeScreen, Other: Tim });
