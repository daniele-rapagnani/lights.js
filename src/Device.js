export default class Device {
  constructor(peripheral, displayName) {
    this.name = peripheral.advertisement.localName || displayName;
    this.peripheral = peripheral;
    this.displayName = displayName;
  }

  log(message) {
    console.log(`${this.toString()}: ${message}`);
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (!this.peripheral) {
        return reject();
      }

      this.peripheral.connect(() => {
        this.log("Connected");
        resolve();
      });
    });
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      if (!this.peripheral) {
        return reject();
      }

      this.peripheral.disconnect(() => {
        this.log("Disconnected");
        resolve();
      });
    });
  }

  execute(commands) {
    commands = commands.filter((item) => `${item.split(":")[0]}Cmd` in this);

    if (commands.length > 0) {
      let prom = this.connect();

      for(let i in commands) {
        let command = commands[i].split(":")[0];
        let args = commands[i].split(":").slice(1);

        prom = prom.then(() => ((command, args) => {
          return this[`${command}Cmd`].apply(this, args);
        })(command, args));
      }

      prom
        .then(() => this.disconnect())
        .catch((err) => console.error("ERROR:", err.toString()))
      ;
    }
  }

  waitCmd(delay = 1000) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), delay);
    });
  }

  getCommands() {
    return {
      'wait:N': 'Waits for N milliseconds before the next command'
    };
  }

  toString() {
    return `${this.displayName} (${this.peripheral.uuid})`;
  }
}
