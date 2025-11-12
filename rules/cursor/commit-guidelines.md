# Cursor 提交规范指令

本文件用于指导 Cursor AI 助手在任意项目中遵循统一的提交信息规则和协作流程。请在目标项目的 `.cursor/rules` 中引用本文件内容或直接复制使用。

## 提交信息要求

- 提交标题固定格式：`<type>:<emoji> <subject>`，`subject` 使用简体中文，长度 ≤150 字，禁止句号结尾。  
- 支持的 `type` 与 `emoji` 列表（参考 [gitmoji](https://gitmoji.js.org/) 标准）：`feat:✨`、`fix:🐛`、`docs:📝`、`style:🎨`、`refactor:♻️`、`perf:⚡️`、`test:✅`、`build:🏗️`、`ci:👷`、`chore:🔨`、`revert:⏪️`、`hotfix:🚑️`、`security:🔒`、`localization:🌐`、`analytics:📈`、`deps:📦️`、`config:🔧`、`cleanup:🔥`、`release:🔖`、`wip:🚧`。  
- 标题下方可使用空行追加说明或脚注，同样保持中文表达。

## 协作流程

- **先方案后实现**：确认需求与实现步骤后再开始修改代码，逐步执行，不跨步骤“顺便处理”。  
- **复用优先**：优先参考现有业务或组件实现，不确定时先询问维护者。  
- **最小改动**：确保改动集中于当前任务范围，避免额外重构。  
- **语言统一**：所有注释、文档、提交说明均使用中文。

## 提交前验证

- 若涉及缺陷修复，连续尝试两次仍失败，应先添加关键日志定位问题，修复完成后移除。  
- 为新增功能或修复列出测试要点，推荐执行 `nvm use`、`yarn install`、`yarn test`。  
- 引导人工或 CI 环境运行 `yarn commitlint --edit $1`，确保提交信息通过 `rules/commitlint.config.cjs` 的校验。

## 输出要求

- 在描述变更时引用实际文件路径（如 `src/module/index.ts`），避免长篇代码粘贴。  
- 汇报阶段性进展并等待确认再继续下一步。  
- 若遇到规则与项目现实冲突，应暂停操作并请求决策，不自行妥协。

请在使用 Cursor 时将本指令加载到对应项目的 `.cursor/rules` 中，以获得一致的协作体验。

