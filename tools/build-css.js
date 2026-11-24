// 重新編譯 Tailwind CSS 並內嵌到 index.html 的 /* tailwind:start */ ... /* tailwind:end */ 之間
// 用法（專案根目錄）：node tools/build-css.js
// 需要 Node.js；首次執行 npx 會自動下載 tailwindcss@3.4.17
const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'index.html');
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'badminton-css-'));
const inputCss = path.join(tmpDir, 'in.css');
const outputCss = path.join(tmpDir, 'out.css');

fs.writeFileSync(inputCss, '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');
execSync(
  `npx --yes tailwindcss@3.4.17 -c "${path.join(__dirname, 'tailwind.config.js')}" -i "${inputCss}" -o "${outputCss}" --minify`,
  { stdio: 'inherit' }
);

const css = fs.readFileSync(outputCss, 'utf8').trim();
const html = fs.readFileSync(htmlPath, 'utf8');
const re = /\/\* tailwind:start \*\/[\s\S]*?\/\* tailwind:end \*\//;
if (!re.test(html)) {
  console.error('找不到 /* tailwind:start */ ... /* tailwind:end */ 標記');
  process.exit(1);
}
fs.writeFileSync(htmlPath, html.replace(re, () => `/* tailwind:start */\n${css}\n/* tailwind:end */`));
fs.rmSync(tmpDir, { recursive: true, force: true });
console.log(`已內嵌 Tailwind CSS（${css.length} bytes）到 index.html`);
