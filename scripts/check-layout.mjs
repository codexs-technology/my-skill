/**
 * Real-browser layout + interaction check.
 *
 * Launches headless Chrome/Edge over the DevTools protocol against the built
 * site and verifies:
 *   - no horizontal scrolling at 375 / 768 / 1024 / 1440 px
 *   - every section shares the same left/right gutter as the navbar
 *   - the projects marquee actually animates, and pauses on hover
 *   - clicking a card image opens the lightbox and Escape closes it
 * It also writes screenshots to .layout-shots/ for a visual check.
 *
 * Usage: npm run layout        (starts its own vite preview server)
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SHOT_DIR = join(ROOT, '.layout-shots');
const PROFILE_DIR = join(ROOT, '.chrome-profile');
const PORT = 4175;
const CDP_PORT = 9333;
const URL_UNDER_TEST = `http://127.0.0.1:${PORT}/`;
const WIDTHS = [375, 768, 1024, 1440];

const BROWSERS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const failures = [];
const notes = [];

function findBrowser() {
  const found = BROWSERS.find((candidate) => existsSync(candidate));
  if (!found) {
    console.error('No Chrome or Edge installation found — skipping the browser layout check.');
    process.exit(0);
  }
  return found;
}

/** Minimal DevTools-protocol client over Node's built-in WebSocket. */
class Cdp {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 0;
    this.pending = new Map();
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      const entry = this.pending.get(message.id);
      if (!entry) return;
      this.pending.delete(message.id);
      if (message.error) entry.reject(new Error(JSON.stringify(message.error)));
      else entry.resolve(message.result);
    });
  }

  send(method, params = {}) {
    const id = (this.nextId += 1);
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description ?? 'evaluate failed');
    }
    return result.result.value;
  }
}

async function waitForTarget() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      const targets = await response.json();
      const page = targets.find((target) => target.type === 'page' && target.webSocketDebuggerUrl);
      if (page) return page;
    } catch {
      /* not up yet */
    }
    await wait(250);
  }
  throw new Error('DevTools endpoint never became reachable');
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(URL_UNDER_TEST);
      if (response.ok) return;
    } catch {
      /* not up yet */
    }
    await wait(300);
  }
  throw new Error('Preview server did not start');
}

/** Runs once per width: overflow + gutter alignment. */
const INSPECT = `(() => {
  const doc = document.documentElement;
  const vw = doc.clientWidth;

  const isClipped = (el) => {
    let parent = el.parentElement;
    while (parent && parent !== doc) {
      if (getComputedStyle(parent).overflowX !== 'visible') return true;
      parent = parent.parentElement;
    }
    return false;
  };

  const offenders = [];
  document.querySelectorAll('body *').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    if ((rect.right > vw + 1 || rect.left < -1) && !isClipped(el)) {
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className).slice(0, 80),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
      });
    }
  });

  // Definitive test: can the page actually be scrolled sideways?
  const before = window.scrollX;
  window.scrollTo(500, 0);
  const scrolled = Math.abs(window.scrollX - before) > 0;
  window.scrollTo(before, window.scrollY);

  // Every shared gutter (Container) must share the same left/right edges.
  // Zero-size matches (e.g. the display:none mobile menu) are ignored.
  const gutters = [...document.querySelectorAll('.mx-auto.w-full.max-w-6xl')]
    .map((el) => el.getBoundingClientRect())
    .filter((rect) => rect.width > 1)
    .map((rect) => ({ left: Math.round(rect.left), right: Math.round(rect.right) }));

  return JSON.stringify({
    vw,
    scrollWidth: doc.scrollWidth,
    scrolled,
    offenderCount: offenders.length,
    offenders: offenders.slice(0, 8),
    gutters,
    uniqueLefts: [...new Set(gutters.map((g) => g.left))],
    uniqueRights: [...new Set(gutters.map((g) => g.right))],
  });
})()`;

