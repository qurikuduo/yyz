import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const SERVER_ROOT = path.resolve(__dirname, '..')      // .../server
export const PROJECT_ROOT = path.resolve(SERVER_ROOT, '..')   // repo root

export const PORT = Number(process.env.PORT || 8080)
export const HOST = process.env.HOST || '0.0.0.0'

// SQLite data directory. In Docker this is /app/data (mounted volume).
export const DATA_DIR = process.env.DATA_DIR || path.join(SERVER_ROOT, 'data')
export const DB_FILE = process.env.DB_FILE || path.join(DATA_DIR, 'app.db')

// Built frontend assets served by Express in production.
export const WEB_DIST = process.env.WEB_DIST || path.join(PROJECT_ROOT, 'web', 'dist')

// Bundled downloadable self-help materials.
export const KNOWLEDGE_ASSETS = process.env.KNOWLEDGE_ASSETS || path.join(SERVER_ROOT, 'knowledge-assets')
