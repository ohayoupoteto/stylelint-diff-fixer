import {
  type PathOrFileDescriptor,
  readFileSync,
  type WriteFileOptions,
  writeFileSync,
} from 'fs';

/**
 * fsのラッパークラス
 */
export class CssFileSystem {
  read(
    path: PathOrFileDescriptor,
    options?: {
      encoding?: null | undefined;
      flag?: string | undefined;
    } | null,
  ): ReturnType<typeof readFileSync> {
    return readFileSync(path, options);
  }

  write(
    file: PathOrFileDescriptor,
    data: string | NodeJS.ArrayBufferView,
    options?: WriteFileOptions,
  ): ReturnType<typeof writeFileSync> {
    writeFileSync(file, data, options);
  }
}