const MARQUEE_STATE = `(() => {
  const track = document.querySelector('.marquee-track');
  if (!track) return JSON.stringify({ ok: false, reason: 'no track' });
  const style = getComputedStyle(track);
  return JSON.stringify({
    ok: true,
    animationName: style.animationName,
    playState: style.animationPlayState,
    duration: style.animationDuration,
    transform: style.transform,
    cards: track.querySelectorAll('button[aria-label^="Open full-size screenshot"]').length,
  });
})()`;

function main() {
  const browser = findBrowser();
  rmSync(PROFILE_DIR, { recursive: true, force: true });
  rmSync(SHOT_DIR, { recursive: true, force: true });
  mkdirSync(SHOT_DIR, { recursive: true });

  const preview = spawn(
    process.execPath,
    [
      join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js'),
      'preview',
      '--port',
      String(PORT),
      '--strictPort',
      '--host',
      '127.0.0.1',
    ],
    { cwd: ROOT, stdio: 'ignore' },
  );

  const chrome = spawn(
    browser,
    [
      '--headless=new',
      `--remote-debugging-port=${CDP_PORT}`,
      `--user-data-dir=${PROFILE_DIR}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
      '--window-size=1440,900',
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  run()
    .catch((error) => {
      failures.push(`browser check could not complete: ${error.message}`);
    })
    .finally(() => {
      for (const child of [chrome, preview]) {
        spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
      }
      report();
    });
}

async function run() {
  await waitForServer();
  const target = await waitForTarget();

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve);
    socket.addEventListener('error', () => reject(new Error('CDP websocket failed')));
  });
  const cdp = new Cdp(socket);

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Page.navigate', { url: URL_UNDER_TEST });
  await wait(2500);

  for (const width of WIDTHS) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await wait(900);

    const report = JSON.parse(await cdp.evaluate(INSPECT));
    const label = `${width}px`;

    if (report.scrolled) {
      failures.push(
        `${label}: page scrolls horizontally (scrollWidth ${report.scrollWidth} > viewport ${report.vw})`,
      );
      report.offenders.forEach((o) => failures.push(`   -> ${o.tag}.${o.cls} [${o.left} to ${o.right}]`));
    } else if (report.scrollWidth > report.vw + 1) {
      notes.push(`${label}: content clipped (scrollWidth ${report.scrollWidth}) but not scrollable`);
    }

    if (report.uniqueLefts.length > 1 || report.uniqueRights.length > 1) {
      failures.push(
        `${label}: gutters misaligned -> lefts ${report.uniqueLefts.join('/')} rights ${report.uniqueRights.join('/')}`,
      );
    } else {
      notes.push(
        `${label}: no h-scroll, ${report.gutters.length} gutters aligned (left ${report.uniqueLefts[0]} / right ${report.uniqueRights[0]})`,
      );
    }

    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(SHOT_DIR, `${width}.png`), Buffer.from(shot.data, 'base64'));
  }

  // ── Marquee behaviour ──────────────────────────────────────────────────
  await cdp.evaluate("document.querySelector('#projects').scrollIntoView({ block: 'start' })");
  await wait(900);

  const first = JSON.parse(await cdp.evaluate(MARQUEE_STATE));
  let marqueePoint = { x: 0, y: 0 };
  if (!first.ok) {
    failures.push('projects marquee track not rendered');
  } else {
    if (first.animationName !== 'marquee-scroll') {
      failures.push(`marquee animation is "${first.animationName}", expected marquee-scroll`);
    }
    if (first.cards !== 16) {
      failures.push(`expected 16 cards in the track (8 x 2 copies), found ${first.cards}`);
    }
    await wait(1500);
    const second = JSON.parse(await cdp.evaluate(MARQUEE_STATE));
    if (first.transform === second.transform) failures.push('marquee is not moving');
    else notes.push(`marquee animating (${first.duration}) with ${first.cards} cards`);

    await cdp.evaluate(`(() => {
      const track = document.querySelector('.marquee-track');
      const viewport = track.parentElement.parentElement;
      const rect = viewport.getBoundingClientRect();
      window.__marqueeCenter = { x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) };
    })()`);
    const center = await cdp.evaluate('JSON.stringify(window.__marqueeCenter)');
    marqueePoint = JSON.parse(center);

    // A real mouse move, so React's mouseenter fires (synthetic events do not).
    await cdp.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: marqueePoint.x,
      y: marqueePoint.y,
      buttons: 0,
    });
    await wait(500);
    const hovered = JSON.parse(await cdp.evaluate(MARQUEE_STATE));
    if (hovered.playState === 'paused') notes.push('marquee pauses on hover');
    else failures.push(`marquee did not pause on hover (playState ${hovered.playState})`);

    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 5, buttons: 0 });
    await wait(500);
    const resumed = JSON.parse(await cdp.evaluate(MARQUEE_STATE));
    if (resumed.playState === 'running') notes.push('marquee resumes after the pointer leaves');
    else failures.push(`marquee stayed paused after mouse out (playState ${resumed.playState})`);
  }

  // ── Manual controls: arrows + drag ─────────────────────────────────────
  const trackDelay = `getComputedStyle(document.querySelector('.marquee-track')).animationDelay`;
  const delayStart = await cdp.evaluate(trackDelay);

  await cdp.evaluate(`document.querySelector('button[aria-label="Next projects"]').click()`);
  await wait(400);
  const delayNext = await cdp.evaluate(trackDelay);
  if (delayStart === delayNext) failures.push('Next arrow did not move the carousel');
  else notes.push(`next arrow shifts the track (${delayStart} to ${delayNext})`);

  await cdp.evaluate(`document.querySelector('button[aria-label="Previous projects"]').click()`);
  await wait(400);
  const delayPrev = await cdp.evaluate(trackDelay);
  if (delayPrev === delayNext) failures.push('Previous arrow did not move the carousel');
  else notes.push('previous arrow shifts the track back');

  // Drag with a real mouse press → move → release.
  await cdp.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x: marqueePoint.x,
    y: marqueePoint.y,
    button: 'left',
    buttons: 1,
    clickCount: 1,
  });
  await cdp.send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: marqueePoint.x - 240,
    y: marqueePoint.y,
    button: 'left',
    buttons: 1,
  });
  await cdp.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x: marqueePoint.x - 240,
    y: marqueePoint.y,
    button: 'left',
    buttons: 0,
    clickCount: 1,
  });
  await wait(500);
  const delayDragged = await cdp.evaluate(trackDelay);
  if (delayDragged === delayPrev) failures.push('dragging the carousel did not move it');
  else notes.push('drag moves the carousel');

  const openedByDrag = await cdp.evaluate(`!!document.querySelector('[aria-modal="true"]')`);
  if (openedByDrag) failures.push('drag opened the lightbox (click suppression failed)');
  else notes.push('drag does not accidentally open the lightbox');

  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 5, buttons: 0 });
  await wait(300);

  // ── Lightbox open + Escape ─────────────────────────────────────────────
  await cdp.evaluate(
    `document.querySelector('button[aria-label^="Open full-size screenshot"]').click()`,
  );
  await wait(600);
  const opened = await cdp.evaluate(`!!document.querySelector('[aria-modal="true"]')`);
  if (!opened) failures.push('clicking a card image did not open the lightbox');
  else notes.push('lightbox opens on card image click');

  if (opened) {
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(SHOT_DIR, 'lightbox.png'), Buffer.from(shot.data, 'base64'));
  }

  await cdp.evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);
  await wait(500);
  const closed = await cdp.evaluate(`!document.querySelector('[aria-modal="true"]')`);
  if (!closed) failures.push('Escape did not close the lightbox');
  else notes.push('lightbox closes on Escape');

  socket.close();
}

function report() {
  notes.forEach((note) => console.log(`  · ${note}`));
  console.log('\nScreenshots written to .layout-shots/');

  if (failures.length > 0) {
    console.error('\nLayout check FAILED:');
    failures.forEach((failure) => console.error(`  x ${failure}`));
    process.exitCode = 1;
    return;
  }
  console.log('\nLayout check passed - no horizontal scroll at 375/768/1024/1440, gutters aligned.');
}

main();
