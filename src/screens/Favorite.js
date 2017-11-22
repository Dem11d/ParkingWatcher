import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {apiService} from "../api/ApiService";
import {dataSource} from "../data/dataService";
import Template from "./Template";


export default class Favorites extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {



    //!!!!
    // AsyncStorage.getItem("userId").then((value) => {
    //   if (value === null) {
    //     console.warn("Have no login users");
    //   }
    //   else {
    //     this.setState({userId: value});
    //     console.warn("https://api.parkingwatcher.com/" + this.state.version + "/get-parking.php?uid=" + this.state.userId);
    //     fetch("https://api.parkingwatcher.com/" + this.state.version + "/get-parking.php?uid=" + this.state.userId)
    //         .then((response) => response.json())
    //         .then((responseData) => {
    //           this.setState({favouritesParkings: responseData})
    //           console.log(this.state.favoritesParkings);
    //         }).done();
    //   }
    // }).done();

  }

  async componentWillReceiveProps() {

    console.log("trying to get parkings");
    let parkings = apiService.getJSON("get-parking.php",{uid:dataSource.getState().userId});
    console.log(parkings);
  }

  render() {

    let content =  (
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
    return (<Template title={"Favorites"} content={content}/>);
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