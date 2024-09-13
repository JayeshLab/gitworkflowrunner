import * as fs from "fs";
import * as os from "os";
import * as dotenv from "dotenv";
import { BaseClass } from "./base.class";
import { LockMixin } from "./mixins/lock.mixin";
dotenv.config();

export class Mover extends LockMixin(BaseClass) {
  public constructor(...args: any[]) {
    super(args);
  }
  public async main(): Promise<void> {
    const mover = new Mover({ manufacturer: "medtronic" });
    let startTime: number = Date.now();
    try {
      startTime = await mover.obtainLock(startTime);
      await mover.delay(40000);
    } catch (err) {
      console.error(err.message ?? err.toString());
      throw new Error(err);
    } finally {
      mover.releaseLock(startTime);
    }
  }
}
(async () => {
  const mover = new Mover();
  mover.main();
})().catch((e) => console.error(e));
