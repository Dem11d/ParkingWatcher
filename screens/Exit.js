import React from 'react';
  import {
    Text,
    View,
    AsyncStorage,
    TouchableOpacity,
    StyleSheet,
    Alert
  } from 'react-native';

export default class Exit extends React.Component {



handleSignOutGoogle(){
    AsyncStorage.removeItem("userId");
    Alert.alert(
  'Signed out from Google account',
  '',
  [
    {text: 'OK', onPress: () => console.log('OK Pressed')},
  ],
  { cancelable: false }
)

  }
   

    render() {
      return (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
         <TouchableOpacity style={styles.buttonStyle} onPress={ () => this.handleSignOutGoogle()}>
            <Text style={styles.textButtonStyle}>
             Logout from Google +
            </Text>
          </TouchableOpacity>
        </View>
      )
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
          borderRadius:5
        },
      textButtonStyle:{
        fontSize: 18,
        fontWeight:'bold',
        color:'#FFF'
      },
      map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      name:{
        textAlign : 'center',
      },
      address:{
        textAlign : 'center',
      }
  });
