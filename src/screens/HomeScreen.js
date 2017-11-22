import React from 'react';
import {
  Text,
  View,
  AsyncStorage,
  StyleSheet,
} from 'react-native';
import {Button, Content, Spinner} from "native-base";
import Template from "./Template";
import Maps from "./Maps/Maps";
import {dataSource} from "../data/dataService";
import {apiService} from "../api/ApiService";
import {googleAuth} from "../auth";


export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      version: null,
      userId: dataSource.getState().userId,
      ready: false
    };
  }

  static navigationOptions = {
    title: 'Authorization',
  };


  async componentDidMount() {

    this.setState({ready: true});
  }

  handleSigninGoogle() {
    googleAuth.login().catch(err => console.log(err));
  }

  render() {
    let notAuthContent = (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Button
              full
              rounded
              primary
              onPress={() => this.handleSigninGoogle()}>
            <Text style={styles.textButtonStyle}>
              Sign in with Google +
            </Text>
          </Button>
          <Text>  {this.state.userId} </Text>
        </View>
    );

    let spinner = (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Spinner color='blue'/>
        </View>
    );

    if (this.state.ready) {
      if (this.state.userId) {
        return (<Maps {...this.props} />);
      } else {
        return notAuthContent;
      }
    } else
      return spinner;
  }
}

var styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
