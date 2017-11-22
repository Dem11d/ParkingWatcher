import {dataSource} from "../data/dataService";
import {apiService} from "../api/ApiService";
import Reactor from "../Reactor";


/***
 * @param event supported only "newPosition" event yet
 * @param action
 * @returns {function()} callback for removeEventListener
 */
class LocationService extends Reactor{
  async init() {
    let settings = await apiService.getJSON("settings.php");
    dataSource.updateState({settings: settings});
  }

  startWatch() {
    console.log("starting watch for parkings");
    this._callLocation();
  }

  _callLocation(){
    let handleError = (err)=>{
      console.log(err);
      console.log("trying to call position again");
      this._callLocation();
    }

    navigator.geolocation.getCurrentPosition(this._handleCurrentPosition.bind(this),
        handleError, {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000});
    this._nextPositionTimeout();


  }

  stopWatch() {
    if (this.watchTimeoutId)
      clearInterval(this.watchTimeoutId);
  }

  _nextPositionTimeout(){
    console.log("setting next timeout to obtaining position");
    let delay = dataSource.getState().settings.TimeToUpdate * 1000;
    // delay = 10000;
    this.watchTimeoutId = setTimeout(this._callLocation, delay);
  }

  async _handleCurrentPosition(position) {
    console.log("new location");
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
      console.log("old position ",oldPosStr);
      console.log("new position ",newPosStr);
      await this.dispatchEvent("newPosition", position);
    }
    this._nextPositionTimeout();
  }

}



let locationService = new LocationService();
export {locationService};
