import { IsNotEmpty, Length, IsEmail } from 'class-validator';

export class RegisterDTO {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @Length(3, 50, { message: 'El nombre debe tener entre 3 y 50 caracteres' })
  nombre!: string;

  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @Length(6, 100, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;
}

export class LoginDTO {
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password!: string;
}
