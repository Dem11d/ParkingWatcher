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


export class Parking extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imageLoaded: false,
      buttonType: "add"
    }
  }

  _getParkingButton(marker,buttonType) {
    console.log("getting parking button");
    let favorites = dataSource.getState().favorites;
    favorites = favorites.list?[]:favorites;
    let favoriteIds = favorites.map(fav => fav.id);
    if (favoriteIds.includes(marker.id)) {
      return (<Button
          block danger
          onPress={() => this.addOrDeleteFavorite(marker.id, "delete")}
      ><Text>{languageService.getMessage("maps_modal_deleteFromFavorites")}</Text></Button>)
    }
    else {
      console.log(favorites);
      console.log(marker);
      return (<Button
          block success
          onPress={() => this.addOrDeleteFavorite(marker.id, "add")}

      ><Text>{languageService.getMessage("maps_modal_addToFavorites")}</Text></Button>)
    }
  }

  async addOrDeleteFavorite(value, type) {
    // apiService.callUrl('delete-parking.php',{uid:dataSource.getState().userId,pid:value});
    if (type === "delete") {
      console.log("delete");
      let result = await apiService.getJSON("delete-parking.php", {uid: dataSource.getState().userId, pid: value});
      console.log(result);

    } else {
      console.log("add");
      let result = await apiService.getJSON("add-parking.php", {uid: dataSource.getState().userId, pid: value});
      console.log(result);

    }
    dataSource.updateState({favorites: await apiService.getJSON("get-parking.php", {uid: dataSource.getState().userId})})
    this.setState({buttonType:type==="add"?"delete":"add"})
  }

  render() {
    let imageFolder = dataSource.getState().settings.ImageFolder;
    if (this.props.marker)
      return (
          <View>
            <Text>{this.props.marker.name}</Text>
            <Image
                style={{height: 200, width: 300}}
                resizeMode="contain"
                source={{uri: imageFolder + this.props.marker.id + ".jpg"}}
            />
            <H3>{this.props.marker.address}</H3>
            {this._getParkingButton(this.props.marker,this.state.buttonType)}
          </View>
      )
    else return null;
  }

  renderOld() {

    return (
        <MapView.Callout
            onPress={() => this.props.onPress(this.props.marker.id, this.props.marker.favText)}
        >
          <View>
            <Image source={{uri: dataSource.getState().settings.ImageFolder + this.props.marker.id + ".jpg"}}
                   style={{height: 170, width: 280}}
                   alignContent='space-between'/>
            <Text style={styles.name}>{this.props.marker.name}</Text>
            <Text style={styles.address}>{this.props.marker.address}</Text>
          </View>
          <View style={{
            width: 280,
            alignItems: 'center',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}>
            <Button
                style={[styles.buttonFavourites]}>

              <Text style={styles.textButtonStyle}>{this.props.marker.favText}</Text>

            </Button>
          </View>
        </MapView.Callout>
    )
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
