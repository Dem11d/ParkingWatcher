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


export default class Maps extends React.Component {
  constructor(props) {

    super(props);

    this.state = {
      data: [{
        id: "",
        name: "",
        address: "",
        lat: "",
        lng: "",
        favText: "Add To Favorites"
      }],

      latitudeDelta: 0.0000467769713,
      longitudeDelta: 0.0421,
      error: null,
      markerLoaded: false,
      imageLoaded: false,
      favourites: false,
      favText: "Add to favourites",
      isModalVisible: false,
      parkingToShow: null,
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
    callbacks.push(locationService.addEventListener("newPosition", () => this.setState({data: dataSource.getState().parkings})));


    if (dataSource.getState().currentPosition) {
      this.setState({
        usersLongitude: dataSource.getState().currentPosition.longitude,
        usersLatitude: dataSource.getState().currentPosition.latitude,
        longitude: dataSource.getState().currentPosition.longitude,
        latitude: dataSource.getState().currentPosition.latitude,
        data: dataSource.getState().parkings,
        ready: true,
      })
    } else {
      let clearInit = locationService.addEventListener("newPosition", () => {
        this.setState({
          usersLongitude: dataSource.getState().currentPosition.longitude,
          usersLatitude: dataSource.getState().currentPosition.latitude,
          longitude: dataSource.getState().currentPosition.longitude,
          latitude: dataSource.getState().currentPosition.latitude,
        });
        console.log("ready maps");
        clearInit();
        this.setState({
          ready: true,
          clearCallback: clearInit
        });
      });
      callbacks.push(clearInit);
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

  _showModal = () => this.setState({isModalVisible: true});

  _hideModal = () => this.setState({isModalVisible: false});

  _showParking(item) {

    console.log("showing parking");
    this.setState({parkingToShow: item});
    this._showModal();
  }

  render() {
    let content;
    if (this.state.ready) {
      content = (
          <View style={styles.container}>
            <Modal isVisible={this.state.isModalVisible}
                   onBackButtonPress={this._hideModal}
            >
                <View  style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={()=>console.log("pressed")}
                >
                  <View style={{
                    width: 300,
                    backgroundColor: "white",
                    borderRadius: 7,
                    padding: 15}}>
                    <ScrollView>

                      <Parking marker={this.state.parkingToShow}/>

                      <Button
                          block warning
                          style={{marginTop: 7}}
                          onPress={this._hideModal}>
                        <Text>
                          Close
                        </Text>
                      </Button>
                    </ScrollView>
                  </View>
                </View>


            </Modal>

            <MapView style={styles.map}
                     showsScale={true}
                     showsPointsOfInterest={true}
                // showsUserLocation={true}
                     showsMyLocationButton={true}
                //followUserLocation
                     mapType={"standard"}
                     onRegionChangeComplete={(region) => this.setState(region)}
                     region={{
                       latitude: parseFloat(this.state.latitude),
                       longitude: parseFloat(this.state.longitude),
                       latitudeDelta: parseFloat(this.state.latitudeDelta),
                       longitudeDelta: parseFloat(this.state.longitudeDelta),
                     }}>

              <MapView.Marker
                  image={require('../../../assets/location/marker.png')}
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
            </MapView>
          </View>
      );
    }
    else
      content = (
          <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <Spinner color='blue'/>
          </View>);
    return (<Template title={"Maps"} content={content} {...this.props}/>)
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
