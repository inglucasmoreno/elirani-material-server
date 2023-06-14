import { IUsuarios } from ".";

export interface IClientes {
  id: number,
  descripcion: string;   
  tipo_identificacion: string;
  identificacion: string;
  telefono: string;
  direccion: string;
  email: string;
  activo: boolean;
  creatorUser: IUsuarios;
  updatorUser: IUsuarios;
}