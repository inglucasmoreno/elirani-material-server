import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class ObrasMaderaPasesDTO {
    
    @ApiProperty()      
    @IsNumber()
    readonly obra_madera: number;
    
    @ApiProperty()
    @IsNumber()
    readonly motivo: number;
    
    @ApiProperty()
    @IsString()
    readonly tipo: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly observacion: string;
    
    @ApiProperty()    
    @IsString()
    readonly etapa_anterior: string;
    
    @ApiProperty()
    @IsString()
    readonly etapa_actual: string;
    
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