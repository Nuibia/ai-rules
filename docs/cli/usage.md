---
title: CLI 使用指南
order: 1
---

# CLI 使用指南

`ai-rules-cli` 用于将提交规范与 AI 指令模板快速写入任何项目。以下内容帮助你完成安装、命令操作与常见问题排查。

## 安装方式

```bash
yarn add -D ai-rules-cli
```

安装后可通过 `npx airules` 或在 `package.json` 的脚本中调用。

```json
{
  "scripts": {
    "airules:init": "airules init",
    "airules:list": "airules list"
  }
}
```

## 命令总览

- `airules list`：列出可用模板、目标路径与描述。  
- `airules init [target]`：批量写入全部模板，支持 `--force` 覆盖已存在文件。  
- `airules apply <templateId> [target]`：按模板 ID 写入单个文件或目录，适合增量引入。  
- `airules update [target]`：规划中的功能，用于对比并更新已存在的模板文件（尚未实现）。

> 所有命令默认以当前工作目录为目标路径，可通过参数传入自定义目录。

## 示例演示

```bash
# 列出模板
npx airules list

# 写入全部模板到当前项目
npx airules init

# 单独写入 commitlint 配置（如已存在，可加 --force 覆盖）
npx airules apply commitlint --force
```

执行 `airules list` 将输出类似结果：

```text
模板目录：/path/to/ai-rules-cli/templates
commitlint → commitlint.config.cjs
  commitlint 提交信息校验配置
cursor-guidelines → .cursor/rules/commit-guidelines.md
  Cursor AI 指令模板
claude-guidelines → .claude/commit-guidelines.md
  Claude AI 指令模板，可按需嵌入配置文件
```

## 常见问题

1. **是否支持自定义输出路径？**  
   - 支持，命令参数 `airules init ./path/to/project` 可指定目标目录。

2. **如何处理已有文件？**  
   - 默认跳过并提示可用 `--force` 覆盖；后续计划提供备份或差异合并功能。

3. **模板更新后怎么办？**  
   - 在公共仓库更新模板后，执行 `yarn workspace ai-rules-cli build`，再在目标项目运行 `airules init --force` 或 `airules apply <templateId> --force` 进行同步。

如需查看模板详情，可前往「模板说明」章节或直接浏览 `templates/` 目录。

