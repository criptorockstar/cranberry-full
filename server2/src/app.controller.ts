import { Controller, Get, Param, Response } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/files/:filename')
  getFile(@Param('filename') filename: string, @Response() res) {
    return this.appService.getFileByName(filename, res);
  }
}
