---
title: 模板说明
order: 1
---

# 模板说明

`airules` CLI 提供一组可直接写入项目的模板文件，帮助团队快速对齐规范。本章节列出当前模板及其作用，便于在引入前了解内容结构。

## 模板列表

| 模板 ID | 目标路径 | 说明 |
| --- | --- | --- |
| `commitlint` | `commitlint.config.cjs` | commitlint 配置，包含 gitmoji 类型枚举与校验规则 |
| `cursor-guidelines` | `.cursor/rules/commit-guidelines.md` | Cursor AI 指令，指导助手遵循提交规范与协作流程 |
| `claude-guidelines` | `.claude/commit-guidelines.md` | Claude AI 指令，与 Cursor 模板语义一致 |

在 CLI 中使用 `airules list` 可以查看最新模板目录，或使用 `airules apply <模板ID>` 单独写入某个模板。

## 引入方式

```bash
yarn add -D ai-rules-cli
npx airules init           # 写入全部模板
npx airules apply commitlint --force  # 单独应用 commitlint 配置并覆盖
```

## 维护策略

- 模板内容维护在仓库根目录 `templates/` 下，更新后需要重新执行 `yarn workspace ai-rules-cli build` 以同步至 CLI 包。  
- 若你扩展了新的模板（例如针对其他 AI 助手），请补充文档说明并提交 PR。

