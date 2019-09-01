import React from 'react';
import {
  ActivityIndicator, AsyncStorage, TouchableOpacity, StatusBar, StyleSheet, View, Image,
  Dimensions, Text
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import Department from  './Department';
import ScanReg from './ScanReg';
const {width, height} = Dimensions.get('window');

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome to Syndicate Easy Queue',
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{width:width*0.8, height: height*0.2, marginLeft: width*0.1, marginTop: height*0.2}}
          source={require('../../res/banner.png')}
        />
      <View style={{alignItems: 'center',
        width:width,
        marginTop: 10
      }}><Text> ~ Team Infinite_Debug</Text></View>
        <TouchableOpacity
          activeOpacity = { .5 }
          style={[styles.roundButton, {marginTop: 50}]}
          onPress={this._signInAsync}>
          <AntDesign name="addusergroup" size={30} color="#fff" />
          <Text style= {{color:'#fff'}}> Register in Queue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity = { .5 }
          style={[styles.roundButton, {marginTop: 20}]}
          onPress={this._signInAsync}>
          <MaterialIcons name="rate-review" size={30} color="#fff" />
          <Text style= {{color:'#fff'}}> Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _signInAsync = async () => {
    //await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('Dept');
  };
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  roundButton: {
    marginLeft: width*0.2,
    width:width*0.6,
    borderRadius: 50,
    backgroundColor:'#00BCD4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
});
export default createStackNavigator({ SignIn: SignInScreen, Dept: Department, ScanReg: ScanReg });
