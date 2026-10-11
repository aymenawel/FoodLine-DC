// Stops FoodLine if it is still running in the background (anything listening on port 3000, plus the tunnel).
//   npm run stop
import { execSync } from 'node:child_process';

const win = process.platform === 'win32';
const run = (cmd) => { try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return ''; } };

let pids = [];
if (win) {
  pids = run('netstat -ano -p tcp').split('\n')
    .filter((l) => /:3000\s/.test(l) && /LISTENING/i.test(l))
    .map((l) => l.trim().split(/\s+/).pop());
} else {
  pids = run('lsof -ti tcp:3000').split('\n');
}
pids = [...new Set(pids.filter((p) => /^\d+$/.test(p) && p !== '0'))];

for (const pid of pids) run(win ? `taskkill /PID ${pid} /T /F` : `kill ${pid}`);
run(win ? 'taskkill /IM cloudflared.exe /F' : 'pkill cloudflared');

console.log(pids.length ? `FoodLine stopped (process ${pids.join(', ')}).` : 'FoodLine was not running.');
