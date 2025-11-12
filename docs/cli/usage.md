---
title: CLI 使用指南
order: 1
---

# CLI 使用指南

> 当前 CLI 正在开发中，本页先行列出规划与约定，便于后续落地。

## 安装方式

```bash
yarn add -D ai-rules-cli
```

安装后可通过 `npx airules` 或在 `package.json` 的脚本中调用。

## 可用命令（迭代中）

- `airules list`：查看全部模板及默认写入路径。  
- `airules init [target]`：在目标目录批量写入模板，支持 `--force` 覆盖已有文件。  
- `airules apply <templateId> [target]`：单独写入某个模板，适合增量调整。  
- `airules update [target]`：规划中的功能，用于比对并更新已有文件（尚未实现）。

> 功能会持续扩展，命令定义以实际 CLI 输出为准，文档会同步更新。

## 写入规范示例

计划在首次版本中支持以下模板：

- `commitlint.config.cjs`：提交信息校验配置。  
- `cursor/commit-guidelines.md`：Cursor AI 指令模板。  
- `claude/commit-guidelines.md`：Claude AI 指令模板。

更多模板（例如 README 片段、测试覆盖规范）可在 CLI 发布后逐步扩展。

## 常见问题

1. **是否支持自定义输出路径？**  
   - 当前命令默认以 `target` 目录为根写入，后续会考虑提供额外路径参数。

2. **如何处理已有文件？**  
   - 默认遇到同名文件会跳过并提示，可通过 `--force` 强制覆盖，未来考虑提供备份模式。

文档会在 CLI 功能上线后第一时间更新，并补充实际示例与截图。

