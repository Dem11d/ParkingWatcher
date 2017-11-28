import React from 'react';
import {
  StyleSheet,
  Image,
} from 'react-native';
import Template from "./Template";
import Swiper from 'react-native-swiper';
import {apiService} from "../api/ApiService";
import {dataSource} from "../data/dataService";
import {Text, View, Button, Content, Spinner} from "native-base";
import {languageService} from "../lang/MessageProcessor";

export default class Favorites extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
      ready: false
    }
  }

  async componentWillMount() {
    let parkings;
    console.log("trying to get favorites");
    if (dataSource.getState().favorites)
      parkings = dataSource.getState().favorites;
    else
      parkings = await apiService.getJSON("get-parking.php", {uid: dataSource.getState().userId});
    console.log(parkings);
    this.setState({
      ready: true,
      favorites: parkings
    });
  }

  async handleDelete(parking) {
    console.log("delete");
    let result = await apiService.getJSON("delete-parking.php", {uid: dataSource.getState().userId, pid: parking.id});
    console.log(result);

    let newFavorites = await apiService.getJSON("get-parking.php", {uid: dataSource.getState().userId});
    dataSource.updateState({favorites: newFavorites});
    this.setState({favorites: newFavorites});
  }

  render() {
    let spinner = (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Spinner color='blue'/>
        </View>
    );
    let emptyContent = (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Text style={{textAlign:"center"}}>
            {languageService.getMessage("favorites_empty")}
          </Text>
        </View>
    );
    let swiper;
    console.log(this.state.favorites);
    if(this.state.favorites.length > 0) {
      swiper = (
          <Swiper
              showsButtons={false}
              showsPagination={false}
              loop={false}
              horizontal={true}
          >
            {this.state.favorites.map((item, id) => {
              console.log(item);
              return (
                  <View key={id} style={{flex: 1, justifyContent: 'flex-start'}}>
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
                          justifyContent: "center",
                          alignItems: "center",
                          paddingBottom: 30,
                        }}>

                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.address}>{item.address}</Text>
                        <Content>
                          <Button danger rounded
                                  onPress={() => this.handleDelete(item)}
                          >
                            <Text style={[styles.name, {padding: 6}]}>
                              {languageService.getMessage("favorites_deleteParking")}
                            </Text>
                          </Button>
                        </Content>

                      </View>
                    </View>
                  </View>
              )
            })}

          </Swiper>
      );
    }
    let readyContent = swiper? swiper : emptyContent;

    let content = this.state.ready ? readyContent : spinner;
    return (
        <Template {...this.props} title= {languageService.getMessage("favorites_title")} content={content}/>
    )
  }
}

var styles = StyleSheet.create({
  separator: {
    flex: 1,
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