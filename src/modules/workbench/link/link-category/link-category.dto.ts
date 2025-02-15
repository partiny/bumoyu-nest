import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class CategoryDto {
  @IsString({ message: '分类名称只能为字符串类型' })
  @IsNotEmpty({ message: '分类名称不能为空' })
  @ApiProperty({ description: '分类名称', example: '工作' })
  name: string;

  @IsString({ message: '分类图标只能为字符串类型' })
  @IsOptional()
  @ApiProperty({ description: '分类图标', example: 'https://example.com/icon.png', required: false })
  icon?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '排序', example: 164, required: false })
  sort?: number;
}

export class AddLinkCategoryDto extends CategoryDto {}

export class UpdateLinkCategoryDto extends CategoryDto {
  @ApiProperty({ description: '链接分类id', example: 123, type: 'string', required: true })
  @IsNotEmpty({ message: '链接分类id不能为空' })
  id: string
}

export class DeleteLinkCategoryDto extends PickType(UpdateLinkCategoryDto, ['id']) {}

export class GetLinkCategoryListDto {
  @ApiPropertyOptional({ description: '链接分类名称', example: '工作' })
  @IsOptional()
  name: string

  @ApiPropertyOptional({ description: '页码', example: 1, type: 'integer', default: 1 })
  @IsNumber(undefined, { message: 'pageNum 只能输入数字类型' })
  @IsOptional()
  pageNum: number

  @ApiPropertyOptional({ description: '每页数量', example: 10, type: 'integer', default: 10 })
  @IsNumber(undefined, { message: 'pageSize 只能输入数字类型' })
  @IsOptional()
  pageSize: number
}

export class UpdateOrderOfCategorysDto {
  @IsArray({ message: 'ids类型不对' })
  @ArrayMinSize(1, { message: 'ids不能为空数组' })
  @IsString({ each: true })
  ids: string[];
}