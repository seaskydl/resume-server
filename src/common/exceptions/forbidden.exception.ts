import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor() {
    super('禁止访问！', HttpStatus.FORBIDDEN);
  }
}
