import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  IsIn, 
  IsUrl, 
  IsArray,
  ValidateNested,
  ArrayMinSize
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { UpdateLinkCategoryDto } from '../link-category/link-category.dto';
import { Type } from 'class-transformer';

export class LinkDto {
  @IsString({ message: '链接名称只能为字符串类型' })
  @IsNotEmpty({ message: '链接名称不能为空' })
  @ApiProperty({ description: '链接名称', example: '百度' })
  name: string;

  @IsString({ message: '链接地址只能为字符串类型' })
  @IsNotEmpty({ message: '链接地址不能为空' })
  @IsUrl()
  @ApiProperty({ description: '链接地址', example: 'https://baidu.com' })
  url: string;

  @IsString({ message: '链接背景图只能为字符串类型' })
  @IsOptional()
  @ApiProperty({ description: '链接背景图', example: 'https://example.com/bg.png', required: false })
  src?: string;

  @IsString({ message: '链接类型只能为字符串类型' })
  @IsIn(['text', 'icon', 'component'])
  @IsOptional()
  @ApiProperty({ description: '链接类型', example: 'text', enum: ['text', 'icon', 'component'] })
  type?: 'text' | 'icon' | 'component';

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '未定义属性', example: 164, required: false })
  view?: number;

  @IsString({ message: '链接背景颜色只能为字符串类型' })
  @IsOptional()
  @ApiProperty({ description: '链接背景颜色', example: '#1681ff', required: false })
  backgroundColor?: string;

  @IsString({ message: '链接简称只能为字符串类型' })
  @IsOptional()
  @ApiProperty({ description: '链接简称', example: '易理货-测', required: false })
  iconText?: string;

  @IsString({ message: '链接类别只能为字符串类型' })
  @IsNotEmpty({ message: '链接所属的类别ID不能为空' })
  @ApiProperty({ description: '链接所属的类别ID', example: 1 })
  categoryId: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '排序', example: 164, required: false })
  sort?: number;
}

export class AddLinkDto extends LinkDto {}

export class UpdateLinkDto extends LinkDto {
  @ApiProperty({ description: '链接id', example: 123, type: 'string', required: true })
  @IsNotEmpty({ message: '链接id不能为空' })
  id: string
}

export class DeleteLinkDto extends PickType(UpdateLinkDto, ['id']) {}

export class GetLinkListDto {
  @ApiPropertyOptional({ description: '链接名称', example: '工作' })
  @IsOptional()
  name: string

  @ApiPropertyOptional({ description: '链接分类id', example: 'xxxx-xxxx-xxxx-xxxx' })
  @IsOptional()
  categoryId: string

  @ApiPropertyOptional({ description: '页码', example: 1, type: 'integer', default: 1 })
  @IsNumber(undefined, { message: 'pageNum 只能输入数字类型' })
  @IsOptional()
  pageNum: number

  @ApiPropertyOptional({ description: '每页数量', example: 10, type: 'integer', default: 10 })
  @IsNumber(undefined, { message: 'pageSize 只能输入数字类型' })
  @IsOptional()
  pageSize: number
}

export class AddLinkFromItabDto extends UpdateLinkCategoryDto {
  @IsOptional()
  children?: UpdateLinkDto[]
}

export class BatchAddLinksFromItabDto {
  list: AddLinkFromItabDto[]
}

export class UpdateOrderOfLinksDto {
  @IsNotEmpty({ message: '链接所属的类别ID不能为空' })
  categoryId: string;

  @IsArray({ message: 'linkIds类型不对' })
  @ArrayMinSize(1, { message: 'linkIds不能为空数组' })
  @IsString({ each: true })
  linkIds: string[];
}