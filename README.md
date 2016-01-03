## Information
**light.js** is a Node application that allows you to control your Bluetooth lights.
Currently only the [AwoX Smart Light (SML-w7)](http://www.awox.com/connected-lighting/awox-smartlight/)
is supported.

#### Installation
Clone this repository and follow the instructions for the Prerequisites
of the [noble](https://github.com/sandeepmistry/noble) dependency according
to your operating system.

#### Usage
Typical usage would be to scan for supported lights first:

```sh
node index.js --list
```
Then you would select the lights you want, or none if you want to affect all
of them at once, and run the desired command sequence.

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

As you can see from this example, some commands accept a value that can be passed
to them using the **:** separator, for further information consult the help with:

```sh
node index.js --help
```

Commands can also be executed from file:
```sh
node index.js --execute file_commands
```

The syntax of this commands files is just one command per line, like:
```
powerOn
brightness: 0.5
wait: 1000
powerOff
```
