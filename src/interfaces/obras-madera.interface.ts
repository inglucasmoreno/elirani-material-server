import { IClientes } from "./clientes.interface";
import { IUsuarios } from "./usuarios.interface";

export interface IObrasMadera {
  id: number;
  cliente: IClientes;
  codigo: string;
  descripcion: string;
  direccion: string;
  estado: string;
  precio: number;
  fecha_inicio: Date;
  fecha_finalizacion: Date;
  fecha_finalizacion_estimada: Date;
  activo: boolean;
  creatorUser: IUsuarios;
  updatorUser: IUsuarios;
}