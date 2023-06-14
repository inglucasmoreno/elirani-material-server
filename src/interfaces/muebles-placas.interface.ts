import { ITiposPlacasMadera, IUsuarios } from ".";

export interface IMueblesPlacas { 
  id: number;  
  cantidad: number;
  activo: boolean;  
  mueble: any;
  tipo_placa_madera: ITiposPlacasMadera;
  creatorUser: IUsuarios;
  updatorUser: IUsuarios;
}