import * as fs from "fs";
import * as dotenv from "dotenv";
import { LockMixin } from "./mixins/lock.mixin";
import { BaseClass } from "./base.class";
dotenv.config();

export class RemoveLock extends LockMixin(BaseClass) {
  protected _timestamp: number;
  public constructor(args: string[]) {
    super(args);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [nodeExecutable, nodeScript, ...commandLineArgs] = args;
    if (commandLineArgs[0]) {
      this._timestamp = parseInt(commandLineArgs[0]);
    }
  }
  public async main(): Promise<void> {
    if (this._timestamp) {
      console.log(this.releaseLock(this._timestamp));
    } else {
      console.error("Missing Timestamp");
      process.exit(1);
    }
  }
}
(async () => {
  const removeLock = new RemoveLock(process.argv);
  removeLock.main();
})().catch((e) => console.error(e));
