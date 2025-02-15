import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ReqContext, RequestContext } from "@src/core/decorators";
import { AddUserDto, AssignRoleToUserDto, DeleteUserDto, GetUserInfoByIdDto, GetUserListDto, UpdateUserDto, UpdateUserStatusDto } from "./user.dto";

@ApiTags('用户')
@Controller('user')
export default class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Post('add-user')
  @ApiOperation({ summary: '新增用户' })
  async addUser(@ReqContext() ctx: RequestContext, @Body() dto: AddUserDto) {
    return this.userService.addUser(ctx, dto)
  }

  @Post('update-user')
  @ApiOperation({ summary: '修改用户信息' })
  async updateUser(@ReqContext() ctx: RequestContext, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(ctx, dto)
  }

  @Post('update-user-status')
  @ApiOperation({ summary: '修改用户状态' })
  async updateUserStatus(@ReqContext() ctx: RequestContext, @Body() dto: UpdateUserStatusDto) {
    return this.userService.updateUserStatus(ctx, dto)
  }

  @Post('delete-user')
  @ApiOperation({ summary: '删除用户' })
  async deleteUser(@Body() dto: DeleteUserDto) {
    return this.userService.deleteUser(dto)
  }

  @Post('get-user-list')
  @ApiOperation({ summary: '获取用户列表' })
  async getUserList(@Body() dto: GetUserListDto) {
    return this.userService.getUserList(dto)
  }

  @ApiOperation({ summary: '获取用户详情信息' })
  @Post('get-user-info-by-id')
  async getUserInfoById(@Body() dto: GetUserInfoByIdDto) {
    return this.userService.getUserInfoById(dto)
  }

  @ApiOperation({ summary: '为用户分配角色' })
  @Post('assign-role-to-user')
  async assignRoleToUser(@Body() dto: AssignRoleToUserDto) {
    return this.userService.assignRoleToUser(dto)
  }
}