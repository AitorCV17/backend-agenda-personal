import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validateDTO(dtoClass: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(dtoClass, req.body);
    validate(dtoObject, { whitelist: true, forbidNonWhitelisted: true }).then((errors) => {
      if (errors.length > 0) {
        const messages = errors
          .map((error) => Object.values(error.constraints || {}))
          .flat()
          .join(', ');
        return res.status(400).json({ message: 'Errores de validación', errors: messages });
      }
      req.body = dtoObject;
      next();
    });
  };
}
