import { Command } from 'commander';
import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';
import kleur from 'kleur';
import pkg from '../package.json';

const { cyan, green, red, yellow } = kleur;

type TemplateDescriptor = {
  id: string;
  source: string;
  target: string;
  description: string;
  aliases?: string[];
};

const CLAUDE_TEMPLATE_ID = 'claude';
const CLAUDE_LEGACY_ID = 'claude-guidelines';
const CLAUDE_DIRECTORY = '.claude';
const CLAUDE_GUIDELINE_FILENAME = 'commit-guidelines.md';
const CLAUDE_CONFIG_FILENAME = 'CLAUDE.md';
const CLAUDE_IMPORT_SNIPPET = '@import "./commit-guidelines.md"';

const CURSOR_TEMPLATE_ID = 'cursor';
const CURSOR_LEGACY_ID = 'cursor-guidelines';

const TEMPLATE_CATALOG: TemplateDescriptor[] = [
  {
    id: 'commitlint',
    source: 'commitlint.config.cjs',
    target: 'commitlint.config.cjs',
    description: 'commitlint 提交信息校验配置',
  },
  {
    id: CURSOR_TEMPLATE_ID,
    source: path.join('cursor', 'commit-guidelines.md'),
    target: path.join('.cursor', 'rules', 'commit-guidelines.md'),
    description: 'Cursor AI 指令模板',
    aliases: [CURSOR_LEGACY_ID],
  },
  {
    id: CLAUDE_TEMPLATE_ID,
    source: path.join('claude', CLAUDE_GUIDELINE_FILENAME),
    target: path.join(CLAUDE_DIRECTORY, CLAUDE_GUIDELINE_FILENAME),
    description: 'Claude AI 指令模板，可按需嵌入配置文件',
    aliases: [CLAUDE_LEGACY_ID],
  },
];

const TEMPLATE_ALIAS_MAP = TEMPLATE_CATALOG.reduce<Record<string, string>>(
  (acc, descriptor) => {
    acc[descriptor.id] = descriptor.id;
    if (descriptor.aliases) {
      descriptor.aliases.forEach((alias) => {
        acc[alias] = descriptor.id;
      });
    }
    return acc;
  },
  {},
);

const SHORTCUT_COMMANDS: Array<{
  name: string;
  templateId: string;
  description: string;
}> = [
  {
    name: CURSOR_TEMPLATE_ID,
    templateId: CURSOR_TEMPLATE_ID,
    description: '写入 Cursor AI 指令模板（等价于 `airules apply cursor`）',
  },
  {
    name: CLAUDE_TEMPLATE_ID,
    templateId: CLAUDE_TEMPLATE_ID,
    description: '写入 Claude AI 指令模板（等价于 `airules apply claude`）',
  },
  {
    name: 'commitlint',
    templateId: 'commitlint',
    description: '写入 commitlint 配置模板（等价于 `airules apply commitlint`）',
  },
];

const program = new Command();

program
  .name('airules')
  .description('AI 协作规范模板写入工具')
  .version(pkg.version);

