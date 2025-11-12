/**
 * 通用 commitlint 配置
 * 用途：为跨项目共享的提交信息规范提供严格校验。
 * 使用方式：
 * 1. 将本文件复制到目标项目根目录（与 package.json 同级）。
 * 2. 安装 commitlint：`yarn add -D @commitlint/cli`.
 * 3. 在项目中运行 `yarn commitlint --edit $1`（可结合 husky/lefthook 等工具链）。
 */

module.exports = {
  parserPreset: {
    parserOpts: {
      // 限定标题结构：type + emoji + 空格 + subject
      headerPattern: /^(\w+):(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)\s.+$/u,
      headerCorrespondence: ['type', 'emoji', 'subject'],
    },
  },
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
        'hotfix',
        'security',
        'localization',
        'analytics',
        'deps',
        'config',
        'cleanup',
        'release',
        'wip',
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-max-length': [2, 'always', 150],
    'header-max-length': [2, 'always', 180],
  },
};

