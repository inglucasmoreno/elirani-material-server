import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class MueblesPlacasDTO {
  
  @ApiProperty()
  @IsNumber()
  readonly cantidad: number;
  
  @ApiProperty()
  @IsNumber()
  readonly mueble: number;
  
  @ApiProperty()
  @IsNumber()
  readonly tipo_placa_madera: number;
  
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly activo: boolean;
  
  @ApiProperty()
  @IsNumber()
  readonly creatorUser: number;
  
  @ApiProperty()
  @IsNumber()
  readonly updatorUser: number;

}