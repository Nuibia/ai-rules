#!/usr/bin/env node
/**
 * 复制仓库根目录的 rules 资源到 CLI 包内部，便于发布与运行。
 */
const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, '../../../rules');
const targetDir = path.resolve(__dirname, '../templates');

function collectRelativeFiles(dir, baseDir = dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const absolute = path.resolve(dir, entry.name);
      if (entry.isDirectory()) {
        return collectRelativeFiles(absolute, baseDir);
      }
      return path.relative(baseDir, absolute);
    });
}

function diffTemplates(source, target) {
  if (!fs.existsSync(target)) {
    return {
      missingInTarget: collectRelativeFiles(source),
      extraInTarget: [],
      changedFiles: [],
    };
  }

  const sourceFiles = collectRelativeFiles(source);
  const targetFiles = collectRelativeFiles(target);

  const missingInTarget = sourceFiles.filter(
    (file) => !targetFiles.includes(file),
  );
  const extraInTarget = targetFiles.filter(
    (file) => !sourceFiles.includes(file),
  );
  const changedFiles = sourceFiles.filter((file) => {
    if (!targetFiles.includes(file)) {
      return false;
    }
    const sourceBuffer = fs.readFileSync(path.resolve(source, file));
    const targetBuffer = fs.readFileSync(path.resolve(target, file));
    return !sourceBuffer.equals(targetBuffer);
  });

  return { missingInTarget, extraInTarget, changedFiles };
}

function validateTemplates() {
  const differences = diffTemplates(sourceDir, targetDir);
  const hasDifference =
    differences.missingInTarget.length > 0 ||
    differences.extraInTarget.length > 0 ||
    differences.changedFiles.length > 0;

  if (hasDifference) {
    console.error('[ai-rules-cli] 模板校验失败：');
    if (differences.missingInTarget.length > 0) {
      console.error(
        '  目标目录缺少以下文件：',
        differences.missingInTarget.join(', '),
      );
    }
    if (differences.extraInTarget.length > 0) {
      console.error(
        '  目标目录多出以下文件：',
        differences.extraInTarget.join(', '),
      );
    }
    if (differences.changedFiles.length > 0) {
      console.error(
        '  以下文件内容不一致：',
        differences.changedFiles.join(', '),
      );
    }
    process.exitCode = 1;
    return;
  }

  console.log('[ai-rules-cli] 模板校验通过。');
}

function ensureCopied() {
  if (!fs.existsSync(sourceDir)) {
    console.warn('[ai-rules-cli] 未找到根目录 rules，跳过复制。');
    return;
  }

  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.mkdirSync(targetDir, { recursive: true });
  fs.cpSync(sourceDir, targetDir, { recursive: true });
  console.log('[ai-rules-cli] 模板同步完成。');
}

try {
  const args = process.argv.slice(2);
  const checkOnly = args.includes('--check');

  if (checkOnly) {
    validateTemplates();
  } else {
    ensureCopied();
    validateTemplates();
  }
} catch (error) {
  console.error('[ai-rules-cli] 模板同步失败：', error);
  process.exitCode = 1;
}

