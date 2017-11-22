import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import {List, ListItem, SearchBar} from "react-native-elements"; /// dependency
import Swiper from 'react-native-swiper';

var Item = require('../languages/dictionary.json');
import Router from './router';

// import ImageViewer from 'react-native-image-zoom-viewer';


export default class Favorites extends React.Component {
  static route = {

    navigationBar: {
      title: function (params) {
        if (typeof params.language === 'undefined') {
          return '';
        }
        return Item[params.language].favourites;
      }


    }
  }

  constructor(props) {
    super(props);

    this.state = {
      data: [{
        id: "",
        name: "",
        address: "",
        lat: "",
        lng: ""
      }],
      favouritesParkings: [{
        id: "",
        name: "",
        address: ""
      }],
      language: 0,
      version: null,
      userId: ""
    };


  }

  componentDidMount() {

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

    //!!!!
    AsyncStorage.getItem("userId").then((value) => {
      if (value === null) {
        console.warn("Have no login users");
      }
      else {
        this.setState({userId: value});
        console.warn("https://api.parkingwatcher.com/" + this.state.version + "/get-parking.php?uid=" + this.state.userId);
        fetch("https://api.parkingwatcher.com/" + this.state.version + "/get-parking.php?uid=" + this.state.userId)
            .then((response) => response.json())
            .then((responseData) => {
              this.setState({favouritesParkings: responseData})
              console.log(this.state.favoritesParkings);
            }).done();
      }
    }).done();

  }

  componentWillReceiveProps() {

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
        this.props.navigator.replace(Router.getRoute('favourites'));
      }
      else {
        this.setState({userId: value});
        console.warn("https://api.parkingwatcher.com/" + this.state.version + "/get-parking.php?uid=" + this.state.userId);
        fetch("https://api.parkingwatcher.com/" + this.state.version + "/get-parking.php?uid=" + this.state.userId)
            .then((response) => response.json())
            .then((responseData) => {

              if (responseData.list === "empty") {
                this.setState({favouritesParkings: 0})
              } else {
                this.setState({favouritesParkings: responseData})
              }
            })
            .done();
      }

    }).done();

    if (this.state.favoritesParkings) {
      console.warn(this.state.favoritesParkings)
    } else this.setState({favouritesParkings: 0})
  }


  renderSeparator = () => {
    return (
        <View
            style={{
              height: 1,
              width: '86%',
              backgroundColor: "#CED0CE",
              marginLeft: "14%",
            }}
        />
    )
  };

  renderHeader = () => {
    return <SearchBar placeholder="Type here..." lightTheme round
    />
  };

  renderFooter = () => {
    if (!this.state.loading) return null;
    return (
        <View
            style={{
              paddingVertical: 20,
              borderTopWidth: 1,
              borderTopColor: "#CED0CE"
            }}
        >
          <ActivityIndicator animating size="large"/>

        </View>
    )
  };

  getCurrentUser() {
    AsyncStorage.getItem("userId").then((value) => {
      this.setState({userId: value})
      this.props.navigator.updateCurrentRouteParams({userId: value});
    }).done();

    return this.state.userId;
  };

  changeOrientation() {
    console.warn("SSSSSS");
  };

  encodeUtf(text) {
    return text.replace(/%/g, "\\");
  }

  render() {


    var swipeoutBtns = [
      {

        text: 'Delete',
        backgroundColor: 'red',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => {
          this.deleteNote(rowData)
        }
      }
    ]

    return (


        <Swiper style={styles.wrapper}
                showsButtons={false}
                showsPagination={false}
                loop={false}
                horizontal={true}
        >

          {this.state.favoritesParkings.map(item => {
            console.log(item);
            return (
                <View style={{flex: 1, justifyContent: 'flex-start'}}>
                  <Image
                      resizeMode="contain"
                      source={{uri: 'https://data.parkingwatcher.com/parkings/' + item.id + '.jpg'}}
                      style={styles.canvas}
                      // minimumZoomScale={0.5}
                      // maximumZoomScale={3}
                  >

                  </Image>
                  <View style={
                    {
                      flex: 1,
                      position: 'absolute',
                      justifyContent: "flex-end",
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      backgroundColor: 'rgba(128,128,128,0.7)'
                    }}>
                    <View style={
                      {
                        paddingBottom: 30,
                      }}>
                      <Text style={styles.name}>{this.encodeUtf(item.name)}</Text>
                      <Text style={styles.address}>{this.encodeUtf(item.address)}</Text>
                    </View>
                  </View>
                </View>
            )
          })}

        </Swiper>
    );
  }
}

var styles = StyleSheet.create({
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  name: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  address: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  canvas: {
    flex: 1,
    justifyContent: 'center'
  }
})