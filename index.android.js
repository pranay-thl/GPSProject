/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import Geolocation from './Geolocation';
import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { View,
         Text,
         Button,
         NetInfo,
         TextInput,
         StyleSheet,
         AppRegistry,
         AsyncStorage } from 'react-native';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { connectionState: 'offline', storedData : '' };
    
    this.getStoredData = this.getStoredData.bind(this);
    this.changeConnectionStatus = this.changeConnectionStatus.bind(this);
  }
  static navigationOptions = {
    title: 'Profile'
  };

  async getStoredData() {
    try {
      const storedCoords = await AsyncStorage.getItem('1');
      if(storedCoords !== null) {
        this.setState({ storedData: storedCoords });
      }
    }
    catch(error) { this.setState({ storedData: 'error'}); }
  }

  changeConnectionStatus(connectionInfo) {
    if(connectionInfo.type !== 'none') { this.getStoredData(); }

    this.setState({ connectionState: connectionInfo.type });
  }

  componentWillMount() {
    NetInfo.getConnectionInfo().then((connectionInfo) => {
      this.setState({ connectionState: connectionInfo.type });
    });
    NetInfo.addEventListener('connectionChange', this.changeConnectionStatus);
  }

  componentWillUnmount() { NetInfo.removeEventListener('connectionChange', this.changeConnectionStatus); }

  render() {
    return (
      <View style={styles.container}>
        <Geolocation conn={ this.state.connectionState } />
        <Text> StoredCoords: { (this.state.storedData === '') ? '' : this.state.storedData } </Text>
        <Text> Connection Status: { this.state.connectionState } </Text>
      </View>
    );
  }
}

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { loginId : null};

    this.storeLogin = this.storeLogin.bind(this);
    this.retrieveLogin = this.retrieveLogin.bind(this);
  }

  async storeLogin() {
    try { await AsyncStorage.setItem('1', this.state.loginId); }
    catch(error) { /* error storing the loginId */ }
  }

  async retrieveLogin() {
    try {
      const loginId = await AsyncStorage.getItem('1');
      if(loginId === null) return false;
      else return true;
    }
    catch(error) { /* error retrieving loginId*/ }
  }

  componentWillMount() {
    const { navigate } = this.props.navigation;
    if(this.retrieveLogin) navigate('Profile');
  }

  render() {

    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <Text style={{color:'blue', fontSize: 30}}> Login </Text>
        <TextInput style={{height: 40, width: 100}} onChangeText={(login) => this.state.loginId=login} />
        <Button style={{height: 40, width: 30}} title="Submit" onPress={() => {
          this.storeLogin();
          navigate('Profile');
        }} />
      </View>
    );
  }
}

export default AppScreens = StackNavigator({
  Login: { screen: LoginScreen },
  Profile: { screen: ProfileScreen }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

AppRegistry.registerComponent('GPSProject', () => AppScreens);
