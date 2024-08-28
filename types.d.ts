//#region Mixin types

// Define a generic class which can be instantiated.
export type Constructor = new (...args: any[]) => object;

export interface WorkflowMixinInterface {
  readFilesFromFolder(): string[];
  checkOlderFilesAndRemove(files: string[]): void;
  delay(ms: number): Promise<void>;
  addLockFile(time: number): string;
  removeLockFile(time: number): void;
}

//#endregion Mixin types
