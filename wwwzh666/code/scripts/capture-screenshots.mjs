import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const outputDir = path.resolve(root, '..', 'screenshot');
const url = 'http://127.0.0.1:5173';

async function isServerReady() {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (await isServerReady()) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Timed out waiting for Vite server');
}

async function withServer(callback) {
  let server;
  if (!(await isServerReady())) {
    server = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5173'], {
      cwd: root,
      stdio: 'ignore',
      detached: false,
    });
    await waitForServer();
  }

  try {
    await callback();
  } finally {
    if (server) server.kill('SIGTERM');
  }
}

await mkdir(outputDir, { recursive: true });

await withServer(async () => {
  const browser = await chromium.launch();
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto(url, { waitUntil: 'networkidle' });
  await desktop.waitForTimeout(1600);
  await desktop.screenshot({ path: path.join(outputDir, '01-desktop-hero.png') });

  await desktop.evaluate(() => window.scrollTo(0, 1000));
  await desktop.waitForTimeout(900);
  await desktop.screenshot({ path: path.join(outputDir, '02-scroll-video.png') });

  const wrapper = desktop.locator('.video-wrapper');
  await wrapper.scrollIntoViewIfNeeded();
  await desktop.waitForTimeout(500);
  const box = await wrapper.boundingBox();
  if (box) {
    await desktop.mouse.move(box.x + box.width * 0.58, box.y + box.height * 0.55);
    await desktop.waitForTimeout(400);
    await desktop.screenshot({ path: path.join(outputDir, '03-video-hover-cursor.png') });
  }

  await desktop.evaluate(() => window.scrollTo(0, 3000));
  await desktop.waitForTimeout(900);
  await desktop.screenshot({ path: path.join(outputDir, '04-use-cases-solutions.png') });

  await desktop.evaluate(() => window.scrollTo(0, 4300));
  await desktop.waitForTimeout(900);
  await desktop.screenshot({ path: path.join(outputDir, '05-download-section.png') });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await mobile.goto(url, { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(1200);
  await mobile.screenshot({ path: path.join(outputDir, '06-mobile-hero.png') });

  await browser.close();
});
