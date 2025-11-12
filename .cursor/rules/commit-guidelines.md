# Cursor 提交规范指令（模板）

> 说明：本文件由公共规则仓库 CLI 自动写入目标项目的 `.cursor/rules` 目录，可直接生效或按需微调。

## 提交信息要求

- 标题格式：`<type>:<emoji> <subject>`，`subject` 使用简体中文，长度 ≤150 字，无句号结尾。  
- 支持的 `type` 与 `emoji`（来源自 [gitmoji](https://gitmoji.js.org/)）：`feat:✨`、`fix:🐛`、`docs:📝`、`style:🎨`、`refactor:♻️`、`perf:⚡️`、`test:✅`、`build:🏗️`、`ci:👷`、`chore:🔨`、`revert:⏪️`、`hotfix:🚑️`、`security:🔒`、`localization:🌐`、`analytics:📈`、`deps:📦️`、`config:🔧`、`cleanup:🔥`、`release:🔖`、`wip:🚧`。  
- 标题下方可使用空行补充说明或脚注，保持中文。

## 协作流程

- **先方案后实现**：确定需求与实现步骤后再动手，逐项推进。  
- **复用优先**：参考现有业务与组件，遇到不明确的地方先询问。  
- **最小改动**：聚焦当前任务，避免额外重构。  
- **语言统一**：文档、注释、提交说明全部使用中文。

## 提交前验证

- 缺陷修复超过两次仍失败时，先增加关键日志定位问题，修复后移除。  
- 列出测试要点，推荐执行 `nvm use`、`yarn install`、`yarn test`。  
- 在提交前运行 `yarn commitlint --edit $1`，确保符合 `commitlint` 规则。

## 输出规范

- 描述变更时引用具体文件路径，避免大段代码粘贴。  
- 阶段性成果需汇报并等待确认再继续。  
- 若规则与项目现状冲突，暂停操作并请求决策。

> 提示：如需扩展更多 AI 助手模板，可在公共仓库的 `templates/` 下新增对应文件，并同步更新 CLI 写入逻辑。

