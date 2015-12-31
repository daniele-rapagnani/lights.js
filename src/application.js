import noble from "noble";
import { argv } from 'yargs';
import fs from 'fs';
import { createDevice } from './DeviceFactory'

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

if (argv.list) {
  console.log("Devices found:");
}

noble.on('discover', function(peripheral) {
  let device = createDevice(peripheral);

  if (argv.list) {
    console.log(device.toString());
  } else if (argv.uuid) {
    if ([].concat(argv.uuid).indexOf(peripheral.uuid) >= 0) {
      let commands;

      if (argv.c) {
        commands = [].concat(argv.c);
      } else if (argv.execute) {
        commands = fs.readFileSync(argv.execute, 'utf-8').split("\n");
      }

      device.execute(commands);
      console.log(`${device.toString()}: Done`);
    }
  }
});
