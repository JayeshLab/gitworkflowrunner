import * as fs from "fs";
const time_limit = 20000 * 5;
const lockfilePath = "C:/Temp/";

function checkIfDeployLockExist() {
  return fs.existsSync(`${lockfilePath}deploy.lock`);
}
function createNodeLock() {
  const currentTime = Date.now();
  fs.writeFileSync(`${lockfilePath}node.lock`, currentTime.toString());
  console.log("Node lock created");
}
function removeNodeLock() {
  fs.unlinkSync(`${lockfilePath}node.lock`);
  console.log("Node Lock Removed");
  process.exit(0);
}
function checkIfDeployLockExceedLimit() {
  const content = fs.readFileSync(`${lockfilePath}deploy.lock`, { encoding: "utf8", flag: "r" });
  const deploy_ts = parseInt(content);
  return Date.now() - deploy_ts > time_limit;
}
const delay = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};
async function execute() {
  try {
    const deployLock = checkIfDeployLockExist();
    if (deployLock) {
      console.log("Deploy Lock Exist");
      if (!checkIfDeployLockExceedLimit()) {
        console.log("Did not exceed limit");
        process.exit(0);
      }
    }
    createNodeLock();
    console.log("Process Started");
    await delay(60000);
    console.log("Done");
  } catch (err) {
    console.log(err);
  } finally {
    removeNodeLock();
  }
}
execute();
