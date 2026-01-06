import fs from 'node:fs';
import path from 'node:path';

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function findFirstMatch(dir, regex) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  const match = files.find((f) => regex.test(f));
  return match ? path.join(dir, match) : null;
}

// dist から公開用に repo root へ必要ファイルをコピーする
// Cloudflare Pages が「ビルド成果物ではなく repo 直下」を配信している場合でも動作するようにする
const distDir = path.resolve('dist');
const distAssetsDir = path.join(distDir, 'assets');
const outAssetsDir = path.resolve('assets');

const jsPath =
  fs.existsSync(path.join(distAssetsDir, 'app.js'))
    ? path.join(distAssetsDir, 'app.js')
    : (
        // Viteの出力名は input 名や設定で変わるので、広めに探す
        findFirstMatch(distAssetsDir, /^main-.*\.js$/) ||
        findFirstMatch(distAssetsDir, /^index.*\.js$/) ||
        findFirstMatch(distAssetsDir, /^.*\.js$/)
      );

const cssPath =
  fs.existsSync(path.join(distAssetsDir, 'app.css'))
    ? path.join(distAssetsDir, 'app.css')
    : (
        findFirstMatch(distAssetsDir, /^index.*\.css$/) ||
        findFirstMatch(distAssetsDir, /^.*\.css$/)
      );

if (!jsPath) {
  console.error('dist assets JS not found. Run `npm run build` first.');
  process.exit(1);
}

ensureDir(outAssetsDir);
copyFile(jsPath, path.join(outAssetsDir, 'app.js'));

if (cssPath) {
  copyFile(cssPath, path.join(outAssetsDir, 'app.css'));
}

// ルート直下にも favicon/robots/sitemap を置く（ビルド無し配信対策）
if (fs.existsSync('public/favicon.svg')) copyFile('public/favicon.svg', 'favicon.svg');
if (fs.existsSync('public/robots.txt')) copyFile('public/robots.txt', 'robots.txt');
if (fs.existsSync('public/sitemap.xml')) copyFile('public/sitemap.xml', 'sitemap.xml');

// images をルート直下へもコピー（ビルド成果物が配信されない環境対策）
const publicImagesDir = path.resolve('public/images');
const rootImagesDir = path.resolve('images');
function copyDirRecursive(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  ensureDir(destDir);
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) copyDirRecursive(srcPath, destPath);
    else if (entry.isFile()) copyFile(srcPath, destPath);
  }
}
copyDirRecursive(publicImagesDir, rootImagesDir);

console.log('Exported static assets:');
console.log('- assets/app.js');
if (cssPath) console.log('- assets/app.css');
console.log('- favicon.svg, robots.txt, sitemap.xml (if present in public/)');
if (fs.existsSync(rootImagesDir)) console.log('- images/** (copied from public/images)');


