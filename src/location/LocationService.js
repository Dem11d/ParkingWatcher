import {dataSource} from "../data/dataService";
import {apiService} from "../api/ApiService";
import Reactor from "../Reactor";
import {googleAuth} from "../auth";


/***
 * @param event supported only "newPosition" event yet
 * @param action
 * @returns {function()} callback for removeEventListener
 */
class LocationService extends Reactor{
  async init() {
    let settings = await apiService.getJSON("settings.php");
    dataSource.updateState({settings: settings});

    googleAuth.addEventListener("login",()=>{this.startWatch()});
    googleAuth.addEventListener("logout",()=>{this.stopWatch()});
  }

  startWatch() {
    console.log("starting watch for parking");
    this._callLocation();
  }

  _callLocation(){
    let handleError = (err)=>{
      console.log(err);
      console.log("trying to call position again");
      setTimeout(()=>this._callLocation(),200);
    };

    navigator.geolocation.getCurrentPosition(this._handleCurrentPosition,
        handleError, {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000});
  }

  stopWatch() {
    if (this.watchTimeoutId)
      clearInterval(this.watchTimeoutId);
  }

  _nextPositionTimeout(){
    console.log("setting next timeout to obtaining position");
    let delay = dataSource.getState().settings.TimeToUpdate * 1000;
    delay = 10000;
    this.watchTimeoutId = setTimeout(this._callLocation.bind(this), delay);
  }

  async _handleCurrentPosition(position) {
    if(position) {
      //comparing old and new positions
      let newPositionObject = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      let oldPositionObject = dataSource.getState().currentPosition;
      let newPosStr = JSON.stringify(newPositionObject);
      let oldPosStr = JSON.stringify(oldPositionObject);

      dataSource.updateState({currentPosition: newPositionObject});
      if (newPosStr !== oldPosStr) {
        console.log("old position ", oldPosStr);
        console.log("new position ", newPosStr);
        await locationService.dispatchEvent("newPosition", position);
      }
    }
    locationService._nextPositionTimeout();
  }

}



let locationService = new LocationService();
export {locationService};
