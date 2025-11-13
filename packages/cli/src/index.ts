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
};

const TEMPLATE_CATALOG: TemplateDescriptor[] = [
  {
    id: 'commitlint',
    source: 'commitlint.config.cjs',
    target: 'commitlint.config.cjs',
    description: 'commitlint 提交信息校验配置',
  },
  {
    id: 'cursor-guidelines',
    source: path.join('cursor', 'commit-guidelines.md'),
    target: path.join('.cursor', 'rules', 'commit-guidelines.md'),
    description: 'Cursor AI 指令模板',
  },
  {
    id: 'claude-guidelines',
    source: path.join('claude', 'commit-guidelines.md'),
    target: path.join('.claude', 'commit-guidelines.md'),
    description: 'Claude AI 指令模板，可按需嵌入配置文件',
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

program
  .command('list')
  .description('列出可用模板')
  .action(async () => {
    const templateRoot = await ensureTemplateRoot();
    console.log(cyan(`模板目录：${templateRoot}`));
    TEMPLATE_CATALOG.forEach((item) => {
      console.log(
        `${green(item.id)} → ${item.target}\n  ${item.description}`,
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

    await Promise.all(
      TEMPLATE_CATALOG.map((tpl) =>
        copyTemplate(templateRoot, tpl, destination, force).then(
          ({ skipped, targetPath }) => {
            if (skipped) {
              console.log(
                yellow(`跳过：${tpl.id}（${targetPath} 已存在）`),
              );
            } else {
              console.log(green(`写入：${tpl.id} → ${targetPath}`));
            }
          },
        ),
      ),
    );

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
    const descriptor = TEMPLATE_CATALOG.find((tpl) => tpl.id === templateId);
    if (!descriptor) {
      console.error(red(`未找到模板：${templateId}`));
      console.log(
        `可用模板：${TEMPLATE_CATALOG.map((tpl) => tpl.id).join(', ')}`,
      );
      process.exitCode = 1;
      return;
    }

    const destination = path.resolve(process.cwd(), targetDir);
    const templateRoot = await ensureTemplateRoot();
    const force = Boolean(options.force);

    try {
      const { skipped, targetPath } = await copyTemplate(
        templateRoot,
        descriptor,
        destination,
        force,
      );
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
  });

program.parseAsync(process.argv).catch((error) => {
  console.error(red(`执行失败：${error.message}`));
  process.exit(1);
});

