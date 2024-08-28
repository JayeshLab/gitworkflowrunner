import * as fs from "fs";
import * as dotenv from "dotenv";
import { WorkflowMixin } from "./mixins/workflow.mixin";
import { BaseClass } from "./base.class";
dotenv.config();

export class RemoveLock extends WorkflowMixin(BaseClass) {
  protected _timestamp: number;
  public constructor(args: string[]) {
    super(args);
    if (args[2]) {
      this._timestamp = parseInt(args[2]);
    } else {
      throw Error("Timestamp argument not found");
    }
  }
  public async main(): Promise<void> {
    console.log(this.removeLockFile(this._timestamp));
  }
}
(async () => {
  const removeLock = new RemoveLock(process.argv);
  removeLock.main();
  return;
})().catch((e) => console.error(e));
