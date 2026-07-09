/**
 * Phase 1 — Repository validation script.
 * Verifies required files and folder structure exist.
 */
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const required = [
  'index.html',
  'index.css',
  'app.js',
  'vercel.json',
  'package.json',
  '.env.example',
  'src/js/main.js',
  'src/js/api/supabase-client.js',
  'src/js/api/leads.api.js',
  'src/js/api/auth.api.js',
  'pages/login.html',
  'pages/register.html',
  'pages/dashboard.html',
  'supabase/migrations/001_extend_existing_tables.sql',
  'supabase/migrations/002_rls_policies.sql',
];

let failed = 0;

for (const file of required) {
  const path = join(root, file);
  if (existsSync(path)) {
    console.log(`✓ ${file}`);
  } else {
    console.error(`✗ MISSING: ${file}`);
    failed++;
  }
}

if (failed > 0) {
  console.error(`\nValidation failed: ${failed} missing file(s).`);
  process.exit(1);
}

console.log('\nRepository validation passed.');
