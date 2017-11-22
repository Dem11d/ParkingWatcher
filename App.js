import React from 'react';
import MainContent from './src/routes/Router';
import parkingChecker from "./src/location/ParkingChecker";
import {locationService} from "./src/location/LocationService";
import {dataSource} from "./src/data/dataService";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }

  // loading fonts
  async componentWillMount() {


    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf'),
    });

    await dataSource.initStorage();
    await parkingChecker.init();
    await locationService.init();
    locationService.startWatch();

    this.setState({isReady: true});
  }


  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading/>;
    }
    return <MainContent/>;
  }
}

