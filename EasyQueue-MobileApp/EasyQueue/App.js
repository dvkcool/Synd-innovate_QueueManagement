import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

import RegStack from './modules/QueueRegister/QReg';
import WaitStack from './modules/QueueWait/QWait';

class QCheck extends React.Component {
  constructor() {
    super();
    this._checkScreenAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _checkScreenAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    console.log(userToken);
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'QWait' : 'QRegister');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default createAppContainer(createSwitchNavigator(
  {
    QCheck: QCheck,
    QWait: WaitStack,
    QRegister: RegStack,
  },
  {
    initialRouteName: 'QCheck',
  }
));
