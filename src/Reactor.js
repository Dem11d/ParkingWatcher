export default class Reactor {
  addEventListener(eventName, action) {
    console.log(`adding new eventListener to ${this.constructor.name}`);
    if (!this.events)
      this.events = {};
    if (!this.events[eventName])
      this.events[eventName] = {};
    if (!this.events[eventName].callbacks)
      this.events[eventName].callbacks = [];
    this.events[eventName].callbacks.push(action);
    //returns clearListener function
    return () => {
      this.events[eventName].callbacks = this.events[eventName].callbacks.filter(func => func !== action);
      console.log("removed one listener, left: ", this.events[eventName].callbacks.length);
    }
  }

  async dispatchEvent(eventName, ...args) {
    console.log(`dispatching event ${eventName} `);
    if(this.events && this.events[eventName] && this.events[eventName]) {
      let length = this.events[eventName].callbacks.length;
      for (let i = 0; i < length; i++) {
        let func = this.events[eventName].callbacks[i];
        if(args)
          func(...args);
        else
          func();
      }
    }
  }

  removeAllEventListeners(event) {
    if (!this.events && this.events[event])
      delete this.events[event];

  }
}