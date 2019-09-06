import React, {Component} from 'react';
import {
  View, Text, TouchableOpacity, PermissionsAndroid, StyleSheet, Dimensions, Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import WaitScreen from './WaitScreen';
const {width, height} = Dimensions.get('window');
class ScanActivity extends Component<Props>{
  constructor(props) {
    super(props);
    this.state = {
      ip: "",
      bill_id: "",
      waiting: 0
    };
    this.onDSuccess = this.onDSuccess.bind(this);
  }
  onDSuccess = async (e) => {
    this.setState({
      send: 0
    })
    var val = e.data;
    var t = val.substring(0,7);
    if(!(t==='dvkcool')){
      Alert.alert("Invalid QR code");
      fetch('https://www.google.co.in', {
        method: 'GET',
      })
      .then((res) => {
      this.scanner.reactivate();
      })
      .catch((error) => {
        this.scanner.reactivate();
        console.error(error);
      });
    }
    else{
      console.log(val);
      console.log(this.props.detail);
      t = val.substring(8);
      this.setState({
        waiting: 1
      });
      t ='http://' + t;
      AsyncStorage.setItem('url', t);
      t =  t +'/regQueue';

      console.log(t);
      var dept= this.props.detail;
      fetch(t, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service: dept
        })
      }).then((res) => res.json())
      .then((res) => {
        console.log(res);
        AsyncStorage.setItem('dept', res.dept);
        AsyncStorage.setItem('service', dept).then(()=>{
          var wt = ''+ res.wait_time;
          AsyncStorage.setItem('wait_time', wt).then(()=>{
            AsyncStorage.setItem('token', res.token).then(()=>{
              this.setState({
                waiting: 0
              });
              this.props.navigation.navigate('QWait');
            })
          });
        });
      })
      .catch((error) => {
        Alert.alert("Please contact the help desk.")
        this.scanner.reactivate();
        console.error(error);
      });
    }
  }
  render(){
    if(this.state.waiting===0){
      return(
          <QRCodeScanner
            onRead={this.onDSuccess}
            ref={(node) => { this.scanner = node }}
            reactivateTimeout = {10}
            cameraStyle={{ height: 200, marginTop: 100, width: 200, alignSelf: 'center', justifyContent: 'center' }}
          />
      );
    }
    else{
      return(
        <WaitScreen/>
      );
    }

  }
}
export default class ScanReg extends Component {
  static navigationOptions = {
    title: 'Join Queue',
  };

  render() {
    const detail = this.props.navigation.getParam('item', 'Others');
    return(
      <View>
        <View style={styles.instructions}>
          <Text style={styles.centerText}> 1. Please Connect to "Syndicate-Bank" Wifi from your network.
           {'\n'}2. Please scan QR code to continue
           </Text>
        </View>
        <ScanActivity navigation={this.props.navigation} detail={detail} style={{marginTop:500, height: 500}}/>
        <TouchableOpacity style={[styles.buttonTouchable, {marginTop: height*0.5, alignItems:'center', justifyContent:'center', width: width}]} onPress={() => this.props.navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  instructions: {
    width: '80%',
    marginLeft:'10%',
    borderRadius: 5,
    borderWidth: 1,
    marginTop:20,
    backgroundColor: '#ff9705',
    height: 150
  },
  QR_text: {
    color: '#000',
    fontSize: 19,
    padding: 8,
    marginTop: 12
  },
  button: {
    backgroundColor: '#2979FF',
    alignItems: 'center',
    padding: 12,
    width: 300,
    marginTop: 14
  },
  centerText: {
  fontSize: 18,
  color: 'white',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});
