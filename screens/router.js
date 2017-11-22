import {
    createRouter,
  } from '@expo/ex-navigation';

import HomeScreen from '../src/screens/HomeScreen';
import AboutScreen from './AboutScreen';
import Maps from './OldMaps';
import Favourites from './Favorites';
import Settings from '../src/screens/Settings';
import Help from './Help';
import Exit from './Exit';


export default Router = createRouter(() => ({
    home: () => HomeScreen,
    // about: () => AboutScreen,
    // maps: () => Maps,
    // favourites: () => Favorites,
    // settings: () => Settings,
    // help: () => Help,
    // exit: () => Exit,
   
  }));