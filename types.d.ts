//#region Mixin types

// Define a generic class which can be instantiated.
export type Constructor = new (...args: any[]) => object;

export interface LockMixinInterface {
  readLocksFromFolder(): string[];
  getLockFileName(): string;
  delay(ms: number): Promise<void>;
  obtainLock(startTime: number): Promise<number>;
  releaseLock(startTime: number): string;
}
//#endregion Mixin types
