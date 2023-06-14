import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class TiposMueblesDTO {
    
    @ApiProperty()
    @IsString()
    readonly descripcion: string;
    
    @ApiProperty()
    @IsBoolean()
    readonly placas: boolean;
    
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