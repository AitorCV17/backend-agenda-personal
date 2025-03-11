export class CustomError extends Error {
  status: number;  // Añadimos la propiedad status
  code: string;    // Añadimos la propiedad code

  constructor(message: string, statusCode: number, errorCode: string) {
    super(message);
    this.status = statusCode;
    this.code = errorCode;
  }
}
