import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage,
} from 'react-native';


import {
  NavigationProvider,
  StackNavigation,
  DrawerNavigation,
  DrawerNavigationItem,
} from '@expo/ex-navigation';

import Router from './router';

var Item = require('../languages/dictionary.json');


export default class Navigator extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      language: 0
    };


  }

  setLanguage() {
    AsyncStorage.getItem("language").then((value) => {

      this.setState({language: value});
    }).done()
  }

  getLanguage(value) {

    this.setLanguage();

    return (
        <DrawerNavigation
            id='home'
            initialItem='home'
            drawerWidth={250}
            renderHeader={this._renderHeader}
        >
          <DrawerNavigationItem
              id='home'
              selectedStyle={styles.selectedItemStyle}
              renderTitle={isSelected => this._renderTitle(Item[this.state.language].home, isSelected)}
          >
            <StackNavigation
                id='home'
                initialRoute={Router.getRoute('home')}
            />
          </DrawerNavigationItem>

          <DrawerNavigationItem
              id='about'
              selectedStyle={styles.selectedItemStyle}
              renderTitle={isSelected => this._renderTitle(Item[this.state.language].about, isSelected)}

          >
            <StackNavigation
                id='about'
                initialRoute={Router.getRoute('about')}

            />
          </DrawerNavigationItem>

          <DrawerNavigationItem
              id='favourites'
              selectedStyle={styles.selectedItemStyle}
              renderTitle={isSelected => this._renderTitle(Item[this.state.language].favourites, isSelected)}
          >
            <StackNavigation
                id='favourites'
                initialRoute={Router.getRoute('favourites')}
            />
          </DrawerNavigationItem>

          <DrawerNavigationItem
              id='settings'
              selectedStyle={styles.selectedItemStyle}
              renderTitle={isSelected => this._renderTitle(Item[this.state.language].settings, isSelected)}
          >
            <StackNavigation
                id='settings'
                initialRoute={Router.getRoute('settings')}
            />
          </DrawerNavigationItem>

          <DrawerNavigationItem
              id='help'
              selectedStyle={styles.selectedItemStyle}
              renderTitle={isSelected => this._renderTitle(Item[this.state.language].help, isSelected)}
          >
            <StackNavigation
                id='help'
                initialRoute={Router.getRoute('help')}
            />
          </DrawerNavigationItem>

          <DrawerNavigationItem
              id='exit'
              selectedStyle={styles.selectedItemStyle}
              renderTitle={isSelected => this._renderTitle(Item[this.state.language].exit, isSelected)}
          >
            <StackNavigation
                id='exit'
                initialRoute={Router.getRoute('exit')}
            />
          </DrawerNavigationItem>

        </DrawerNavigation>

    )

  }


  render() {

    return (

        <NavigationProvider router={Router}>

          {this.getLanguage(this.state.language)}

        </NavigationProvider>
    );
  }

  _renderHeader = () => {
    return (
        <View style={styles.header}>
        </View>
    );
  };

  _renderTitle(text, isSelected) {
    return (
        <Text style={[styles.titleText, isSelected ? styles.selectedTitleText : {}]}>
          {text}
        </Text>
    );
  };
}

const styles = StyleSheet.create({
  header: {
    height: 20,

  },

  selectedItemStyle: {
    backgroundColor: 'white'
  },

  titleText: {
    fontWeight: 'bold'
  },

  selectedTitleText: {
    color: 'black'
  }
});