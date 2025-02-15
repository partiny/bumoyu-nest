import { LinkCategory } from "./link-category/link-category.entity";
import * as dayjs from 'dayjs'
import { Link } from "./link-list/link.entity";

export interface LinkTreeDto {
  id: string;
  name: string;
  icon: string;
  sort: number | null;
  createTime: string;
  children?: Link[];
  userId?: string;
}

/**格式化链接分类及分类下所有链接 */
export function formatLinkList(categories: LinkCategory[]): LinkTreeDto[] {
  const formatList = categories.map(item => {
    const children = (item.links || []).map(sub => {
      delete sub.updatedBy
      sub.createTime = dayjs(sub.createTime).format('YYYY-MM-DD HH:mm:ss')
      return sub
    }).filter(sub => sub.type !== 'component').sort((a, b) => (a.sort ?? 9999) - (b.sort ?? 9999))
    return {
      id: item.id,
      name: item.name,
      icon: item.icon,
      sort: item.sort,
      createTime: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
      children
    }
  })
  return formatList.sort((a, b) => (a.sort ?? 9999) - (b.sort ?? 9999))
}