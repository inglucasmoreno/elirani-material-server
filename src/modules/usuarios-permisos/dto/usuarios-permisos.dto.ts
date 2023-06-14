import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { USUARIOS_ROLES } from "src/constants";

export class UsuariosPermisosDTO {
  
  @ApiProperty()
  @IsNumber()
  readonly usuario: string;
  
  @ApiProperty()
  @IsString()
  readonly alcance: string;
  
  @ApiProperty()
  @IsEnum(USUARIOS_ROLES)
  readonly permiso: USUARIOS_ROLES;
  
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly activo: boolean;
  
  @ApiProperty()
  @IsNumber()
  readonly creatorUser: string;
  
  @ApiProperty()
  @IsNumber()
  readonly updatorUser: string;

}