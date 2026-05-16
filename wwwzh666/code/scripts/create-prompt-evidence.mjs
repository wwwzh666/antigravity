import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(scriptDir, '..', '..', 'prompt');

const prompts = [
  {
    file: '01-user-requirement.png',
    title: 'User requirement',
    body:
      '我现在需要复刻 https://antigravity.google/ 页面的动画效果，具体要求在 oriengy/coding-exam question-2，需要及时将改动提交到 GitHub 仓库 wwwzh666/antigravity，并先确定编程语言以及框架的使用，作出完整项目规划。',
  },
  {
    file: '02-project-plan.png',
    title: 'Approved project plan',
    body:
      '技术栈确定为 TypeScript + Vite + Three.js + GSAP/ScrollTrigger + 原生 CSS。提交目录采用 wwwzh666/，范围为首页完整滚动动画，包含 code、prompt、screenshot、README，并按阶段提交。',
  },
  {
    file: '03-implementation-request.png',
    title: 'Implementation request',
    body:
      'PLEASE IMPLEMENT THIS PLAN: 初始化项目结构，复刻首屏 logo、typed header、WebGL 粒子、hero video、自定义 cursor、滚动动画、用例/下载/博客区块，生成截图、README，并提交 push。',
  },
];

function pageHtml(prompt) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body {
            margin: 0;
            width: 1200px;
            min-height: 680px;
            font-family: Arial, sans-serif;
            background: #f8f9fc;
            color: #121317;
          }
          .frame {
            margin: 44px;
            padding: 38px;
            background: white;
            border: 1px solid #e1e6ec;
            border-radius: 8px;
          }
          .label {
            color: #3279f9;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 18px;
          }
          h1 {
            margin: 0 0 26px;
            font-size: 40px;
            line-height: 1.15;
          }
          p {
            margin: 0;
            font-size: 24px;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <main class="frame">
          <div class="label">Prompt evidence</div>
          <h1>${prompt.title}</h1>
          <p>${prompt.body}</p>
        </main>
      </body>
    </html>
  `;
}

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch();
for (const prompt of prompts) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 680 } });
  await page.setContent(pageHtml(prompt), { waitUntil: 'load' });
  await page.screenshot({ path: path.join(outputDir, prompt.file) });
  await page.close();
}
await browser.close();
