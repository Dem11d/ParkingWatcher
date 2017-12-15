import React from 'react';
import {
  StyleSheet,
  Image,
} from 'react-native';
import MapView from 'react-native-maps';
import {
  View,
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
  H3
} from 'native-base';
import {dataSource} from "../../data/dataService";
import {apiService} from "../../api/ApiService";
import {languageService} from "../../lang/MessageProcessor";


export class InfoPointer extends React.Component {

  render() {
    // console.log(this.props.pointData);
    if (this.props.pointData)
      return (
          <MapView.Marker
              onPress={this.props.onPress}
              coordinate={{
                latitude: this.props.pointData.geometry.coordinates[0],
                longitude: this.props.pointData.geometry.coordinates[1],
              }}
          />);
    else return null;
  }
}


