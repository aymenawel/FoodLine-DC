// One command for demo day: builds (if needed), starts the app on port 3000 and prints every address.
//   npm run demo               build + start (local network)
//   npm run demo -- --tunnel   also opens a free Cloudflare quick tunnel so judges on a video call can text from their phones
//   npm run rebuild            force a fresh build first
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { networkInterfaces } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const web = path.join(root, 'web');
const dataDir = path.join(web, '.data');
const publicUrlFile = path.join(dataDir, 'public-url');
const args = process.argv.slice(2);
const win = process.platform === 'win32';
const npmCmd = (a) => `npm ${a}`; // one command string with shell:true works for npm.cmd on Windows

function sh(cmd) {
  return spawnSync(cmd, { cwd: web, stdio: 'inherit', shell: true }).status === 0;
}
// On Windows, killing npm leaves the Next.js server running; kill the whole process tree instead.
function killTree(child) {
  if (!child || child.exitCode !== null) return;
  if (win) spawnSync(`taskkill /PID ${child.pid} /T /F`, { shell: true, stdio: 'ignore' });
  else child.kill('SIGTERM');
}

if (!existsSync(path.join(web, 'node_modules'))) {
  console.log('Installing dependencies (first run only)...');
  if (!sh(npmCmd('install'))) process.exit(1);
}
if (args.includes('--rebuild') || !existsSync(path.join(web, '.next', 'BUILD_ID'))) {
  console.log('Building FoodLine...');
  if (!sh(npmCmd('run build'))) process.exit(1);
}

rmSync(publicUrlFile, { force: true }); // a tunnel URL from an earlier run is dead
const server = spawn(npmCmd('run start'), { cwd: web, stdio: 'inherit', shell: true });
const virtual = /vethernet|vmware|virtualbox|hyper-v|wsl|docker|loopback|bluetooth/i;
const lan = Object.entries(networkInterfaces())
  .filter(([name]) => !virtual.test(name))
  .flatMap(([name, list]) => (list ?? []).filter((i) => i.family === 'IPv4' && !i.internal).map((i) => ({ name, ip: i.address })));

setTimeout(() => {
  console.log('\n  FoodLine DC is running  (Ctrl+C to stop)\n');
  console.log('  Landing (QR):   http://localhost:3000/');
  console.log('  Demo layout:    http://localhost:3000/demo   (arrow keys step views, P hides controls)');
  console.log('  Map:            http://localhost:3000/map');
  console.log('  Text line:      http://localhost:3000/chat');
  for (const { name, ip } of lan) console.log(`  Same Wi-Fi:     http://${ip}:3000/chat   (${name})`);
  console.log('');
}, 2500);

let tunnel = null;
if (args.includes('--tunnel')) {
  tunnel = spawn('cloudflared', ['tunnel', '--url', 'http://127.0.0.1:3000', '--no-autoupdate'], { shell: win });
  let shown = false;
  const scan = (buf) => {
    const m = buf.toString().match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (m && !shown) {
      shown = true;
      mkdirSync(dataDir, { recursive: true });
      writeFileSync(publicUrlFile, m[0]); // the landing page's QR code picks this up automatically
      console.log(`\n  Public link for judges' phones:  ${m[0]}/chat`);
      console.log('  The QR code on http://localhost:3000/ now points there.\n');
    }
  };
  tunnel.stdout.on('data', scan);
  tunnel.stderr.on('data', scan);
  tunnel.on('error', () => console.log('\n  cloudflared is not installed. Install it with:  winget install --id Cloudflare.cloudflared\n'));
}

const stop = () => { killTree(tunnel); killTree(server); rmSync(publicUrlFile, { force: true }); process.exit(0); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
server.on('exit', (code) => { killTree(tunnel); process.exit(code ?? 0); });
