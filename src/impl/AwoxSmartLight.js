import Light from "../Light"

const POWER_COMMAND = 10;
const BRIGHTNESS_COMMAND = 12;
const TEMPERATURE_COMMAND = 14;

export default class AwoxSmartLight extends Light {
  constructor(peripheral) {
      super(peripheral, "AwoX Smart Light");
  }

  connect() {
    let prom = super.connect();

    return prom.then(() =>
      new Promise((resolve, reject) => {
        this.peripheral.discoverAllServicesAndCharacteristics((error, services, characteristics) => {
          let matchedChar = characteristics.filter((item) => item.uuid == 'fff1');

          if (matchedChar.length == 0) {
            reject();
          }

          this.dataChar = matchedChar[0];
          resolve();
      });
    }));
  }

  powerOnCmd() {
    super.powerOnCmd();
    return this.sendCommand(POWER_COMMAND, [1]);
  }

  powerOffCmd() {
    super.powerOffCmd();
    return this.sendCommand(POWER_COMMAND, [0]);
  }

  brightnessCmd(value = 1.0) {
    super.brightnessCmd(value);
    let convertedVal = Math.floor((value * 9) + 2);
    return this.sendCommand(BRIGHTNESS_COMMAND, [convertedVal]);
  }

  temperatureCmd(value = 1.0) {
    super.temperatureCmd(value);
    let convertedVal = Math.floor((value * 9) + 2);
    return this.sendCommand(TEMPERATURE_COMMAND, [convertedVal]);
  }

  buildCommand(command, values) {
    var data = [0xAA, 10, 0xFC, 58, 0x86, 1, command, values.length].concat(values);
    data.push(Math.floor(Math.random() * 0xFF) >>> 0);
    var checksum = ((data.slice(1).reduce(function(a, b) { return (a + b); }) + 85) & 0xFF);
    data.push(checksum);
    data.push(13);

    return new Buffer(data);
  }

  sendCommand(command, values) {
    return new Promise((resolve, reject) => {
      if (!this.dataChar) {
        reject();
      }

      let data = this.buildCommand(command, values);
      console.log(data);
      this.dataChar.write(data, false, () => resolve());
    });
  }

  static isSupported(peripheral) {
    return ['SML-w7', 'SML_w7'].indexOf(peripheral.advertisement.localName) >= 0;
  }
}
