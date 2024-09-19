import { IsNotEmpty, IsString, Validate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';


export class AssetDto {

  @IsNumber()
  @IsNotEmpty()
  AppraisedValue: number;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsNumber()
  @IsNotEmpty()
  size: number;

  @IsString()
  @IsNotEmpty()
  docType: string;


}
