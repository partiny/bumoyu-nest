import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { TodoPriority, TodoStatus, TodoType } from "./todo.entity";

export class CreateTodoDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100) // 增加标题长度限制
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ enum: TodoType })
  @IsEnum(TodoType)
  @IsOptional()
  type?: TodoType;

  @ApiProperty()
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  dateTime?: Date;

  @ApiPropertyOptional({ enum: TodoPriority })
  @IsEnum(TodoPriority)
  @IsOptional()
  priority?: TodoPriority;
}

export class UpdateTodoDto extends CreateTodoDto {
  @ApiPropertyOptional({ enum: TodoStatus })
  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;

  @ApiProperty({ description: '待办id', example: 123, type: 'string', required: true })
  @IsNotEmpty({ message: '待办id不能为空' })
  id: string
}

export class TodoQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  pageNum?: number;

  @ApiPropertyOptional()
  @IsOptional()
  pageSize?: number;

  @ApiPropertyOptional({ enum: TodoStatus })
  @IsOptional()
  status?: TodoStatus;

  @ApiPropertyOptional({ enum: TodoType })
  @IsOptional()
  type?: TodoType;
}