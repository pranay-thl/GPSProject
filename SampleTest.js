

class RecommendationSystem {
  constructor(deviceId){
    this.deviceId = deviceId;
    this.coords = {
      latitude: null,
      longitude: null,
      timestamp: null,
      device: deviceId,
      error: null
    };
  }

  blipLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: position.timestamp,
        error: null
      }); },
      (error) => {this.setState({error: error.message}); },
      {enableHighAccuracy: false, timeout: 600000, maximumAge: 600000}
    );
    return {
      deviceId: this.coords.deviceId,
      latitude: this.coords.latitude,
      longitude: this.coords.longitude,
      timestamp: this.coords.timestamp,
    };
  }
}
