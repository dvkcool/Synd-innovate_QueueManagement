import React from 'react';
import {
  ActivityIndicator, Button, Dimensions, TouchableOpacity,
  StatusBar, StyleSheet, View, Text, Alert, ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Pie from 'react-native-pie';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import hindi from '../../strings/hindi';
import english from '../../strings/english';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StarRating from 'react-native-star-rating';

const {width, height} = Dimensions.get('window');
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome to EasyQueue',
  };
  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      minutes_set: 5,
      seconds_set: 0,
      minutes_Counter: '05',
      seconds_Counter: '00',
      startDisable: false,
      fraction: [100],
      starCountClean: 3.5,
      starCountAmb: 3.5,
      starCountServ: 3.5
    }
  }
  perform = async ()=>{
    var url =  await AsyncStorage.getItem('url');
    var token = await AsyncStorage.getItem('token');
    var service =  await AsyncStorage.getItem('service');
    var wait_time = await AsyncStorage.getItem('wait_time');
    var wt = wait_time;
    wait_time = parseInt(wait_time, 10);
    this.setState({
      token: token,
      service: service,
      url: url,
      timer: null,
      minutes_set: wait_time,
      seconds_set: 0,
      minutes_Counter: wt,
      seconds_Counter: '00',
      startDisable: false,
      fraction: [100]
    });
    this.onButtonStart();
  }
  componentDidMount(){
    this.perform();
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
    clearInterval(this.state.rtimer);
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
    let rtimer = setInterval(() => {
      this.checkTurn();
    }, 20000);
    this.setState({rtimer});
    this.setState({ timer });

    this.setState({startDisable : true})
  }

   onStarRatingPressClean(rating) {
     this.setState({
       starCountClean: rating
     });
   }
   onStarRatingPressAmb(rating) {
     this.setState({
       starCountAmb: rating
     });
   }
   onStarRatingPressServ(rating) {
     this.setState({
       starCountServ: rating
     });
   }
  onButtonStop = () => {
    clearInterval(this.state.timer);
    clearInterval(this.state.rtimer);
    this.setState({startDisable : false});
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
      <ImageBackground source={require('../../res/ticket.png')} style={{flex: 1, flexDirection: 'column',
        width: '100%', height: '100%', resizeMode: 'contain',}}>
      <View style={styles.container}>
        <View style={{flex: 1, position:'absolute', top:height*0.25, left: width*0.1, flexDirection:'row' }}>
          <View style={{flex: 0.55, paddingTop: 10}}>
            <Text style={styles.medText}>Token: <Text style={styles.token}>{this.state.token}</Text></Text>
            <Text style={styles.medText}>Service: {this.state.service}</Text>
          </View>
            <View style={{flex: 0.45}}>
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
        </View>
        <View style={{position: 'absolute', top: height*0.4}}>
          <Text>Would you like to review us while you wait:</Text>
          <Text> Cleanlines: </Text><StarRating
            disabled={false}
          emptyStar={'ios-star-outline'}
          fullStar={'ios-star'}
          halfStar={'ios-star-half'}
          iconSet={'Ionicons'}
          maxStars={5}
          rating={this.state.starCountClean}
          selectedStar={(rating) => this.onStarRatingPressClean(rating)}
          fullStarColor={'#ff9933'}
          />
          <Text> Ambience: </Text><StarRating
          disabled={false}
          emptyStar={'ios-star-outline'}
          fullStar={'ios-star'}
          halfStar={'ios-star-half'}
          iconSet={'Ionicons'}
          maxStars={5}
          rating={this.state.starCountAmb}
          selectedStar={(rating) => this.onStarRatingPressAmb(rating)}
          fullStarColor={'#ff9933'}
          />
          <Text> Service Quality: </Text><StarRating
          disabled={false}
          emptyStar={'ios-star-outline'}
          fullStar={'ios-star'}
          halfStar={'ios-star-half'}
          iconSet={'Ionicons'}
          maxStars={5}
          rating={this.state.starCountServ}
          selectedStar={(rating) => this.onStarRatingPressServ(rating)}
          fullStarColor={'#ff9933'}
          />
        </View>

          <TouchableOpacity
            activeOpacity = { .5 }
            style={[styles.roundButton, {alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom:10}]}
            onPress={this.cancelTicket}>
            <Ionicons name="md-close" size={30} color="#fff" />
            <Text style= {{color:'#fff'}}> Cancel my Ticket</Text>
          </TouchableOpacity>
      </View>


    </ImageBackground>
    );
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Other');
  };
  checkTurn = async() =>{
    var url = this.state.url;
    var token = await AsyncStorage.getItem('token');
    var dept = await AsyncStorage.getItem('dept');
    url = url +'/checkTurn';
    console.log(url);
    fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tokenId: token,
        dept: dept
      })
    }).then((res) => res.json())
    .then((res) => {
      if(res.counter != -1){
        Alert.alert("Thank you your response has been recorded.Please visit counter: "+ res.counter);
        AsyncStorage.clear();
        this.props.navigation.navigate('QRegister');
      }
      console.log(res);
    })
    .catch((error) => {
      Alert.alert("Please contact the help desk.")
      console.error(error);
    });

  }
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
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
    fontSize: 20,
  },
  medText: {
    backgroundColor: 'transparent',
    color: '#000',
    fontSize: 18,
  },
  roundButton: {
    width:width*0.6,
    borderRadius: 50,
    backgroundColor:'#00BCD4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  token: {
    backgroundColor: 'transparent',
    color: '#ff3300',
    fontSize: 28,
  }
});

export default  HomeScreen;
