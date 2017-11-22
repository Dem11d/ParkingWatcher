import React from 'react';
  import {
    Text,
    View,
    AsyncStorage,
    
  } from 'react-native';

  import {
    createRouter,
    NavigationProvider,
    StackNavigation,
  } from '@expo/ex-navigation';
var Item = require('../languages/dictionary.json');

export default class Help extends React.Component {

static route = {
      
      navigationBar: {
       title: function(params) {
          if (typeof params.language === 'undefined') {
            return '';
          }
          return Item[params.language].help;
        }
      }
    }

  constructor(props) {
   
    super(props);
    
    this.state = {    
      language:0
    };    
  }

  componentDidMount() {
      
      AsyncStorage.getItem("language").then((value)=>{
      this.setState({language: value})
      this.props.navigator.updateCurrentRouteParams({language: value});
    }).done();
  
  }

  componentWillReceiveProps(){

  AsyncStorage.getItem("language").then((value)=>{
        this.setState({language: value})
        this.forceUpdate(function(){
          AsyncStorage.getItem("language").then((value)=>{
          
          this.setState({language: value})
         
            }).done();
          });
        
        this.props.navigator.updateCurrentRouteParams({language: value});
      }).done();
     
      AsyncStorage.getItem("version").then((value)=>{
          this.setState({version:value})
          this.forceUpdate(function(){
          AsyncStorage.getItem("version").then((value)=>{
       
          this.setState({version: value})
            }).done();
          });
      }).done();
     
}
    render() {
      return (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
         <Text>{Item[this.state.language].textHelp}</Text>
        </View>
      )
    }

  }