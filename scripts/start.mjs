// One command for demo day: builds (if needed), starts the app on port 3000 and prints every address.
//   npm run demo            build + start (local network)
//   npm run demo -- --tunnel  also opens a free Cloudflare quick tunnel so judges on a video call can text from their phones
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { networkInterfaces } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const web = path.join(root, 'web');
const args = process.argv.slice(2);
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const run = (cmd, a, opts = {}) => spawn(cmd, a, { cwd: web, stdio: 'inherit', shell: process.platform === 'win32', ...opts });

if (!existsSync(path.join(web, 'node_modules'))) {
  console.log('Installing dependencies (first run only)...');
  if (spawnSync(npm, ['install'], { cwd: web, stdio: 'inherit', shell: true }).status !== 0) process.exit(1);
}
if (args.includes('--rebuild') || !existsSync(path.join(web, '.next', 'BUILD_ID'))) {
  console.log('Building FoodLine...');
  if (spawnSync(npm, ['run', 'build'], { cwd: web, stdio: 'inherit', shell: true }).status !== 0) process.exit(1);
}

const server = run(npm, ['run', 'start']);
const lan = Object.values(networkInterfaces()).flat().filter((i) => i && i.family === 'IPv4' && !i.internal).map((i) => i.address);
setTimeout(() => {
  console.log('\n  FoodLine DC is running\n');
  console.log('  Landing (QR):   http://localhost:3000/');
  console.log('  Demo layout:    http://localhost:3000/demo   (arrow keys step views, P hides controls)');
  console.log('  Map:            http://localhost:3000/map');
  console.log('  Text line:      http://localhost:3000/chat');
  for (const ip of lan) console.log(`  Same Wi-Fi:     http://${ip}:3000/chat`);
  console.log('');
}, 2500);

if (args.includes('--tunnel')) {
  const cf = spawn('cloudflared', ['tunnel', '--url', 'http://127.0.0.1:3000', '--no-autoupdate'], { shell: process.platform === 'win32' });
  let shown = false;
  const scan = (buf) => {
    const m = buf.toString().match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (m && !shown) {
      shown = true;
      console.log(`\n  Public link:    ${m[0]}/chat`);
      console.log(`  Landing with a QR code for judges' phones:\n  http://localhost:3000/?url=${m[0]}\n`);
    }
  };
  cf.stdout.on('data', scan);
  cf.stderr.on('data', scan);
  cf.on('error', () => console.log('\n  cloudflared is not installed. Install it with:  winget install --id Cloudflare.cloudflared\n'));
  process.on('exit', () => cf.kill());
}

process.on('SIGINT', () => { server.kill(); process.exit(0); });
