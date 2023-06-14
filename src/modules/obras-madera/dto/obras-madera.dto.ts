import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class ObrasMaderaDTO {

    @ApiProperty()
    @IsString()
    readonly codigo: string;

    @ApiProperty()
    @IsString()
    readonly descripcion: string;

    @ApiProperty()
    @IsString()
    readonly direccion: string;

    @ApiProperty()
    @IsNumber()
    readonly cliente: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly estado: string;

    @ApiProperty()
    @IsString()
    readonly fecha_inicio: string;

    @ApiProperty()
    @IsString()
    readonly fecha_finalizacion_estimada: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly fecha_finalizacion: string;

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