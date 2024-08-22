import * as fs from "fs";
const lockfilePath = "C:/Temp/";
function execute() {
  const deployLock = fs.existsSync(`${lockfilePath}deploy.lock`);
  if (deployLock) {
    fs.unlinkSync(`${lockfilePath}deploy.lock`);
  }
}
execute();
