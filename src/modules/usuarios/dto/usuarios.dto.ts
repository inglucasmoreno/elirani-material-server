import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { USUARIOS_ROLES } from "src/constants";

export class UsuariosDTO {

    @ApiProperty()
    @IsString()
    readonly usuario: string;

    @ApiProperty()
    @IsString()
    readonly dni: string;

    @ApiProperty()
    @IsString()
    apellido: string;

    @ApiProperty()
    @IsString()
    nombre: string;

    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty()
    @IsEnum(USUARIOS_ROLES)
    @IsOptional()
    readonly role: USUARIOS_ROLES;

    @ApiProperty()
    @IsOptional()
    readonly permisos: any;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    readonly activo: boolean;

}