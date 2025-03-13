import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Todo } from "./todo.entity";
import { CreateTodoDto, TodoQueryDto, UpdateTodoDto } from "./todo.dto";
import { PayloadUser } from "@src/core/decorators";
import { ApiResult } from "@src/core/filters";
import * as dayjs from "dayjs";

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>
  ) {}

  private apiResult = new ApiResult();

  /**创建待办 */
  async addTodo(user: PayloadUser, dto: CreateTodoDto) {
    const newTodo = this.todoRepository.create({
      ...dto,
      userId: user.userId
    });
    await this.todoRepository.save(newTodo);
    return this.apiResult.message(newTodo);
  }

  /**修改待办 */
  async updateTodo(user: PayloadUser, dto: UpdateTodoDto) {
    const todo = await this.getTodoById(dto.id, user.userId);
    const updated = await this.todoRepository.save({ ...todo, ...dto });
    return this.apiResult.message(updated);
  }

  async deleteTodo(user: PayloadUser, id: string) {
    const todo = await this.getTodoById(id, user.userId);
    if (!todo) {
      throw new NotFoundException('待办不存在');
    }
    try {
      await this.todoRepository.update(id, { isDelete: 1 });
      return this.apiResult.message(null, 0, '删除成功');
    } catch (e) {
      throw new InternalServerErrorException('删除失败');
    }
  }

  /**获取所有待办事项（不带分页） */
  async getAllTodoList(user: PayloadUser, dto: Omit<TodoQueryDto, 'pageNum'|'pageSize'>) {
    const qb = this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.userId = :userId', { userId: user.userId })
      .andWhere('todo.isDelete = 0');
  
    if (dto.status) qb.andWhere('todo.status = :status', { status: dto.status });
    if (dto.type) qb.andWhere('todo.type = :type', { type: dto.type });
  
    const list = await qb
      .orderBy('todo.createTime', 'DESC')
      .getMany();
  
    return this.apiResult.message(list.map(item => ({
      ...item,
      startTime: item.startTime ? dayjs(item.startTime).format('YYYY-MM-DD HH:mm') : null,
      endTime: item.endTime ? dayjs(item.endTime).format('YYYY-MM-DD HH:mm') : null
    })));
  }
  async getTodoList(user: PayloadUser, dto: TodoQueryDto) {
    const { pageNum = 1, pageSize = 10, ...query } = dto;
    const qb = this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.userId = :userId', { userId: user.userId })
      .andWhere('todo.isDelete = 0');

    if (query.status) qb.andWhere('todo.status = :status', { status: query.status });
    if (query.type) qb.andWhere('todo.type = :type', { type: query.type });

    const [list, total] = await qb
      .orderBy('todo.createTime', 'DESC')
      .skip((pageNum - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return this.apiResult.message({
      list,
      total,
      pageNum,
      pageSize
    });
  }

  private async getTodoById(id: string, userId: string) {
    const todo = await this.todoRepository.findOne({ 
      where: { id, userId, isDelete: 0 } 
    });
    if (!todo) throw new NotFoundException('待办事项不存在');
    return todo;
  }
}