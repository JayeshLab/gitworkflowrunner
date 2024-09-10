//#region Mixin types

// Define a generic class which can be instantiated.
export type Constructor = new (...args: any[]) => object;

export interface LockMixinInterface {
  obtainLock(startTime: number): Promise<number>;
  releaseLock(startTime: number): string;
}
//#endregion Mixin types
