export class ErrorHandler extends Error {
  name = 'Controller Error';
  message: string;
  status: number;
  code?: number;

  constructor(msg: string, status: number, code?: number) {
    super(msg);
    this.message = msg;
    this.status = status;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}
