
import React, { Component } from 'react';
import { Text, View, AsyncStorage } from 'react-native';

export default class Geolocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceId: 1234,
      latitude: null,
      longitude: null,
      timestamp: null,
      error: null
    };

    this.dbkey = 1;
    this.setLocation = this.setLocation.bind(this);
    this.storeCoordinates = this.storeCoordinates.bind(this);

    this.ws = new WebSocket('ws://10.0.2.2:8000/');
  }

  async storeCoordinates() {
    try {
      await AsyncStorage.setItem(this.dbkey.toString(), JSON.stringify({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        timestamp: this.state.timestamp
      }));
      this.dbkey += 2;
    }
    catch(error) { this.setState({ error: 'error storing data' }); }
  }

  setLocation(pos, err) {
    if(pos) {
      this.setState({
        deviceId: 1234,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        timestamp: pos.timestamp,
        error: null
      });
    }
    else { this.setState({ error: err.message }); }

    if(this.props.conn === 'none') { this.storeCoordinates(); }
    else { this.ws.send(JSON.stringify({
        deviceId: 1234,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        timestamp: this.state.timestamp
      }));
    }
  }

  componentDidMount() {
    this.ws.onopen = () => this.ws.send(JSON.stringify({hello: 'servering'}));
    this.watchId = navigator.geolocation.watchPosition(
      (position) => { this.setLocation(position, null); },
      (error) => { this.setLocation(null, error); },
      {enableHighAccuracy: false, timeout: 60000, maximumAge: 30000, distanceFilter: 1}
    );
  }

  componentWillUnmount() { navigator.geolocation.clearWatch(this.watchId); }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text> Device: { this.state.deviceId } </Text>
        <Text> Latitude: { this.state.latitude } </Text>
        <Text> Longitude: { this.state.longitude } </Text>
        <Text> Timestamp: { this.state.timestamp } </Text>
        <Text> Error: { this.state.error } </Text>
      </View>
    );
  }
}
