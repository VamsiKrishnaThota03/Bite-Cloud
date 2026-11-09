// Central place for runtime configuration. Secrets come from the environment only.
require('dotenv').config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable ${name}. Copy backend/.env.example to backend/.env and fill it in.`);
    process.exit(1);
  }
  return value;
}

module.exports = {
  port: Number(process.env.PORT) || 5000,
  // Loopback by default. Set HOST=0.0.0.0 only on a hosting platform (e.g. Render) that requires it.
  host: process.env.HOST || '127.0.0.1',
  mongoURI: required('MONGO_URI'),
  jwtSecret: required('JWT_SECRET'),
  // Comma-separated list of allowed browser origins.
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
};
