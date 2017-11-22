import {AsyncStorage} from 'react-native';
import config from "../config";
import {apiService} from "../api/ApiService";

class DataService {
  constructor() {
    this.state = {};

  }
  async initStorage(){
    await this.loadFromStorage("userId", null);
    await this.loadFromStorage("language", config.defaultLanguage);
  }

  updateState(updates) {
    this.state = Object.assign(this.state, updates);
  }

  getState() {
    return this.state;
  }

  async loadFromStorage(item, defaultValue) {
    let itemFromStorage = await AsyncStorage.getItem(item);
    this.state[item] = itemFromStorage ? itemFromStorage : defaultValue;
  }
}

//Singletons
let dataSource = new DataService();
export {dataSource};