import * as dotenv from "dotenv";
import { LockMixin } from "./mixins/lock.mixin";
import { BaseClass } from "./base.class";
import * as core from "@actions/core";

dotenv.config();

export class AddLock extends LockMixin(BaseClass) {
  public constructor(...args: any[]) {
    super(...args);
  }
}
(async () => {
  const addLock = new AddLock();
  try {
    const startTime = Date.now();
    await addLock.obtainLock(startTime);
    core.setOutput("START_TIME", startTime);
  } catch (err) {
    console.error(err.message ?? err.toString());
    process.exit(1);
  }
})();
