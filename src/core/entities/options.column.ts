import type { ColumnOptions } from "typeorm"

// @Column装饰器常用选项集合 - 逻辑删除
export const optionDelete: ColumnOptions = {
  type: 'tinyint',
  comment: '逻辑删除标志位 1删除 0未删除',
  select: false,
  default: 0
}