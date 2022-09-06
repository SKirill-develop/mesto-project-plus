const ERROR_CODE = 409;

class DoubleError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE;
  }
}

export default DoubleError;
