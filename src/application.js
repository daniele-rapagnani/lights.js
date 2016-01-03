import noble from "noble";
import fs from 'fs';
import { sprintf } from 'sprintf-js';
import { createDevice } from './DeviceFactory';

var argv = require('yargs')
  .describe('c', 'Sends a command to the lights')
  .alias('c', 'command')
  .describe('l', 'Scans for supported lights and lists them along with their supported commands')
  .alias('l', 'list')
  .describe('u', 'Selects a light by UUID. Can be specified multiple times for multiple lights')
  .alias('u', 'uuid')
  .describe('i', 'Prints some info on the selected device, including the available commands')
  .alias('i', 'info')
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

  if (!device) {
    return;
  }

  if (argv.list) {
    console.log(device.toString());
  } else if (!argv.uuid || [].concat(argv.uuid).indexOf(peripheral.uuid) >= 0) {
    if (argv.info) {
      let commandsInfos = device.getCommands();
      let maxWidth = Object.keys(commandsInfos).reduce((a,b) => a.length > b.length ? a.length : b.length);
      console.log(device.toString());
      for (var command in commandsInfos) {
        if (commandsInfos.hasOwnProperty(command)) {
          console.log(sprintf("%-"+(maxWidth + 5)+"s %s", command, commandsInfos[command]));
        }
      }
      console.log("");
    } else {
      let commands;

      if (argv.command) {
        commands = [].concat(argv.command);
      } else if (argv.execute) {
        commands = fs.readFileSync(argv.execute, 'utf-8').split("\n");
      }

      device.execute(commands);
      device.log("Done");
    }
  }
});
