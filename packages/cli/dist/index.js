#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_commander = require("commander");
var import_fs = require("fs");
var import_path = __toESM(require("path"));
var import_process = __toESM(require("process"));
var import_kleur = __toESM(require("kleur"));

// package.json
var package_default = {
  name: "ai-rules-cli",
  version: "0.1.0",
  description: "\u5C06 AI \u534F\u4F5C\u89C4\u8303\u6A21\u677F\u4E00\u952E\u5199\u5165\u4EFB\u610F\u9879\u76EE\u7684\u547D\u4EE4\u884C\u5DE5\u5177\u3002",
  bin: {
    airules: "dist/index.js"
  },
  main: "dist/index.js",
  types: "dist/index.d.ts",
  scripts: {
    build: "tsup",
    dev: "tsup --watch",
    clean: "rm -rf dist"
  },
  dependencies: {
    commander: "^12.1.0",
    kleur: "^4.1.5"
  },
  devDependencies: {
    "@types/node": "^20.12.7",
    tsup: "^8.0.1"
  },
  files: [
    "dist",
    "templates"
  ]
};

// src/index.ts
var { cyan, green, red, yellow } = import_kleur.default;
var TEMPLATE_CATALOG = [
  {
    id: "commitlint",
    source: "commitlint.config.cjs",
    target: "commitlint.config.cjs",
    description: "commitlint \u63D0\u4EA4\u4FE1\u606F\u6821\u9A8C\u914D\u7F6E"
  },
  {
    id: "cursor-guidelines",
    source: import_path.default.join("cursor", "commit-guidelines.md"),
    target: import_path.default.join(".cursor", "rules", "commit-guidelines.md"),
    description: "Cursor AI \u6307\u4EE4\u6A21\u677F"
  },
  {
    id: "claude-guidelines",
    source: import_path.default.join("claude", "commit-guidelines.md"),
    target: import_path.default.join(".claude", "commit-guidelines.md"),
    description: "Claude AI \u6307\u4EE4\u6A21\u677F\uFF0C\u53EF\u6309\u9700\u5D4C\u5165\u914D\u7F6E\u6587\u4EF6"
  }
];
var program = new import_commander.Command();
program.name("airules").description("AI \u534F\u4F5C\u89C4\u8303\u6A21\u677F\u5199\u5165\u5DE5\u5177").version(package_default.version);
async function ensureTemplateRoot() {
  const candidatePaths = [
    import_path.default.resolve(__dirname, "../templates"),
    import_path.default.resolve(__dirname, "../../templates"),
    import_path.default.resolve(import_process.default.cwd(), "templates")
  ];
  for (const candidate of candidatePaths) {
    try {
      const stat = await import_fs.promises.stat(candidate);
      if (stat.isDirectory()) {
        return candidate;
      }
    } catch {
    }
  }
  throw new Error("\u672A\u627E\u5230\u6A21\u677F\u76EE\u5F55\uFF0C\u8BF7\u786E\u8BA4\u5DF2\u6267\u884C\u6784\u5EFA\u6216\u590D\u5236 templates \u8D44\u6E90\u3002");
}
async function pathExists(filePath) {
  try {
    await import_fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}
async function copyTemplate(templateRoot, descriptor, targetDir, force) {
  const srcPath = import_path.default.join(templateRoot, descriptor.source);
  const destPath = import_path.default.join(targetDir, descriptor.target);
  if (!await pathExists(srcPath)) {
    throw new Error(`\u6A21\u677F\u7F3A\u5931\uFF1A${descriptor.id}`);
  }
  const destDir = import_path.default.dirname(destPath);
  await import_fs.promises.mkdir(destDir, { recursive: true });
  if (!force && await pathExists(destPath)) {
    return { skipped: true, targetPath: destPath };
  }
  const content = await import_fs.promises.readFile(srcPath);
  await import_fs.promises.writeFile(destPath, content);
  return { skipped: false, targetPath: destPath };
}
program.command("list").description("\u5217\u51FA\u53EF\u7528\u6A21\u677F").action(async () => {
  const templateRoot = await ensureTemplateRoot();
  console.log(cyan(`\u6A21\u677F\u76EE\u5F55\uFF1A${templateRoot}`));
  TEMPLATE_CATALOG.forEach((item) => {
    console.log(
      `${green(item.id)} \u2192 ${item.target}
  ${item.description}`
    );
  });
});
program.command("init [targetDir]").description("\u5C06\u5168\u90E8\u6A21\u677F\u5199\u5165\u76EE\u6807\u76EE\u5F55").option("-f, --force", "\u5141\u8BB8\u8986\u76D6\u5DF2\u5B58\u5728\u7684\u6587\u4EF6", false).action(async (targetDir = ".", options) => {
  const destination = import_path.default.resolve(import_process.default.cwd(), targetDir);
  const templateRoot = await ensureTemplateRoot();
  const force = Boolean(options.force);
  console.log(cyan(`\u76EE\u6807\u76EE\u5F55\uFF1A${destination}`));
  await Promise.all(
    TEMPLATE_CATALOG.map(
      (tpl) => copyTemplate(templateRoot, tpl, destination, force).then(
        ({ skipped, targetPath }) => {
          if (skipped) {
            console.log(
              yellow(`\u8DF3\u8FC7\uFF1A${tpl.id}\uFF08${targetPath} \u5DF2\u5B58\u5728\uFF09`)
            );
          } else {
            console.log(green(`\u5199\u5165\uFF1A${tpl.id} \u2192 ${targetPath}`));
          }
        }
      )
    )
  );
  console.log("");
  console.log(
    green(
      "\u5B8C\u6210 \u{1F389} \u8BF7\u5728\u76EE\u6807\u9879\u76EE\u4E2D\u6267\u884C `yarn add -D @commitlint/cli` \u5E76\u914D\u7F6E\u63D0\u4EA4\u94A9\u5B50\u3002"
    )
  );
  console.log(
    "\u5982\u9700\u5355\u72EC\u5199\u5165\u67D0\u4E2A\u6A21\u677F\uFF0C\u53EF\u540E\u7EED\u4F7F\u7528 `airules apply <\u6A21\u677FID>`\uFF08\u5F00\u53D1\u4E2D\uFF09\u3002"
  );
});
program.command("apply <templateId> [targetDir]").description("\u6309\u6A21\u677F ID \u5199\u5165\u5355\u4E2A\u6587\u4EF6\u6216\u76EE\u5F55").option("-f, --force", "\u5141\u8BB8\u8986\u76D6\u5DF2\u5B58\u5728\u7684\u6587\u4EF6", false).action(async (templateId, targetDir = ".", options) => {
  const descriptor = TEMPLATE_CATALOG.find((tpl) => tpl.id === templateId);
  if (!descriptor) {
    console.error(red(`\u672A\u627E\u5230\u6A21\u677F\uFF1A${templateId}`));
    console.log(
      `\u53EF\u7528\u6A21\u677F\uFF1A${TEMPLATE_CATALOG.map((tpl) => tpl.id).join(", ")}`
    );
    import_process.default.exitCode = 1;
    return;
  }
  const destination = import_path.default.resolve(import_process.default.cwd(), targetDir);
  const templateRoot = await ensureTemplateRoot();
  const force = Boolean(options.force);
  try {
    const { skipped, targetPath } = await copyTemplate(
      templateRoot,
      descriptor,
      destination,
      force
    );
    if (skipped) {
      console.log(
        yellow(
          `\u8DF3\u8FC7\uFF1A${descriptor.id}\uFF08${targetPath} \u5DF2\u5B58\u5728\uFF0C\u4F7F\u7528 --force \u5F3A\u5236\u8986\u76D6\uFF09`
        )
      );
    } else {
      console.log(green(`\u5199\u5165\uFF1A${descriptor.id} \u2192 ${targetPath}`));
    }
  } catch (error) {
    console.error(red(`\u5199\u5165\u5931\u8D25\uFF1A${error.message}`));
    import_process.default.exitCode = 1;
  }
});
program.parseAsync(import_process.default.argv).catch((error) => {
  console.error(red(`\u6267\u884C\u5931\u8D25\uFF1A${error.message}`));
  import_process.default.exit(1);
});
//# sourceMappingURL=index.js.map