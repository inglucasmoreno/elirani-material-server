import { IUsuarios } from ".";

export interface ITiposMuebles {
  id: number;
  descripcion: string;
  placas: boolean;
  creatorUser: IUsuarios;
  updatorUser: IUsuarios;
}