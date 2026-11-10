/**
 * API tests for the Bite-Cloud backend.
 *
 * The app previously had no 404 handler and no error handler, so an unknown
 * path and a malformed JSON body both produced Express's HTML error page from
 * an API that returns JSON everywhere else. `express.json()` also had no size
 * limit. These tests pin all of that, plus the hardening added alongside.
 *
 * Mongoose is never connected here, so routes that query the database fail
 * downstream — the assertions are about the middleware that runs *before* the
 * query, plus the liveness/readiness split.
 */
process.env.JWT_SECRET = 'test-only-secret-not-used-in-any-deployment';
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/bitecloud_test_unused';
process.env.AUTH_RATE_LIMIT_MAX = '4';

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');

// Fail queries immediately rather than sitting in Mongoose's 10s buffer.
mongoose.set('bufferCommands', false);

const { createApp } = require('../app');

let server;
let base;

before(async () => {
  // Loopback explicitly: an ephemeral port on all interfaces would briefly
  // expose the test server to the local network.
  server = createApp().listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

const call = (path, { method = 'GET', headers = {}, body } = {}) =>
  fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

test('the test server listens only on loopback', () => {
  assert.strictEqual(server.address().address, '127.0.0.1');
});

test('liveness answers without a database connection', async () => {
  assert.strictEqual(mongoose.connection.readyState, 0);
  const res = await call('/api/health');
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.ok, true);
  assert.strictEqual(typeof body.uptime, 'number');
});

test('readiness reports 503 with Retry-After while Mongo is disconnected', async () => {
  const res = await call('/api/health/ready');
  assert.strictEqual(res.status, 503);
  assert.strictEqual(res.headers.get('retry-after'), '30');
  const body = await res.json();
  assert.strictEqual(body.ok, false);
  assert.strictEqual(body.database, 'disconnected');
});

test('the root route returns JSON, not a bare string', async () => {
  const res = await call('/');
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.status, 'ok');
  assert.strictEqual(body.service, 'bite-cloud-api');
});

test('security headers are set and the server is not fingerprintable', async () => {
  const res = await call('/api/health');
  // app.disable('x-powered-by') was missing entirely before.
  assert.strictEqual(res.headers.get('x-powered-by'), null);
  assert.strictEqual(res.headers.get('x-content-type-options'), 'nosniff');
  assert.match(res.headers.get('content-security-policy'), /default-src 'none'/);
  assert.strictEqual(res.headers.get('referrer-policy'), 'no-referrer');
});

test('an unknown route returns a JSON 404, not an HTML error page', async () => {
  const res = await call('/api/does-not-exist');
  assert.strictEqual(res.status, 404);
  assert.match(res.headers.get('content-type'), /application\/json/);
  const body = await res.json();
  assert.strictEqual(body.success, false);
  assert.strictEqual(body.error, 'Not found');
});

test('malformed JSON produces a JSON 400, not an HTML stack trace', async () => {
  const res = await fetch(`${base}/api/loginuser`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"email": broken',
  });
  assert.strictEqual(res.status, 400);
  assert.match(res.headers.get('content-type'), /application\/json/);
  const body = await res.json();
  assert.match(body.error, /Invalid JSON/);
});

test('an oversized body is rejected with 413, not buffered', async () => {
  // express.json() had no limit, so a single request could stream an
  // arbitrarily large body into memory.
  const huge = JSON.stringify({ email: 'a@b.co', password: 'x'.repeat(200 * 1024) });
  const res = await fetch(`${base}/api/loginuser`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: huge,
  });
  assert.strictEqual(res.status, 413);
  const body = await res.json();
  assert.match(body.error, /too large/i);
});

test('registration validates every required field', async () => {
  const cases = [
    { name: '', email: 'a@b.co', password: 'secret', location: 'Somewhere' },
    { name: 'Valid', email: 'not-an-email', password: 'secret', location: 'Somewhere' },
    { name: 'Valid', email: 'a@b.co', password: '123', location: 'Somewhere' },
    { name: 'Valid', email: 'a@b.co', password: 'secret', location: '' },
  ];
  for (const body of cases) {
    const res = await call('/api/createUser', { method: 'POST', body });
    assert.strictEqual(res.status, 400, `expected 400 for ${JSON.stringify(body)}`);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.ok(Array.isArray(json.errors));
  }
});

test('login validates its input', async () => {
  const res = await call('/api/loginuser', {
    method: 'POST',
    body: { email: 'not-an-email', password: '' },
  });
  assert.strictEqual(res.status, 400);
});

test('the auth limiter fires and keys on IP plus email', async () => {
  // AUTH_RATE_LIMIT_MAX is 4 in this suite.
  const attempt = (email) =>
    call('/api/loginuser', { method: 'POST', body: { email, password: 'wrong-password' } });

  let sawLimit = false;
  for (let i = 0; i < 8; i += 1) {
    const res = await attempt('target@example.test');
    if (res.status === 429) {
      sawLimit = true;
      break;
    }
  }
  assert.ok(sawLimit, 'expected a 429 once the auth limit was exceeded');

  // A different email from the same IP is a separate bucket.
  const other = await attempt('someone-else@example.test');
  assert.notStrictEqual(other.status, 429);
});

test('the public menu route is not behind the auth limiter', async () => {
  // GET /api/foodData is the public menu: it must stay reachable even after
  // the credential endpoints have been rate limited above.
  const res = await call('/api/foodData');
  assert.notStrictEqual(res.status, 429);
});

test('rate limit responses use the draft-7 header, not the legacy ones', async () => {
  const res = await call('/api/health');
  assert.ok(res.headers.get('ratelimit') || res.headers.get('ratelimit-limit'));
  assert.strictEqual(res.headers.get('x-ratelimit-limit'), null);
});
