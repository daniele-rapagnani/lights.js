import Device from './Device';

export default class Light extends Device {
  powerOnCmd() {
    this.log("Power On");
  }

  powerOffCmd() {
    this.log("Power Off");
  }

  brightnessCmd(value = 1.0) {
    this.log(`Brightness to ${value}`);
  }
}
