import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  AsyncStorage,
} from 'react-native';
import {MapView} from 'react-native-maps';
import {Button} from "native-base";
import Template from "../src/screens/Template";

// var Item = require('../languages/dictionary.json');


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

      settings: [{
        ImageFolder: "",
        TimeToUpdate: ""
      }],

      language: 0,
      latitude: null,
      longitude: null,
      latitudeDelta: 0.0000467769713,
      longitudeDelta: 0.0421,
      error: null,
      status: "",
      markerLoaded: false,
      imageLoaded: false,
      favourites: false,
      favText: "Add to favourites",

    };
  }

  componentDidMount() {

    AsyncStorage.getItem("version").then((value) => {
      this.setState({"version": value})

    }).done();

    AsyncStorage.getItem("radius").then((value) => {
      this.setState({"radius": value})
    }).done();


    AsyncStorage.getItem("language").then((value) => {
      this.setState({language: value})
      this.props.navigator.updateCurrentRouteParams({language: value});
    }).done();

    AsyncStorage.getItem("userId").then((value) => {
      this.setState({userId: value})
    }).done();


    AsyncStorage.getItem("userId").then((value) => {
      if (value === null) {

        console.warn("Have no login users");

      }
      else {
        this.setState({userId: value});
        console.warn("https://api.parkingwatcher.com/" + this.state.version + "/get-parking.php?uid=" + this.state.userId);

      }

    }).done();

    navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0000467769713,
            longitudeDelta: 0.0421,
            error: null,
          });

          fetch("https://api.parkingwatcher.com/" + this.state.version + "/settings.php")
              .then((response) => response.json())
              .then((responseData) => {
                this.setState({settings: responseData});
                this.setState({imageLoaded: true});
                console.warn(this.state.settings);
              })
              .done();
          Promise.all([
            fetch("https://api.parkingwatcher.com/" + this.state.version + "/get-parking.php?uid=" + this.state.userId),
            fetch("https://api.parkingwatcher.com/" + this.state.version + "/parkings.php?lat=" + this.state.latitude + "&lng=" + this.state.longitude + "&radius=" + this.state.radius)
          ]).then((results) => {
            // Results will hold an array with the results of each promise.

            if (results[0].status === 200) {
              let fav = JSON.parse(results[0]._bodyInit);

              if (fav.length <= 0) {
                this.setState({favoritesParkings: 0})
              } else {
                this.setState({favoritesParkings: fav})
                this.setState({favourites: true})
              }
            }

            if (results[1].status === 200) {
              let tmp_markers = JSON.parse(results[1]._bodyInit);
              this.setState({data: tmp_markers});
              this.setState({markerLoaded: true});
              this.setState({imageLoaded: true});

              let markers = this.state.data,
                  favs = this.state.favoritesParkings;

              for (let x in markers) {
                for (let i in favs) {
                  if (favs[i].id == markers[x].id) {

                    markers[x].favText = 'Delete from favourites'; //new value

                  } else {
                    markers[x].favText = 'Add to favourites';
                  }

                }
              }
              this.setState(markers);
            }

          }).catch((err) => {
            // Promise.all implements a fail-fast mechanism. If a request fails, the catch method will be called immediately
            //console.warn("sss!!!", err);
          });

        },
        (error) => this.setState({error: error.message}),
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
    );
  }

  componentWillReceiveProps() {

    AsyncStorage.getItem("radius").then((value) => {
      this.setState({"radius": value})

    }).done();

    AsyncStorage.getItem("language").then((value) => {
      this.setState({language: value})
      this.forceUpdate(function () {
        AsyncStorage.getItem("language").then((value) => {

          this.setState({language: value})

        }).done();
      });

      this.props.navigator.updateCurrentRouteParams({language: value});

    }).done();

    AsyncStorage.getItem("version").then((value) => {
      this.setState({version: value})
      this.forceUpdate(function () {
        AsyncStorage.getItem("version").then((value) => {

          this.setState({version: value})
        }).done();
      });
    }).done();

    AsyncStorage.getItem("userId").then((value) => {
      if (value === null) {

        console.warn("Have no login users");
        this.props.navigator.replace(Router.getRoute('home'));
      }
      else {

        this.setState({userId: value});
        console.warn("https://api.parkingwatcher.com/" + this.state.version + "/get-parking.php?uid=" + this.state.userId);
        fetch("https://api.parkingwatcher.com/" + this.state.version + "/get-parking.php?uid=" + this.state.userId)
            .then((response) => response.json())
            .then((responseData) => {

              if (responseData.list === "empty") {
                this.setState({favoritesParkings: 0})
              } else {
                this.setState({favoritesParkings: responseData})
                this.setState({favourites: true})


              }
            })
            .done();
      }

    }).done();

    navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0000467769713,
            longitudeDelta: 0.0421,
            error: null,
          });

          fetch("https://api.parkingwatcher.com/" + this.state.version + "/parkings.php?lat=" + this.state.latitude + "&lng=" + this.state.longitude + "&radius=" + this.state.radius)
              .then((response) => response.json())
              .then((responseData) => {
                this.setState({data: responseData});
                this.setState({markerLoaded: true});

                let markers = this.state.data,
                    fav = this.state.favoritesParkings;

                console.warn('', fav, markers, responseData);

                for (let x in markers) {
                  for (let i in fav) {
                    if (fav[i].id == markers[x].id) {
                      console.warn('', fav[i].name)
                      markers[x].favText = 'Delete from favourites'; //new value
                      break;
                    } else {
                      markers[x].favText = 'Add to favourites';
                    }

                  }
                }
                this.setState(markers);

              })
              .done();

          fetch("https://api.parkingwatcher.com/" + this.state.version + "/settings.php")
              .then((response) => response.json())
              .then((responseData) => {
                this.setState({settings: responseData});
                this.setState({imageLoaded: true});
                console.warn(this.state.settings);
              })
              .done();

        },
        (error) => this.setState({error: error.message}),
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
    );

  }

  onPressOnCalloutButton(value, markerText) {

    let markers = this.state.data;
    fav = this.state.favoritesParkings;


    console.log(markerText);
    console.log(value);
    if (markerText == "Delete from favourites") {
      console.warn("ppppp");
      fetch("https://api.parkingwatcher.com/" + this.state.version + "/delete-parking.php?uid=" + this.state.userId + "&pid=" + value)
          .then((response) => response.json())
          .then((responseData) => {
            this.setState({status: responseData.status});

            for (let x in markers) {
              for (let i in fav) {
                if (value == markers[x].id) {
                  console.warn('', fav[i].name)
                  markers[x].favText = 'Add to favourites'; //new value
                  break;
                }
              }
            }
            this.setState(markers);
            this.setState({toggle: !this.state.toggle});

            console.warn(this.state.favText);
            console.warn(this.state.status);
          })
          .done();
    } else {
      console.warn("ZZZZZZ");
      fetch("https://api.parkingwatcher.com/" + this.state.version + "/add-parking.php?uid=" + this.state.userId + "&pid=" + value)
          .then((response) => response.json())
          .then((responseData) => {
            this.setState({status: responseData.status});


            for (let x in markers) {
              for (let i in fav) {
                if (value == markers[x].id) {
                  console.warn('', fav[i].name)
                  markers[x].favText = 'Delete from favourites'; //new value
                  break;
                }
              }
            }
            this.setState(markers);
            this.setState({toggle: !this.state.toggle})
            console.warn(this.state.favText);
            console.warn(this.state.status);
          })
          .done();
    }

  }

  onPressAddFavourites(value) {

    fetch("https://api.parkingwatcher.com/" + this.state.version + "/add-parking.php?uid=" + this.state.userId + "&pid=" + value)
        .then((response) => response.json())
        .then((responseData) => {
          this.setState({status: responseData.status});

          console.warn(this.state.status);
        })
        .done();
  }

  onPressDeleteFavourites(value) {

    fetch("https://api.parkingwatcher.com/" + this.state.version + "/delete-parking.php?uid=" + this.state.userId + "&pid=" + value)
        .then((response) => response.json())
        .then((responseData) => {
          this.setState({status: responseData.status});
          console.warn(this.state.status);
        })
        .done();
  }

  getInitialState() {
    return {toggle: false};
  }

  render() {
    let content;
    if (this.state.markerLoaded && this.state.imageLoaded) {
      content = (
          <View style={styles.container}>
            <MapView style={styles.map}
                     showsScale
                     showsPointsOfInterest
                     showsUserLocation
                     followUserLocation
                     mapType={"standard"}
                     region={{
                       latitude: parseFloat(this.state.latitude),
                       longitude: parseFloat(this.state.longitude),
                       latitudeDelta: parseFloat(this.state.latitudeDelta),
                       longitudeDelta: parseFloat(this.state.longitudeDelta),
                     }}>

              {this.state.data.map(marker => {
                    return (
                        <MapView.Marker coordinate={{
                          latitude: parseFloat(marker.lat),
                          longitude: parseFloat(marker.lng),
                        }}>
                          <MapView.Callout
                              onPress={(value) => this.onPressOnCalloutButton(marker.id, marker.favText)}>
                            <View>
                              <Image source={{uri: this.state.settings.ImageFolder + marker.id + ".jpg"}}
                                     style={{height: 200, width: 330}}
                                     alignContent='space-between'/>
                              <Text style={styles.name}>{marker.name}</Text>
                              <Text style={styles.address}>{marker.address}</Text>
                            </View>
                            <View style={{
                              width: 330,
                              alignItems: 'center',
                              flex: 1,
                              flexDirection: 'row',
                              justifyContent: 'flex-end'
                            }}>
                              <Button
                                  style={[styles.buttonFavourites, this.state.toggle && styles.buttonPress]}>
                                <View style={{textAlign: 'center', alignItems: 'center'}}>
                                  <Text style={styles.textButtonStyle}>{marker.favText}</Text>
                                </View>
                              </Button>
                            </View>
                          </MapView.Callout>
                        </MapView.Marker>
                    )
                  }
              )}
            </MapView>
          </View>
      );
    } else {
      content = (
          <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <Text>Не забувайте вмикати GPS</Text>
          </View>
      );
    }
    return(<Template title={"Maps"} {...props} content={content}/>)

  }
}

var styles = StyleSheet.create({

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
