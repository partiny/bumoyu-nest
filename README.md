## 项目简介

**不摸鱼**（[演示地址](https://bumoyu.cn)、[文档指南](https://bumoyu.cn/docs/)） 是一款个性化定制的导航网站，旨在帮助用户更高效地管理和访问常用网站和资源。目前主要提供聚合搜索和分类导航功能，未来还将添加更多实用工具，如备忘录、常用代码片段等。

目前，项目涉及的工程都已开源，欢迎大家 fork、star、issue、pr。

## 工程介绍

### bumoyu-nest

[Gitee 地址](https://gitee.com/partiny/bumoyu-nest) | [Github 地址](https://github.com/partiny/bumoyu-nest)

`bumoyu-nest` 是基于 NestJS + TypeORM + MySQL 等主流技术栈构建的后台工程。包含用户、角色和导航等核心功能，并集成了邮件发送（Mailer）、缓存（Redis）和 Excel 文件处理（xlsx）等功能。这个项目是整个产品的后端基础，确保了数据的安全性和高效处理。

## 版本依赖

本项目基于以下框架/类库（排名不分先后）开发完成，特别感谢😘~

- [NestJS](https://nestjs.com/)：NestJS 是一个用于构建高效、可扩展的Node.js服务器端应用程序的框架。
- [TypeORM](https://typeorm.io/)：TypeORM 是一个ORM，可以与多种数据库一起使用，并且支持TypeScript和JavaScript。
- [mysql2](https://github.com/sidorares/node-mysql2)：mysql2 是一个用于Node.js的MySQL客户端，提供比原生 mysql 包更好的性能和特性。
- [Nodemailer (Mailer)](https://nodemailer.com/about/)：Nodemailer 是一个非常易于使用的模块，用于通过Node.js发送电子邮件。
- [ioredis](https://github.com/luin/ioredis)：ioredis 是一个为Node.js设计的Redis客户端，由国人开发者子骅（Luin）开发，现在已被Redis官方收购。
- ...

篇幅有限无法逐一列举，也感谢文中未提到的其它依赖~

## 项目启动

```bash
# 克隆代码
# Gitee 地址
git clone https://gitee.com/partiny/bumoyu-nest.git
# Github 地址
git clone https://github.com/partiny/bumoyu-nest.git

# 切换目录
cd bumoyu-nest

# 安装 pnpm（已安装则跳过该步骤）
npm install pnpm -g

# 安装依赖
pnpm install

# 启动运行
pnpm start
```

## 支持一下

如果觉得框架不错，或者对你有用，可以去帮我点个 ⭐ Star，谢谢~~
