/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class Geolocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude : null,
      longitude : null,
      error : null
    };
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude : position.coords.latitude,
          longitude : position.coords.longitude,
          error : null
        })
      },
      (error) => this.setState({error : error.message}),
      {enableHighAccuracy : true, timeout : 20000, maximumAge : 1000, distanceFilter : 7}
    );
  }

  componentWillUnmount() { navigator.geolocation.clearWatch(this.watchId); }

  render() {
    return (
      <View style={{ flexgrow : 1, alignItems : 'center', justifyContent : 'center'}}>
        <Text> Latitude : {this.state.latitude} </Text>
        <Text> Longitude : {this.state.longitude} </Text>
        {this.state.error ? <Text> Error : {this.state.error} </Text> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('GPSProject', () => Geolocation);
