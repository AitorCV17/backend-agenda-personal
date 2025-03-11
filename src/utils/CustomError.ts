// src/utils/CustomError.ts
export class CustomError extends Error {
    public status: number;
    public code: string;
  
    constructor(message: string, status: number = 500, code: string = 'INTERNAL_ERROR') {
      super(message);
      this.status = status;
      this.code = code;
      Object.setPrototypeOf(this, CustomError.prototype);
    }
  }
  