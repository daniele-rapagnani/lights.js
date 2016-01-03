## Information
**lights.js** is a Node application that allows you to control your Bluetooth lights.
Currently only the [AwoX Smart Light (SML-w7)](http://www.awox.com/connected-lighting/awox-smartlight/)
is supported.

#### Installation
Clone this repository and follow the instructions for the Prerequisites
of the [noble](https://github.com/sandeepmistry/noble) dependency according
to your operating system.
Then simply run:

```sh
npm install
```

#### Usage
Typical usage would be to scan for supported lights first:

```sh
node index.js -l
```

Now you have to list the commands available for a given device:

```sh
node index.js -i -u d03972bc91e7
```

Optionally you can omit the light UUID to print infos for all of the
available lights.

Now you can run the desired command sequence.
For example this would power all the lights off, wait for 5 seconds than
power them back on again:

```sh
node index.js -c powerOff -c wait:5000 -c powerOn
```

This would change the color temperature to halfway between warm
and cold, on only two lights:
```sh
node index.js --uuid d03972bc91e7 --uuid d03972bc94e7 -c temperature:0.5
```

Commands can also be executed from file:
```sh
node index.js --execute file_commands
```

The syntax of this commands files is just one command per line, like:
```
powerOn
brightness:0.5
wait:1000
powerOff
```
