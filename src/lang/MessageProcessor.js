import Reactor from "../Reactor";
import {dataSource} from "../data/dataService";
import languageData from "./languages";
import {AsyncStorage} from "react-native";

class LanguageService extends Reactor{
  constructor(languageSource){
    super();
    this.languageSource = languageSource.languagesData;
    this.languages = languageSource.languages;
  }
  setLanguage(lang){
    if(this.languages.includes(lang)) {
      const index = this.languages.indexOf(lang);
      console.log("setting language", index);
      dataSource.updateState({language: index});
      AsyncStorage.setItem("language", `${index}`);
      this.dispatchEvent("changeLanguage");
    }
  }
  getCurrentLanguage(){
    return this.languages[dataSource.getState().language];
  }

  getMessage(key){
    if(this.languageSource[key])
      return this.languageSource[key][dataSource.getState().language];
    else
      return null;
  }
}

let languageService = new LanguageService(languageData);
export {languageService}