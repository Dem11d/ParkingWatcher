import React from 'react';
import {
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import Template from "./Template";
import {googleAuth} from "../auth";
import {languageService} from "../lang/MessageProcessor";

export default class Exit extends React.Component {

  async handleSignOutGoogle() {
    await googleAuth.logout();
    this.props.navigation.navigate("Home");


  }


  render() {
    let content = (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => this.handleSignOutGoogle()}>
            <Text style={styles.textButtonStyle}>
              {languageService.getMessage("exit_buttonExit")}
            </Text>
          </TouchableOpacity>

        </View>
    )

    return (<Template {...this.props} title={languageService.getMessage("exit_title")} content={content}/>)
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
