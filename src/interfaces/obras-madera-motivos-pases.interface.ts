import { IUsuarios } from "./usuarios.interface";

export interface IObrasMaderaMotivosPases {
  id: number;  
  descripcion: string;
  pases: any;
  creatorUser: IUsuarios;
  updatorUser: IUsuarios;
}