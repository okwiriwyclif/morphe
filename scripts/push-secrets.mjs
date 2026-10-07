// Pushes secret values from .env to the deployed Cloudflare Worker as encrypted secrets.
// usage: npm run secrets            (requires `npx wrangler login` once)
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parseEnv } from 'node:util'

// Only these keys are secrets; everything else lives in wrangler.jsonc "vars"
const SECRET_KEYS = ['SMTP_PASS']

if (!existsSync('.env')) {
  console.error('✗ .env not found. Copy .env.example to .env and fill it in.')
  process.exit(1)
}

const env = parseEnv(readFileSync('.env', 'utf8'))
const secrets = Object.fromEntries(SECRET_KEYS.filter((k) => env[k]).map((k) => [k, env[k]]))
const missing = SECRET_KEYS.filter((k) => !env[k])
if (missing.length) {
  console.error(`✗ Missing in .env: ${missing.join(', ')}`)
  process.exit(1)
}

// Hand the values to wrangler through a private temp file (not argv), then delete it
const dir = mkdtempSync(join(tmpdir(), 'morphe-secrets-'))
const file = join(dir, 'secrets.json')
try {
  writeFileSync(file, JSON.stringify(secrets), { mode: 0o600 })
  execFileSync('npx', ['wrangler', 'secret', 'bulk', file], { stdio: 'inherit' })
  console.log(`✓ Pushed ${Object.keys(secrets).join(', ')} to the Worker`)
} finally {
  rmSync(dir, { recursive: true, force: true })
}
