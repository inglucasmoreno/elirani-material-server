import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CambioPasswordDTO {
  
  @ApiProperty()  
  @IsString()
  readonly password_actual: string;
  
  @ApiProperty()
  @IsString()
  readonly password_nuevo: string;
  
  @ApiProperty()
  @IsString()
  readonly password_nuevo_repetir: string;

}