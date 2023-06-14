import { IUsuarios } from "./usuarios.interface";

export interface ITiposPlacasMadera { 
  id: number;  
  codigo: string;
  descripcion: string;
  activo: boolean;
  creatorUser: IUsuarios;
  updatorUser: IUsuarios;
}