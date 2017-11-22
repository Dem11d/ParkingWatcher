import React, {Component} from 'react';
import {DrawerNavigator} from "react-navigation";
import {
  Button,
  Text,
  Container,
  Content,
} from "native-base";
import HomeScreen from "../screens/HomeScreen";
import Settings from "../screens/Settings";
import Help from "../screens/Help";
import Exit from "../screens/Exit";
import {SideBar} from "./sidebar";
import Favorites from "../screens/Favorites";

export default DrawerNavigator({
      Home: {screen: HomeScreen},
      Favorites: {screen: Favorites},
      Settings: {screen: Settings},
      Help:{screen: Help},
      Exit:{screen: Exit}
    },
    {
      contentComponent: (props) => {
        return (<SideBar {...props} />)
      }
    }
);


