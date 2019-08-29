import React, {Component} from 'react';
import {
  ActivityIndicator, AsyncStorage, TouchableOpacity, StatusBar, StyleSheet, View, Image,
  Dimensions, Text, FlatList, TouchableHighlight, TextInput
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
const {width, height} = Dimensions.get('window');
import ListRow from './ListRow';
export default class Department extends Component {
  static navigationOptions = {
    title: 'Select Service : EasyQueue',
  };
  constructor(props) {
    super(props);
    this.arrayholder = ['Cash Deposit', 'Cash Withdrawl', 'Account to Account Transfer', 'Cheque Deposit',
                        'Demand draft issue', 'Government Challan', 'Saving Account', 'Current Account',
                        'NEFT/RTGS', 'PPF/Sukanya Samridhi', 'Fixed Deposit', 'Recurring Deposit',
                        'KYC Update', 'Mobile Update/Change', 'Form 15G/H or other Pension related Queries',
                        'Internet Banking/AutomatedAddress Change', 'Passbook Update', 'Others'];
    this.state = {
      loading: false,
      data: this.arrayholder,
      error: null,
    };
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };
  SearchFilterFunction = text => {
    this.setState({
      value: text,
    });

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
    });
  };

  render(){
    return(
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={{flex: 0.1, flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
          <View style={{flex:0.1, alignItems:'center', justifyContent:'center'}}>
            <Ionicons name="ios-search" size={30} color="black" />
          </View>

          <TextInput
            style={styles.textInputStyle}
            onChangeText={text => this.SearchFilterFunction(text)}
            value={this.state.text}
            underlineColorAndroid="transparent"
            placeholder="Search Here"
          />
        </View>
        <FlatList
         data={this.state.data}
         renderItem={({ item, index }) => (
               <View style={styles.card}>
                 <Text>{item}</Text>
               </View>

         )}
         style={{ marginTop: 10, flex: 0.9}}
         keyExtractor={(item, index) => index.toString()}
         ListHeaderComponent={this.renderHeader}
       />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    flex: 1,
    marginTop: 40,
    padding: 16,
  },
  textStyle: {
    padding: 10,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: 'grey',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    flex:0.9
  },
  card: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: 'grey',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    marginTop: 5,
    width: '85%',
    marginLeft: '8%'
  }
});
