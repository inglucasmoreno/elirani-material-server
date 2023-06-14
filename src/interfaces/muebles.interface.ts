import { IObrasMadera, ITiposMuebles, IUsuarios } from ".";

export interface IMuebles {
  id: number;  
  observaciones: string;
  precio: number;
  estado: string;
  activo: boolean;
  obra_madera: IObrasMadera;
  tipo_mueble: ITiposMuebles;
  creatorUser: IUsuarios;
  updatorUser: IUsuarios;
}