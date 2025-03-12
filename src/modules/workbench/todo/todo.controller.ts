import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { TodoService } from "./todo.service";
import { CreateTodoDto, TodoQueryDto, UpdateTodoDto } from "./todo.dto";
import { RequestContext } from "@src/core/decorators";

@ApiTags('待办事项')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('add-todo')
  @ApiOperation({ summary: '创建待办事项' })
  create(@Req() { user }: RequestContext, @Body() dto: CreateTodoDto) {
    return this.todoService.addTodo(user, dto);
  }

  @Post('update-todo')
  @ApiOperation({ summary: '更新待办事项' })
  update(
    @Req() { user }: RequestContext,
    @Body() dto: UpdateTodoDto
  ) {
    return this.todoService.updateTodo(user, dto);
  }

  @Post('delete-todo')
  @ApiOperation({ summary: '删除待办事项' })
  delete(@Req() { user }: RequestContext, @Body() { id }: { id: string }) {
    return this.todoService.deleteTodo(user, id);
  }

  @Get('get-all-todo-list')
  @ApiOperation({ summary: '获取所有待办事项（不带分页）' })
  async getAllTodoList(
    @Req() { user }: RequestContext,
    @Query() dto: Omit<TodoQueryDto, 'pageNum'|'pageSize'>
  ) {
    return this.todoService.getAllTodoList(user, dto)
  }

  @Get('get-todo-list')
  @ApiOperation({ summary: '获取待办事项列表' })
  getList(@Req() { user }: RequestContext, @Query() dto: TodoQueryDto) {
    return this.todoService.getTodoList(user, dto);
  }
}