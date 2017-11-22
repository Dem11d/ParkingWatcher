import {AsyncStorage} from 'react-native';
import {dataSource} from "./data/dataService";
import {apiService} from "./api/ApiService";
import Reactor from "./Reactor";

class GoogleAuth extends Reactor{
  async login() {
    let result = await Expo.Google.logInAsync({
      behavior: 'web',
      androidClientId: '733666839474-29hiep386cbm9u262lvgjf96uvq8pglu.apps.googleusercontent.com',
      offlineAccess: true,
      iosClientId: '733666839474-l0s6c0d1m4f844cin668iilgears8b2n.apps.googleusercontent.com',
      androidStandaloneAppClientId: '1058993209978-klpic8b3p5pcakaj5q9dtit1uc8ehpjq.apps.googleusercontent.com',
      iosStandaloneAppClientId: "781003513990-a0kh9j0dn4l85m0hdcsnc2i868n4jjac.apps.googleusercontent.com",
      scopes: ['profile', 'email'],
    });

    if (result.type === 'success') {

      apiService.getJSON("login.php", {uid: result.user.id})
          .then((responseData) => {
            console.log(responseData);
          }).done();

      await AsyncStorage.setItem("userId", result.user.id);
      dataSource.updateState({"userId": result.user.id});
      console.log(`user_id = ${result.user.id}`);
      await this.dispatchEvent("login");
    }
    else {
      let error = new Error("failed login");
      error.response = result ;
      throw error;
    }
  }

  async logout(){
    await AsyncStorage.removeItem("userId");
    dataSource.updateState({userId:null});
    await this.dispatchEvent("logout");
  }
}

let googleAuth = new GoogleAuth();
export {googleAuth};