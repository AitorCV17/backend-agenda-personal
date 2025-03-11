import { IsNotEmpty, IsOptional, IsString, IsISO8601, Length } from 'class-validator';

export class CreateEventDTO {
  @IsNotEmpty({ message: 'El título es requerido' })
  @Length(3, 100, { message: 'El título debe tener entre 3 y 100 caracteres' })
  titulo!: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  @Length(0, 500, { message: 'La descripción no puede exceder 500 caracteres' })
  descripcion?: string;

  @IsOptional()
  @IsString({ message: 'La ubicación debe ser un texto' })
  @Length(0, 100, { message: 'La ubicación no puede exceder 100 caracteres' })
  ubicacion?: string;

  @IsNotEmpty({ message: 'La fecha de inicio es requerida' })
  @IsISO8601({} as any, { message: 'Fecha de inicio inválida' })
  fechaInicio!: string;

  @IsNotEmpty({ message: 'La fecha de fin es requerida' })
  @IsISO8601({} as any, { message: 'Fecha de fin inválida' })
  fechaFin!: string;
}

export class UpdateEventDTO {
  @IsOptional()
  @IsNotEmpty({ message: 'El título no puede estar vacío' })
  @Length(3, 100, { message: 'El título debe tener entre 3 y 100 caracteres' })
  titulo?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  @Length(0, 500, { message: 'La descripción no puede exceder 500 caracteres' })
  descripcion?: string;

  @IsOptional()
  @IsString({ message: 'La ubicación debe ser un texto' })
  @Length(0, 100, { message: 'La ubicación no puede exceder 100 caracteres' })
  ubicacion?: string;

  @IsOptional()
  @IsISO8601({} as any, { message: 'Fecha de inicio inválida' })
  fechaInicio?: string;

  @IsOptional()
  @IsISO8601({} as any, { message: 'Fecha de fin inválida' })
  fechaFin?: string;
}
