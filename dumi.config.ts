import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    name: 'AI Rules',
    nav: [
      { title: '指南', link: '/guides/' },
      { title: 'CLI 使用', link: '/docs/cli/usage' },
      { title: '模板参考', link: '/docs/templates/overview' },
    ],
  },
  locales: [
    {
      id: 'zh-CN',
      name: '中文',
      suffix: '',
    },
  ],
  resolve: {
    docDirs: ['docs'],
  },
  hash: true,
});

