# Claude 提交规范指令

本文件面向 Claude AI 助手，提供跨项目通用的提交信息与协作约束。请将本内容同步到目标项目的 `.claude.json` 或其他规则配置中。

> 使用 `airules` CLI 写入本模板时，会自动在 `.claude/CLAUDE.md` 中追加 `@import "./commit-guidelines.md"`，便于 Claude Code 直接加载；你仍可在该文件中继续追加自定义指令。

## 提交信息格式

- 标题必须符合 `类型:emoji 空格 标题` 结构，示例：`feat:✨ 新增订单中心页面`。  
- 标题描述使用简体中文，长度 ≤150 字，避免句号结尾。  
- 可在标题下以空行补充详情或脚注，同样保持中文。  
- 支持的类型与 emoji（来源自 [gitmoji](https://gitmoji.js.org/)）：`feat:✨`、`fix:🐛`、`docs:📝`、`style:🎨`、`refactor:♻️`、`perf:⚡️`、`test:✅`、`build:🏗️`、`ci:👷`、`chore:🔨`、`revert:⏪️`、`hotfix:🚑️`、`security:🔒`、`localization:🌐`、`analytics:📈`、`deps:📦️`、`config:🔧`、`cleanup:🔥`、`release:🔖`、`wip:🚧`。

## 协作原则

- 在着手编码前明确技术方案与执行步骤，逐项完成并及时汇报，等待确认后再进入下一阶段。  
- 优先复用现有代码与组件，遇到不确定时主动向维护者提问。  
- 所有说明、文档、代码注释与提交信息必须使用中文表达。  
- 遵循最小改动原则，除非得到明确指示，避免无关重构或格式化。

## 验证与测试

- 针对新增功能或缺陷修复列出关键测试场景，并在可行时执行 `nvm use`、`yarn install`、`yarn test`。  
- 推动在目标项目中集成 `commitlint`，使用 `rules/commitlint.config.cjs` 校验提交标题，例如在 CI 中执行 `yarn commitlint --edit $1`。  
- 如缺陷修复多次失败，先加入必要的日志或监控信息，解决后移除。

## 输出规范

- 在说明变更时明确涉及的文件路径，避免一次性粘贴过长代码。  
- 如遇规则冲突或实现方案存在多解，主动停止并寻求决策。  
- 对阶段性结果保持透明，及时同步正在执行的工作内容。

请在部署 Claude 助手时加载本指令，以确保跨项目获得一致的协作体验与提交质量。

