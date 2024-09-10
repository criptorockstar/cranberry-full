import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Injectable()
export class AppService {
  getFileByName(fileName: string, res: Response) {
    const filePath = join(process.cwd(), 'public', fileName);

    return res.sendFile(filePath);
  }
}
