import type { Constructor, WorkflowMixinInterface } from "../types";
import * as fs from "fs";

export const WorkflowMixin = <TBase extends Constructor>(Base: TBase) =>
  class extends Base implements WorkflowMixinInterface {
    public constructor(...args: any[]) {
      super(...args);
    }
    public readFilesFromFolder(): string[] {
      return fs
        .readdirSync(process.env.LOCK_FOLDER_PATH)
        .filter((file) => file.match(/^lock_/i))
        .sort();
    }
    public checkOlderFilesAndRemove(files: string[]): void {
      for (const file of files) {
        const match = file.match(/lock_(\d+)/i);
        const ts = parseInt(match[1]);
        if (Date.now() - ts > parseInt(process.env.LOCK_TIMEOUT)) {
          fs.unlinkSync(`${process.env.LOCK_FOLDER_PATH}/${file}`);
        }
      }
    }
    public delay(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    public addLockFile(time: number): string {
      const myFileName = `lock_${time.toString()}`;
      fs.writeFileSync(`${process.env.LOCK_FOLDER_PATH}/${myFileName}`, "", { flag: "wx" });
      return myFileName;
    }
    public removeLockFile(time: number): string {
      const myFileName = `lock_${time.toString()}`;
      fs.unlinkSync(`${process.env.LOCK_FOLDER_PATH}/${myFileName}`);
      return "SUCCESS";
    }
  };
