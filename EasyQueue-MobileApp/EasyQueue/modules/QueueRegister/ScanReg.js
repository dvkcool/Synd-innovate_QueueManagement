import React, {Component} from 'react';
import {
  View, Text, TouchableOpacity, PermissionsAndroid, StyleSheet
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
class ScanActivity extends Component<Props>{
  constructor(props) {
    super(props);
    this.state = {
      ip: "",
      bill_id: ""
    };
    this.onDSuccess = this.onDSuccess.bind(this);
  }
  onDSuccess(e) {
    this.setState({
      send: 0
    })
    var val = e.data;

    console.log(val);
    this.scanner.reactivate();
  }
  render(){
      return(
          <QRCodeScanner
            onRead={this.onDSuccess}
            ref={(node) => { this.scanner = node }}
            reactivateTimeout = {10}
            cameraStyle={{ height: 200, marginTop: 100, width: 200, alignSelf: 'center', justifyContent: 'center' }}
            topContent={
              <Text style={styles.centerText}>
                Scan QR code to add product to bill
              </Text>
            }
            bottomContent={
              <TouchableOpacity style={styles.buttonTouchable} onPress={() => this.props.navigation.navigate('Home')}>
                <Text style={styles.buttonText}>OK. Got it!</Text>
              </TouchableOpacity>
        }
          />
      );
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
        <Text> 1. Please Connect to "Syndicate-Bank" Wifi from your network.</Text>
        <Text> 2. Please scan QR code to continue</Text>
        <Text> {detail}</Text>
        <ScanActivity navigation={this.props.navigation} style={{marginTop:500, height: 500}}/>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: (Platform.OS) === 'ios' ? 20 : 0,
    alignItems: 'center',
    justifyContent: 'center',
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
  flex: 1,
  fontSize: 18,
  padding: 32,
  color: '#777',
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
