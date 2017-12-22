import React from 'react';
import {
  Animated, Easing,
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
import {Svg} from "expo";
import {PointInfo} from "./PointInfo";


const aqi = [
  [0, 50],
  [51, 100],
  [101, 200],
  [201, 300],
  [301, 400],
  [401, 500],
];
const no2 = [
  [0, 40],
  [41, 80],
  [81, 180],
  [181, 280],
  [281, 400],
  [401, 500],
];
const pm10 = [
  [0, 50],
  [51, 100],
  [101, 250],
  [251, 350],
  [351, 430],
  [431, 500],
];

let maxValue;

const checkConcectration = (arr, value) => {
  for (let i = 0; i < arr.length; i++) {
    if (value > arr[i][0] && value < arr[i][1])
      return aqi[i][0] + (arr[i][1] - arr[i][0]) / (aqi[i][1] - aqi[i][0]) * arr[i][1] - value;
  }
}


export class InfoPointer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      symbolWidth: new Animated.Value(30),
      color: this.getColor(),
      maxValue: maxValue,
    }
    // console.log(this.state.symbolWidth);
  }


  handleClick() {
    console.log("handle click");
    Animated.timing(this.state.symbolWidth, {
      toValue: 500,
      duration: 2000,
      delay: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true
    }).start();
    // this.setState({symbolWidth : 100});
  }

  getColor() {
    if (this.props.pointData.properties) {
      const prop = this.props.pointData.properties;
      const no2Contentration = checkConcectration(no2, prop.no2);
      const pm10Concentration = checkConcectration(pm10, prop.pm10);

      const max = Math.max(no2Contentration, pm10Concentration);
      maxValue = Math.floor(max);
      if (max > aqi[5][0]) {
        return "#A52A2A";
      } else if (max > aqi[4][0]) {
        return "#FF0000";
      } else if (max > aqi[3][0]) {
        return "#FF9A00";
      } else if (max > aqi[2][0]) {
        return "#608E03";
      } else if (max > aqi[1][0]) {
        return "#BBCF4C";
      } else {
        return "#79BC6A";
      }
    }


  }

  render() {
    function random(max) {
      return Math.round(Math.random() * max);
    }

    const color = this.state.color;

    const markerWidth = 50;
    // console.log(this.props.pointData);
    if (this.props.pointData)
      return ([
        <MapView.Circle
            key={0}
            onPress={this.props.onPress}
            radius={20000}
            center={{
              latitude: this.props.pointData.geometry.coordinates[0],
              longitude: this.props.pointData.geometry.coordinates[1],
            }}
            strokeColor={"rgba(0,0,0,1)"}
            fillColor={"rgba(200,0,0,0.3)"}
        />
        ,
        <MapView.Marker
            key={1}
            // image = {require('ParkingWatcher/assets/location/info-marker.png')} style={{width:25}}
            onPress={() => this.handleClick()}
            // onPress={this.props.onPress}
            coordinate={{
              latitude: this.props.pointData.geometry.coordinates[0],
              longitude: this.props.pointData.geometry.coordinates[1],
            }}
        >
          <View>
            <Image source={require('ParkingWatcher/assets/location/info-marker.png')} style={styles.infoPoint_image}/>
            <View style={styles.infoPoint_view}/>
          </View>
          <MapView.Callout>
            <PointInfo point={this.props.pointData}/>
          </MapView.Callout>
        </MapView.Marker>
      ]);
    else return null;
  }
}

const styles = StyleSheet.create({
  infoPoint_image:{
    width: 50,
    height: 50
  },
  infoPoint_view: {
    position: "absolute",
    marginTop:5,
    marginLeft:5,
    marginBottom:20,
    marginRight:5,
    flex:1,
    // width: 15,
    // height: 15,
    borderRadius: 5,
    backgroundColor: "#51ff4c",
    overflow: "hidden"
  }
})



