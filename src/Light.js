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

  temperatureCmd(value = 1.0) {
    this.log(`Temperature to ${value}`);
  }

  getCommands() {
    return Object.assign({}, super.getCommands(), {
      'powerOn': 'Turns the light on',
      'powerOff': 'Turns the light off',
      'temperature:N': 'Sets the temperature of the light to N, ranging from 0.0 to 1.0',
      'brightness:N': 'Sets the brightness of the light to N, ranging from 0.0 to 1.0'
    });
  }
}
