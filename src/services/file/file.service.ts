/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Scope } from '@nestjs/common';

import * as fs from 'fs';
import * as rfs from 'rotating-file-stream';

const defaultOptions: rfs.Options = {
  size: '15M',
  interval: '1d',
  compress: true,
};

@Injectable({ scope: Scope.TRANSIENT })
export class FileService {
  createDirectoryIfNoneExists(directoryPath: string): void {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
    }
  }

  getRotatingFileStream(filename: string, options: rfs.Options = defaultOptions): rfs.RotatingFileStream {
    return rfs.createStream(filename, options);
  }
}
