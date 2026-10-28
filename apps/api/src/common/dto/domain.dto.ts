import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class LocalizedStringDto {
  @ApiProperty({ description: 'Arabic text (default)' })
  @IsString()
  ar!: string;

  @ApiPropertyOptional({ description: 'French text' })
  @IsOptional()
  @IsString()
  fr?: string;

  @ApiPropertyOptional({ description: 'English text' })
  @IsOptional()
  @IsString()
  en?: string;
}

export class CreateArticleDto {
  @ApiProperty({ description: 'SKU / Stock Keeping Unit' })
  @IsString()
  sku!: string;

  @ApiProperty({ type: LocalizedStringDto })
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  name!: LocalizedStringDto;

  @ApiPropertyOptional({ type: LocalizedStringDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  description?: LocalizedStringDto;

  @ApiProperty({ description: 'Base price in TND' })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({ description: 'Discount price in TND' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @ApiPropertyOptional({ description: 'Available stock quantity' })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiProperty({ description: 'Education level ID' })
  @IsString()
  educationLevelId!: string;

  @ApiPropertyOptional({ enum: ['Q1', 'Q2', 'Q3', 'ALL_YEAR'] })
  @IsOptional()
  @IsEnum(['Q1', 'Q2', 'Q3', 'ALL_YEAR'])
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'ALL_YEAR';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  posterUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  samplePdfUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  publisher?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class PackItemDto {
  @ApiProperty()
  @IsString()
  articleId!: string;

  @ApiProperty({ default: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreatePackDto {
  @ApiProperty()
  @IsString()
  sku!: string;

  @ApiProperty({ type: LocalizedStringDto })
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  name!: LocalizedStringDto;

  @ApiPropertyOptional({ type: LocalizedStringDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  description?: LocalizedStringDto;

  @ApiProperty({ description: 'Pack selling price in TND' })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({ description: 'Discount price in TND' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @ApiProperty({ type: [PackItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackItemDto)
  items!: PackItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  posterUrl?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class CustomerDetailsDto {
  @ApiProperty()
  @IsString()
  fullName!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Tunisian phone number' })
  @IsString()
  phone!: string;

  @ApiProperty()
  @IsString()
  city!: string;

  @ApiProperty()
  @IsString()
  address!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instructions?: string;
}

export class CreateOrderItemDto {
  @ApiProperty({ enum: ['article', 'pack'] })
  @IsEnum(['article', 'pack'])
  type!: 'article' | 'pack';

  @ApiProperty({ description: 'Article or Pack ID' })
  @IsString()
  itemId!: string;

  @ApiProperty({ default: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: CustomerDetailsDto })
  @ValidateNested()
  @Type(() => CustomerDetailsDto)
  customer!: CustomerDetailsDto;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @ApiPropertyOptional({ description: 'Google reCAPTCHA token' })
  @IsOptional()
  @IsString()
  recaptchaToken?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: ['pending', 'in_progress', 'delivered', 'rejected'] })
  @IsEnum(['pending', 'in_progress', 'delivered', 'rejected'])
  status!: 'pending' | 'in_progress' | 'delivered' | 'rejected';

  @ApiPropertyOptional({ description: 'Mandatory reason if status is rejected' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

export class CreateReviewDto {
  @ApiPropertyOptional({ description: 'Article ID (omit for general store review)' })
  @IsOptional()
  @IsString()
  articleId?: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  rating!: number;

  @ApiProperty()
  @IsString()
  authorName!: string;

  @ApiProperty()
  @IsString()
  comment!: string;
}

export class CreateContactMessageDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsString()
  subject!: string;

  @ApiProperty()
  @IsString()
  message!: string;
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  password!: string;
}

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  password!: string;

  @ApiProperty()
  @IsString()
  fullName!: string;
}
