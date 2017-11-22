import {locationService} from "./LocationService";
import {dataSource} from "../data/dataService";
import {apiService} from "../api/ApiService";
import config from "../config";
import Reactor from "../Reactor";

class ParkingChecker extends Reactor{
  async init(){
    console.log("initializing parking checker");
    await dataSource.loadFromStorage("radius",config.defaultRadius);
    locationService.addEventListener("newPosition",this.handleNewPosition);
  }
  async handleNewPosition(position){
    console.log("handle new in parkingChecker");
    let requestData = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      radius: dataSource.getState().radius
    };
    let parkings = await apiService.getJSON("parkings.php", requestData);
    dataSource.updateState({parking: parkings});
    await parkingChecker.dispatchEvent("newParking");

  }
}

let parkingChecker = new ParkingChecker();
export default parkingChecker;