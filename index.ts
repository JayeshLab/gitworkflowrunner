import * as fs from "fs";
import * as dotenv from "dotenv";
import { BaseClass } from "./base.class";
import { WorkflowMixin } from "./mixins/workflow.mixin";
dotenv.config();

export class Mover extends WorkflowMixin(BaseClass) {
  public constructor(...args: any[]) {
    super(args);
  }
  public async main(): Promise<void> {
    const startTime = Date.now();
    const myFileName = this.addLockFile(startTime);
    let exit = true;
    do {
      let files = this.readFilesFromFolder();
      this.checkOlderFilesAndRemove(files);
      files = this.readFilesFromFolder();
      if (files[0] === myFileName) {
        exit = false;
      } else if (startTime - Date.now() > 10 * 60 * 1000) {
        process.exit(1);
      } else {
        await this.delay(parseInt(process.env.LOCK_CHECK_INTERVAL));
      }
    } while (exit);
    console.log("Process Started");
    await this.delay(60000);
    this.removeLockFile(startTime);
  }
}
(async () => {
  const mover = new Mover();
  mover.main();
})().catch((e) => console.error(e));
