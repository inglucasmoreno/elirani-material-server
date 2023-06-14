import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class OrdenesMantenimientoMaderaDTO {
  
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly observaciones: string;
  
  @ApiProperty()
  @IsString()
  readonly fecha: string;
  
  @ApiProperty()
  @IsNumber()
  readonly obra_madera: number;
  
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly precio: number;
  
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