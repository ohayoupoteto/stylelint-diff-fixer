/**
 * Lint用の一時的なファイル
 */
export class DummyFile {
  constructor(
    private readonly _path: string,
    private readonly _data: string,
  ) {}

  get path(): string {
    return this._path;
  }

  get data(): string {
    return this._data;
  }
}
