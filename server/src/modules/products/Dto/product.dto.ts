import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, ValidateNested, IsObject, IsEnum, IsDate, IsUUID, IsEmail, IsUrl, IsNotEmpty, Length, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateEmiPlanDto {
  @IsNotEmpty()
  @IsString()
  readonly lender: string;

  @IsNotEmpty()
  @IsNumber()
  readonly months: number;

  @IsNotEmpty()
  @IsNumber()
  readonly roi: number;

  @IsNumber()
  @IsOptional()
  readonly cashback?: number;
}

export class CreateAttributeDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsArray()
  @IsString({ each: true })
  readonly values: string[];
}

export class CreateSkuDto {
  @IsNotEmpty()
  @IsString()
  readonly storage: string;

  @IsNotEmpty()
  @IsString()
  readonly color: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  readonly stock: number;

  @IsString()
  @IsOptional()
  readonly finish?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly images?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEmiPlanDto)
  @IsOptional()
  readonly emiPlans?: CreateEmiPlanDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly paymentOptions?: string[];
}

export class AddProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  readonly slug: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  readonly brand: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly processor?: string;

  @IsOptional()
  @IsString()
  readonly battery?: string;

  @IsOptional()
  @IsString()
  readonly charging?: string;

  @IsOptional()
  @IsString()
  readonly networks?: string;

  @IsOptional()
  @IsString()
  readonly camera?: string;

  @IsOptional()
  @IsString()
  readonly display?: string;

  @IsOptional()
  @IsString()
  readonly sound?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttributeDto)
  @IsOptional()
  readonly attributes?: CreateAttributeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSkuDto)
  @IsOptional()
  readonly skus?: CreateSkuDto[];
}

export class OperativeProductDto extends PartialType(AddProductDto) { }
