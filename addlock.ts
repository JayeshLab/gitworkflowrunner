import * as fs from "fs";
let checkLoop;
const time_limit = 20000 * 5;
const check_interval = 5000;
const lockfilePath = "C:/Temp/";
function checkIfNodeLockExist() {
  return fs.existsSync(`${lockfilePath}node.lock`);
}
function checkIfDeployLockExist() {
  return fs.existsSync(`${lockfilePath}deploy.lock`);
}
function createDeployLock() {
  console.log("Creating Deploy Lock");
  const currentTime = Date.now();
  fs.writeFileSync(`${lockfilePath}deploy.lock`, currentTime.toString());
  process.exit(0);
}
function execute() {
  console.log("ADD LOCK STARTED");
  const nodeLock = checkIfNodeLockExist();
  if (nodeLock) {
    console.log("Node lock is present");
    const content = fs.readFileSync(`${lockfilePath}node.lock`, { encoding: "utf8", flag: "r" });
    const node_ts = parseInt(content);
    checkLoop = setInterval(() => {
      console.log("Checking lock again");
      if (Date.now() - node_ts > time_limit) {
        console.log("Limit Crossed");
        clearInterval(checkLoop);
        process.exit(1);
      }
      const lock = checkIfNodeLockExist();
      if (!lock) {
        console.log("Node lock not exist");
        createDeployLock();
      }
    }, check_interval);
  } else {
    createDeployLock();
  }
}
execute();
