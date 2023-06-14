import { IObrasMadera, IObrasMaderaMotivosPases, IUsuarios } from ".";

export interface IObrasMaderaPases {
  id: number;  
  tipo: string; // Adelante o Atras
  observacion: string;
  etapa_anterior: string;
  etapa_actual: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
  obra_madera: IObrasMadera;
  motivo: IObrasMaderaMotivosPases;
  creatorUser: IUsuarios;
  updatorUser: IUsuarios;
}