import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class ClientesDTO {

    @ApiProperty()
    @IsString()
    readonly descripcion: string;

    @ApiProperty()
    @IsString()
    readonly tipo_identificacion: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly identificacion: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly telefono: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly direccion: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly email: string;

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