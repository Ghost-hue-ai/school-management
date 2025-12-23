export class ApiError extends Error {
  status: number;
  success: false;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
    this.success = false;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
