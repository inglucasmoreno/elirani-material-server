import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class MueblesDTO {

  @ApiProperty()
  @IsNumber()
  readonly tipo_mueble: number;

  @ApiProperty()
  @IsArray()
  readonly placas: any[];

  @ApiProperty()
  @IsNumber()
  readonly obra_madera: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly observaciones: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly muebleConPlacas: boolean;

  @ApiProperty()
  @IsNumber()
  readonly precio: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly estado: string;

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