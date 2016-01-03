import noble from "noble";
import fs from 'fs';
import { createDevice } from './DeviceFactory'

var argv = require('yargs')
  .describe('c', 'Sends a command to the lights')
  .alias('c', 'command')
  .describe('l', 'Scans for supported lights and lists them along with their supported commands')
  .alias('l', 'list')
  .describe('u', 'Selects a light by UUID. Can be specified multiple times for multiple lights')
  .alias('u', 'uuid')
  .describe('e', 'Runs a sequence of commands from file, one command per line')
  .alias('e', 'execute')
  .help('h')
  .alias('h', 'help')
  .example('$0 --uuid d03972bc91e7 -c powerOn', 'turns the selected light on')
  .argv
;

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
    console.log("-- Supported Commands:");
    device.getSupportedCommands().forEach((item) => console.log(`\t${item}`));
  } else if (argv.uuid) {
    if ([].concat(argv.uuid).indexOf(peripheral.uuid) >= 0) {
      let commands;

      if (argv.c) {
        commands = [].concat(argv.c);
      } else if (argv.execute) {
        commands = fs.readFileSync(argv.execute, 'utf-8').split("\n");
      }

      device.execute(commands);
      device.log("Done");
    }
  }
});
