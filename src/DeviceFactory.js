import os from "os";
import path from "path";
import glob from "glob";

export function createDevice(peripheral) {
  let implementations = glob.sync(path.join(__dirname, "impl", "*")).map((item) => require(item));

  if (implementations.length == 0) {
    return null;
  }

  let supportedImplementations = implementations.filter((item) => item.default.isSupported(peripheral));

  if (supportedImplementations.length == 0) {
    return null;
  }

  let DeviceImpl = supportedImplementations[0].default;
  return new DeviceImpl(peripheral);
}
