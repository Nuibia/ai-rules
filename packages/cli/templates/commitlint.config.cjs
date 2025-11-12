/**
 * 模板：commitlint 配置
 * 生成方式：由公共规则仓库的 CLI 工具写入目标项目根目录
 * 使用提示：
 * 1. 安装 commitlint：`yarn add -D @commitlint/cli`
 * 2. 在提交钩子中执行 `yarn commitlint --edit $1`
 */

module.exports = {
  parserPreset: {
    parserOpts: {
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

