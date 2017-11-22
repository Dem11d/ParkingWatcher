import config from "../config";

class ApiService {
  async getJSON(route, data) {
    await this._checkVersion();
    let newRoute = `${this.version}/${route}`;
    return _getJSON(newRoute, data);
  }

  async callUrl(route, data) {
    await this._checkVersion();
    return await _callUrl(route, data);
  }

  async _checkVersion() {
    if (!this.version) {
      this.version = await _getJSON("version.json").then(response => response.version);
      console.log(this.version);
    }
  }


}

async function _getJSON(route, data) {
  let urlResponse = await _callUrl(route, data);
  if (urlResponse)
    return JSON.parse(urlResponse._bodyInit);
  else
    return null;
}

async function _callUrl(route, data) {
  let absoluteRoute = config.apiRoute + route;
  if (data) {
    absoluteRoute += "?";
    absoluteRoute += Object.keys(data).map(key => `${key}=${data[key]}`).join("&");
  }
  console.log(absoluteRoute);
  let urlResponse = await fetch(absoluteRoute);

  if (urlResponse.status === 200) {
    return urlResponse;
  } else {
    console.error("bad response");
    console.log(`route = ${route}`);
    console.log(`route for execution = ${absoluteRoute}`);
    return null;
  }
}

export let apiService = new ApiService();
