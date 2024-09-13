import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import type { Constructor, LockMixinInterface } from "../types";

export const LockMixin = <TBase extends Constructor>(Base: TBase) =>
  class extends Base implements LockMixinInterface {
    protected _processTimeout: number;
    protected _pollFrequency: number;
    protected _lockFolderPath: string;
    protected _lockTimeout: number;

    public constructor(...args: any[]) {
      super(...args);
      this._processTimeout = (process.env.PROCESS_TIMEOUT && parseInt(process.env.PROCESS_TIMEOUT)) || 10 * 60 * 1000;
      this._pollFrequency = (process.env.POLL_FREQUENCY && parseInt(process.env.POLL_FREQUENCY)) || 10 * 1000;
      this._lockTimeout = (process.env.LOCK_TIMEOUT && parseInt(process.env.LOCK_TIMEOUT)) || 60 * 60 * 1000;
      this._lockFolderPath = process.env.LOCK_FOLDER_PATH || path.join(os.tmpdir(), "locks", path.sep);
      // Create lock folder if not exist
      if (!fs.existsSync(this._lockFolderPath)) {
        fs.mkdirSync(this._lockFolderPath);
      }
    }

    /**
     * Read all the locks from lock folder path and sorted
     * @returns list of lock file
     */
    protected readLocksFromFolder(): string[] {
      return fs
        .readdirSync(this._lockFolderPath)
        .filter((file) => file.match(/^lock_([0-9]+)$/i))
        .sort();
    }

    /**
     * Get the oldest lock name
     * @returns oldest file name
     */
    protected getLockFileName(): string {
      let files = this.readLocksFromFolder();
      files = files.filter((file) => {
        const match = file.match(/^lock_([0-9]+)$/i);
        return Date.now() - parseInt(match[1]) < this._lockTimeout;
      });
      return files[0];
    }

    protected delay(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Obtain the lock if no lock is aquired otherwise wait for the release of lock, if it exceeds process timeout throw error
     * @param current start time in milliseconds
     * @returns start time in milliseconds
     */
    public async obtainLock(startTime: number): Promise<number> {
      const myFileName = `lock_${startTime.toString()}`;
      fs.writeFileSync(`${this._lockFolderPath}${myFileName}`, "", {
        flag: "wx",
      });
      console.log(`Created lock ${myFileName}`);
      const deltaMs = Date.now() - startTime;
      let remainingMs = this._processTimeout - deltaMs;
      while (remainingMs > 0) {
        const lockFile = this.getLockFileName();
        if (lockFile === myFileName) {
          console.log(`Obtain lock ${myFileName}`);
          return startTime;
        }
        await this.delay(this._pollFrequency);
        remainingMs -= this._pollFrequency;
      }
      this.releaseLock(startTime);
      throw Error("Exceed the process running time limit");
    }
    /**
     * Release the lock with timestamp suffix
     * @param current start time in milliseconds
     * @returns status
     */
    public releaseLock(startTime: number): string {
      const myFileName = `lock_${startTime.toString()}`;
      fs.unlinkSync(`${this._lockFolderPath}${myFileName}`);
      console.log(`Released lock ${myFileName}`);
      return "SUCCESS";
    }
  };
