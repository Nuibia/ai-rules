---
title: 仓库概览
---

# 仓库概览

AI Rules 是一个聚合 AI 协作规范与工具的公共仓库，提供提交信息标准、AI 助手指令模板、可直接拷贝的配置文件，以及配套的命令行与文档站点。目标是帮助团队快速在不同项目间统一规范。

## 快速开始

1. 阅读「提交规范」了解 `<type>:<emoji> <subject>` 规则与 gitmoji 映射。  
2. 访问「CLI 使用」，使用 `airules` 命令将模板写入目标项目：  
   ```bash
   yarn add -D ai-rules-cli
   npx airules init
   ```  
3. 在「模板参考」查看 commitlint 配置与 AI 指令示例，按需调整。

## 功能一览

- **提交信息规范**：基于 gitmoji 精选类型与 emoji，对齐 commitlint。  
- **AI 指令模板**：面向 Cursor、Claude 等助手的执行指引，确保协作一致。  
- **CLI 工具**：一行命令把规范写入任意项目目录，支持覆盖或单项应用。  
- **文档站点**：使用 dumi 构建，随时查看规范、命令说明与示例。

## 开发与贡献

- 使用 `yarn docs:dev` 本地预览文档，`yarn docs:build` 生成静态站点。  
- 欢迎补充新的模板或规范，请遵循提交规则并提供测试验证。  
- 若有更多 AI 助手或工具的整合需求，可在 issue 中提出。

