import React from 'react';
import {
  StyleSheet,
  Image,
  AsyncStorage,
  ScrollView,
} from 'react-native';
import Template from "../Template";
import MapView from 'react-native-maps';
import {
  Button,
  Spinner,
  Text,
  View,
  H3, Content
} from "native-base";
import {dataSource} from "../../data/dataService";
import {apiService} from "../../api/ApiService";
import {locationService} from "../../location/LocationService";
import {Parking} from "./Parking";
import Modal from 'react-native-modal'
import parkingChecker from "../../location/ParkingChecker";
import {languageService} from "../../lang/MessageProcessor";
import {InfoPointer} from "./InfoPointer";
import {ParkingModal} from "./ParkingModal";
import {InfoPointerModal} from "./infoPointerModal";
let dataPoints = (require('ParkingWatcher/assets/testdata.json').docs.map(point => {
  point.geometry.coordinates[0] = 180 * Math.random() - 90;
  point.geometry.coordinates[1] = 360 * Math.random() - 180;
  return point;
}));

export default class Maps extends React.Component {
  constructor(props) {

    super(props);

    this.state = {
      data: [],

      points: [],
      latitudeDelta: 0.0000467769713,
      longitudeDelta: 0.0421,
      error: null,
      markerLoaded: false,
      imageLoaded: false,
      favourites: false,
      favText: "Add to favourites",
      isParkingModalVisible: false,
      parkingToShow: null,
      pointToShow: null,
      ready: false,

    };
  }

  async componentDidMount() {
    //getting favorites
    if (!dataSource.getState().favorites) {
      let favorites = await apiService.getJSON("get-parking.php", {uid: dataSource.getState().userId});
      dataSource.updateState({favorites: favorites});
    }

    let callbacks = [];
    callbacks.push(parkingChecker.addEventListener("newParking", () => this.setState({
      data: dataSource.getState().parking,
      ready: true
    })));
    callbacks.push(locationService.addEventListener("newPosition", () => this.setState({
      usersLongitude: dataSource.getState().currentPosition.longitude,
      usersLatitude: dataSource.getState().currentPosition.latitude,
    })));


    if (dataSource.getState().currentPosition) {
      this.setState({
        usersLongitude: dataSource.getState().currentPosition.longitude,
        usersLatitude: dataSource.getState().currentPosition.latitude,
        longitude: dataSource.getState().currentPosition.longitude,
        latitude: dataSource.getState().currentPosition.latitude,
      })
    } else {
      let clearInit = locationService.addEventListener("newPosition", () => {
        this.setState({
          longitude: dataSource.getState().currentPosition.longitude,
          latitude: dataSource.getState().currentPosition.latitude,
        });
        console.log("ready maps");
        clearInit();
        if (dataSource.getState().parking) {
          this.setState({
            ready: true,
            parking: dataSource.getState().parking,
            clearCallback: clearInit
          });
        }


      });
      callbacks.push(clearInit);
    }

    if (dataSource.getState().parking) {
      this.setState({ready: true, data: dataSource.getState().parking});
    }

    this.setState({callbacksToClear: callbacks});
  }


  onPressOnCalloutButton(value, markerText) {
    console.log("press");
    let markers = this.state.data;
    fav = this.state.favoritesParkings;
    // apiService.callUrl('delete-parking.php',{uid:dataSource.getState().userId,pid:value});
    if (markerText == "Delete from favourites") {
      fetch("https://api.parkingwatcher.com/" + dataSource.getState().version + "/delete-parking.php?uid=" + dataSource.getState().userId + "&pid=" + value)
          .then((response) => response.json())
          .then((responseData) => {
            this.setState({status: responseData.status});

            for (let x in markers) {
              for (let i in fav) {
                if (value == markers[x].id) {
                  console.log('', fav[i].name)
                  markers[x].favText = 'Add to favourites'; //new value
                  break;
                }
              }
            }
            this.setState(markers);
            this.setState({toggle: !this.state.toggle});

            console.log(this.state.favText);
          })
          .done();
    } else {
      console.log("ZZZZZZ");
      fetch("https://api.parkingwatcher.com/" + dataSource.getState().version + "/add-parking.php?uid=" + dataSource.getState().userId + "&pid=" + value)
          .then((response) => response.json())
          .then((responseData) => {
            this.setState({status: responseData.status});


            for (let x in markers) {
              for (let i in fav) {
                if (value == markers[x].id) {
                  console.log('', fav[i].name)
                  markers[x].favText = 'Delete from favourites'; //new value
                  break;
                }
              }
            }
            this.setState(markers);
            this.setState({toggle: !this.state.toggle})
            console.log(this.state.favText);
            console.log(this.state.status);
          })
          .done();
    }

  }

