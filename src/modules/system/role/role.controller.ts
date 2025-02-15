import { Body, Controller, Post } from "@nestjs/common";
import { RoleService } from "./role.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AddRoleDto, DeleteRoleDto, GetRoleListDto, UpdateRoleDto } from "./role.dto";

@ApiTags('角色')
@Controller('role')
export default class RoleController {
  constructor(
    private readonly roleService: RoleService
  ) {}

  @Post('add-role')
  @ApiOperation({ summary: '新增角色' })
  async addRole(@Body() dto: AddRoleDto) {
    return this.roleService.addRole(dto)
  }

  @Post('update-role')
  @ApiOperation({ summary: '修改角色信息' })
  async updateRole(@Body() dto: UpdateRoleDto) {
    return this.roleService.updateRole(dto)
  }

  @Post('delete-role')
  @ApiOperation({ summary: '删除角色' })
  async deleteRole(@Body() dto: DeleteRoleDto) {
    return this.roleService.deleteRole(dto)
  }

  @Post('get-role-list')
  @ApiOperation({ summary: '获取角色列表' })
  async getRoleList(@Body() dto: GetRoleListDto) {
    return this.roleService.getRoleList(dto)
  }
}