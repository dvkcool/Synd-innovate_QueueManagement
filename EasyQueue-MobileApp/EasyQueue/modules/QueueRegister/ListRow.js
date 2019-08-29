
/*import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity } from 'react-native';

const ROW_HEIGHT = 70;

class ListRow extends Component {


  render() {
    const item = this.props.name;
    const delay = this.props.index * 10;
    const rowStyles = [
      styles.row,
    ];

    return (
      <TouchableOpacity onPress={this.onRemove}>
        <Animated.View style={rowStyles}>
          <View>
            <Text style={styles.name}>{item}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    height: ROW_HEIGHT,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
  },
});
*/
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');
class FadeInView extends React.Component {
  state = {
    fadeAnim: new Animated.Value(width),  // Initial value for opacity: 0
  }

  componentDidMount() {
    const delay = (this.props.index) * 1000;
    Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 0,                   // Animate to opacity: 1 (opaque)
        duration: 100,
        delay: delay              // Make it take a while
      }
    ).start();                        // Starts the animation
  }

  render() {

    let { fadeAnim } = this.state;

    return (
      <Animated.View                 // Special animatable View
        style={{
          ...this.props.style,
          marginLeft: fadeAnim,         // Bind opacity to animated value
        }}
      >
      {this.props.children}
      </Animated.View>
    );
  }
}
export default FadeInView;
