export interface RegisterUserDTO {
    nombre: string;
    email: string;
    password: string;
  }
  
  export interface LoginDTO {
    email: string;
    password: string;
  }
  
  export interface UpdateProfileDTO {
    nombre?: string;
    email?: string;
  }
  
  export interface CreateEventDTO {
    titulo: string;
    descripcion?: string;
    ubicacion?: string;
    fecha_inicio: Date | string;
    fecha_fin: Date | string;
  }
  
  export interface UpdateEventDTO {
    titulo?: string;
    descripcion?: string;
    ubicacion?: string;
    fecha_inicio?: Date | string;
    fecha_fin?: Date | string;
  }
  