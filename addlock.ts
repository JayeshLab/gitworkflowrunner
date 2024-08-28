import * as dotenv from "dotenv";
import { WorkflowMixin } from "./mixins/workflow.mixin";
import { BaseClass } from "./base.class";
const { exec } = require("child_process");

dotenv.config();

export class AddLock extends WorkflowMixin(BaseClass) {
  protected _process_time_limit = parseInt(process.env.PROCESS_TIME_LIMIT);
  protected _lock_check_delay = parseInt(process.env.LOCK_CHECK_DELAY);

  public constructor(...args: any[]) {
    super(args);
  }
  public async main(): Promise<number> {
    const startTime = Date.now();
    const myFileName = this.addLockFile(startTime);
    let exit = true;
    do {
      let files = this.readFilesFromFolder();
      this.checkOlderFilesAndRemove(files);
      files = this.readFilesFromFolder();
      if (files[0] === myFileName) {
        return startTime;
      } else if (startTime - Date.now() > this._process_time_limit) {
        process.exit(1);
      } else {
        await this.delay(this._lock_check_delay);
      }
    } while (exit);
  }
}

(async () => {
  const addLock = new AddLock();
  const tm = await addLock.main();
  //exec(`echo "start_time=${tm}" >> $GITHUB_OUTPUT`);
  //console.log(`echo "start_time=${tm}" >> $GITHUB_OUTPUT`);
  process.stdout.write(`start_time=${tm}`);
  return;
})().catch((e) => console.error(e));