async function ensureTemplateRoot(): Promise<string> {
  const candidatePaths = [
    path.resolve(__dirname, '../templates'),
    path.resolve(__dirname, '../../templates'),
    path.resolve(__dirname, '../../../rules'),
    path.resolve(process.cwd(), 'templates'),
    path.resolve(process.cwd(), 'rules'),
  ];

  for (const candidate of candidatePaths) {
    try {
      const stat = await fs.stat(candidate);
      if (stat.isDirectory()) {
        return candidate;
      }
    } catch {
      // ignore
    }
  }

  throw new Error('未找到模板目录，请确认已执行构建或同步 rules 模板资源。');
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function copyTemplate(
  templateRoot: string,
  descriptor: TemplateDescriptor,
  targetDir: string,
  force: boolean,
): Promise<{ skipped: boolean; targetPath: string }> {
  const srcPath = path.join(templateRoot, descriptor.source);
  const destPath = path.join(targetDir, descriptor.target);

  if (!(await pathExists(srcPath))) {
    throw new Error(`模板缺失：${descriptor.id}`);
  }

  const destDir = path.dirname(destPath);
  await fs.mkdir(destDir, { recursive: true });

  if (!force && (await pathExists(destPath))) {
    return { skipped: true, targetPath: destPath };
  }

  const content = await fs.readFile(srcPath);
  await fs.writeFile(destPath, content);
  return { skipped: false, targetPath: destPath };
}

async function applyTemplateById(
  templateId: string,
  targetDir: string,
  force: boolean,
): Promise<void> {
  const normalizedId = TEMPLATE_ALIAS_MAP[templateId] ?? templateId;
  const descriptor = TEMPLATE_CATALOG.find((tpl) => tpl.id === normalizedId);
  if (!descriptor) {
    console.error(red(`未找到模板：${templateId}`));
    console.log(
      `可用模板：${TEMPLATE_CATALOG.map((tpl) => tpl.id).join(', ')}`,
    );
    process.exitCode = 1;
    return;
  }

  if (templateId !== normalizedId) {
    console.log(
      yellow(`提示：模板 ${templateId} 已重命名为 ${normalizedId}，请更新命令。`),
    );
  }

  const destination = path.resolve(process.cwd(), targetDir);
  const templateRoot = await ensureTemplateRoot();
  const forceFlag = Boolean(force);

  try {
    const { skipped, targetPath } = await copyTemplate(
      templateRoot,
      descriptor,
      destination,
      forceFlag,
    );

    if (descriptor.id === CLAUDE_TEMPLATE_ID) {
      await syncClaudeConfig(destination);
    }

    if (skipped) {
      console.log(
        yellow(
          `跳过：${descriptor.id}（${targetPath} 已存在，使用 --force 强制覆盖）`,
        ),
      );
    } else {
      console.log(green(`写入：${descriptor.id} → ${targetPath}`));
    }
  } catch (error) {
    console.error(red(`写入失败：${(error as Error).message}`));
    process.exitCode = 1;
  }
}

async function syncClaudeConfig(targetDir: string): Promise<void> {
  const claudeDir = path.join(targetDir, CLAUDE_DIRECTORY);
  const guidelinePath = path.join(claudeDir, CLAUDE_GUIDELINE_FILENAME);

  if (!(await pathExists(guidelinePath))) {
    return;
  }

  const configPath = path.join(claudeDir, CLAUDE_CONFIG_FILENAME);
  await fs.mkdir(claudeDir, { recursive: true });

  if (!(await pathExists(configPath))) {
    const defaultContent = [
      '# Claude 项目规则',
      '',
      CLAUDE_IMPORT_SNIPPET,
      '',
      '> 说明：该文件由 airules CLI 自动生成，可在此追加其他项目指令。',
      '',
    ].join('\n');
    await fs.writeFile(configPath, defaultContent, 'utf8');
    console.log(
      cyan(
        `创建：${path.relative(
          targetDir,
          configPath,
        )}（已包含 Claude 模板引用）`,
      ),
    );
    return;
  }

  const existingContent = await fs.readFile(configPath, 'utf8');
  if (!existingContent.includes(CLAUDE_IMPORT_SNIPPET)) {
    const nextContent = `${existingContent.trimEnd()}\n\n${CLAUDE_IMPORT_SNIPPET}\n`;
    await fs.writeFile(configPath, nextContent, 'utf8');
    console.log(
      cyan(
        `更新：${path.relative(
          targetDir,
          configPath,
        )}（追加 Claude 模板引用）`,
      ),
    );
  }
}

program
  .command('list')
  .description('列出可用模板')
  .action(async () => {
    const templateRoot = await ensureTemplateRoot();
    console.log(cyan(`模板目录：${templateRoot}`));
    TEMPLATE_CATALOG.forEach((item) => {
      const aliasText = item.aliases?.length
        ? `（别名：${item.aliases.join(', ')}）`
        : '';
      console.log(
        `${green(item.id)}${aliasText} → ${item.target}\n  ${item.description}`,
      );
    });
  });

program
  .command('init [targetDir]')
  .description('将全部模板写入目标目录')
  .option('-f, --force', '允许覆盖已存在的文件', false)
  .action(async (targetDir = '.', options: { force?: boolean }) => {
    const destination = path.resolve(process.cwd(), targetDir);
    const templateRoot = await ensureTemplateRoot();
    const force = Boolean(options.force);

    console.log(cyan(`目标目录：${destination}`));

    const results = await Promise.all(
      TEMPLATE_CATALOG.map(async (tpl) => {
        const { skipped, targetPath } = await copyTemplate(
          templateRoot,
          tpl,
          destination,
          force,
        );
        if (skipped) {
          console.log(yellow(`跳过：${tpl.id}（${targetPath} 已存在）`));
        } else {
          console.log(green(`写入：${tpl.id} → ${targetPath}`));
        }
        return { descriptor: tpl, skipped, targetPath };
      }),
    );

    const claudeTemplateResult = results.find(
      (item) => item.descriptor.id === CLAUDE_TEMPLATE_ID,
    );
    if (claudeTemplateResult) {
      await syncClaudeConfig(destination);
    }

    console.log('');
    console.log(
      green(
        '完成 🎉 请在目标项目中执行 `yarn add -D @commitlint/cli` 并配置提交钩子。',
      ),
    );
    console.log(
      '如需单独写入某个模板，可后续使用 `airules apply <模板ID>`（开发中）。',
    );
  });

program
  .command('apply <templateId> [targetDir]')
  .description('按模板 ID 写入单个文件或目录')
  .option('-f, --force', '允许覆盖已存在的文件', false)
  .action(async (templateId: string, targetDir = '.', options) => {
    await applyTemplateById(templateId, targetDir, Boolean(options.force));
  });

SHORTCUT_COMMANDS.forEach(({ name, templateId, description }) => {
  program
    .command(`${name} [targetDir]`)
    .description(description)
    .option('-f, --force', '允许覆盖已存在的文件', false)
    .action(async (targetDir = '.', options) => {
      await applyTemplateById(templateId, targetDir, Boolean(options.force));
    });
});

program.parseAsync(process.argv).catch((error) => {
  console.error(red(`执行失败：${error.message}`));
  process.exit(1);
});

