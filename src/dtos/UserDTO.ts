import { IsEmail, IsOptional, IsNotEmpty, Length } from 'class-validator';

/**
 * DTO para actualizar el perfil de usuario.
 * 
 * Permite actualizar el nombre y el email.
 */
export class UpdateUserDTO {
  
  /**
   * Nombre del usuario.
   * Opcional, pero si se envía no debe estar vacío y debe tener entre 3 y 50 caracteres.
   */
  @IsOptional()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @Length(3, 50, { message: 'El nombre debe tener entre 3 y 50 caracteres' })
  nombre?: string;

  /**
   * Email del usuario.
   * Opcional, pero si se envía debe ser un email válido.
   */
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;
}

/**
 * DTO para registrar un nuevo usuario.
 */
export class RegisterUserDTO {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(3, 50, { message: 'El nombre debe tener entre 3 y 50 caracteres' })
  nombre!: string;

  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @Length(6, 100, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;
}