import { IUsuarios } from ".";

export interface IOrdenesMantenimientoMadera {
  id: number;  
  fecha: Date;
  observaciones: string;
  obra_madera: any;
  precio: number;
  activo: boolean;
  creatorUser: IUsuarios;
  updatorUser: IUsuarios;
}