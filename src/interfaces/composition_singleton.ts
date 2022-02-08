export class SingletonCompositionClass {
    private static _instance: SingletonCompositionClass | null;
    public static get isInstance(): boolean {
      if (this._instance) return true;
      this._instance = new this();
      return false;
    }
    public static destructor(): void {
      this._instance = null;
    }
  }