  _showParkingModal = () => this.setState({isParkingModalVisible: true});

  _showPointModal = () => this.setState({isPointModalVisible: true});

  _hideParkingModal = () => this.setState({isParkingModalVisible: false});

  _hidePointModal = () => this.setState({isPointModalVisible: false});


  _showPoint(item){
    console.log("showing point");
    this.setState({pointToShow: item});
    this._showPointModal();
  }
  _showParking = (item)=> {

    console.log("showing parking");
    this.setState({parkingToShow: item});
    this._showParkingModal();
  };
  _handleChangeRegion = (region)=>{
    // let longitudeDelta = region

    let minLatitude = region.latitude - region.latitudeDelta/2;
    let maxLatitude = region.latitude + region.latitudeDelta/2;
    let minLongitude = region.longitude - region.longitudeDelta/2;
    let maxLongitude = region.longitude + region.longitudeDelta/2;

    console.log(`minLatitude = ${minLatitude}`);
    console.log(`maxLatitude = ${maxLatitude}`);
    console.log(`minLongitude = ${minLongitude}`);
    console.log(`maxLongitude = ${maxLongitude}`);
    console.log(region);
    let points = dataPoints.filter(point=>{
      return (
          minLatitude < point.geometry.coordinates[0] && point.geometry.coordinates[0] < maxLatitude
          &&
          minLongitude < point.geometry.coordinates[1] && point.geometry.coordinates[1] < maxLongitude
      )
    });
    console.log("points length",points.length);
    this.setState({points, ...region})
  }

  render() {
    let content;
    if (this.state.ready) {
      content = (
          <View style={styles.container}>
            <ParkingModal
                parkingToShow={this.state.parkingToShow}
                isVisible={this.state.isParkingModalVisible}
                hideModal={this._hideParkingModal}
                onBackButtonPress={this._hideParkingModal}/>
            <InfoPointerModal
                pointToShow={this.state.pointToShow}
                isVisible={this.state.isPointModalVisible}
                hideModal={this._hidePointModal}
                onBackButtonPress={this._hidePointModal}/>

            <MapView style={styles.map}
                     showsScale={true}
                     showsPointsOfInterest={true}
                // showsUserLocation={true}
                     showsMyLocationButton={true}
                //followUserLocation
                     mapType={"standard"}
                     onRegionChangeComplete={this._handleChangeRegion}
                     region={{
                       latitude: parseFloat(this.state.latitude),
                       longitude: parseFloat(this.state.longitude),
                       latitudeDelta: parseFloat(this.state.latitudeDelta),
                       longitudeDelta: parseFloat(this.state.longitudeDelta),
                     }}>

              <MapView.Marker
                  image={require('ParkingWatcher/assets/location/marker.png')}
                  coordinate={{
                    latitude: this.state.usersLatitude,
                    longitude: this.state.usersLongitude,
                  }}
              />
              {this.state.data.map((marker, id) => {
                    return (
                        <MapView.Marker
                            onPress={() => this._showParking(marker)}
                            coordinate={{
                              latitude: parseFloat(marker.lat),
                              longitude: parseFloat(marker.lng),
                            }}
                            key={id}
                        >
                          {/*<Parking marker={marker} onPress={this.onPressOnCalloutButton}/>*/}
                        </MapView.Marker>
                    )
                  }
              )}

              {this.state.points.map((point, index) => {
                return (<InfoPointer onPress={() => this._showPoint(point)} key={index} pointData={point}/>)
              })}

            </MapView>
          </View>
      );
    }
    else
      content = (
          <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <Spinner color='blue'/>
          </View>);
    return (<Template title={languageService.getMessage("maps_title")} content={content} {...this.props}/>)
  }

  onRegionChange(region) {
    console.log("changed region");
    // this.console.log(...region);
    console.log(...region);
  }

  componentWillUnmount() {
    this.state.callbacksToClear.forEach(callback => callback());
  }


}


let styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    borderWidth: 1,
    padding: 25,
    borderColor: 'black'
  },
  buttonPress: {
    backgroundColor: 'white'
  },
  buttonFavourites: {
    backgroundColor: 'lightgreen',
    width: 240,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonStyle: {
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#F00',
    borderRadius: 5
  },
  textButtonStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  name: {
    textAlign: 'center',
  },
  address: {
    textAlign: 'center',
  }
});
