#!/usr/bin/env node
/**
 * 复制仓库根目录的 templates 资源到 CLI 包内部，便于发布与运行。
 */
const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, '../../../templates');
const targetDir = path.resolve(__dirname, '../templates');

function ensureCopied() {
  if (!fs.existsSync(sourceDir)) {
    console.warn('[ai-rules-cli] 未找到根目录 templates，跳过复制。');
    return;
  }

  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.mkdirSync(targetDir, { recursive: true });
  fs.cpSync(sourceDir, targetDir, { recursive: true });
  console.log('[ai-rules-cli] 模板同步完成。');
}

try {
  ensureCopied();
} catch (error) {
  console.error('[ai-rules-cli] 模板同步失败：', error);
  process.exitCode = 1;
}

