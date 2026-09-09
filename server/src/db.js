import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { DATA_DIR, DB_FILE } from './config.js'

let db = null

export function getDb() {
  if (db) return db
  fs.mkdirSync(DATA_DIR, { recursive: true })
  db = new DatabaseSync(DB_FILE)
  db.exec('PRAGMA journal_mode = WAL;')
  db.exec('PRAGMA foreign_keys = ON;')
  migrate(db)
  return db
}

function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS assessments (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      token           TEXT    NOT NULL UNIQUE,
      password_hash   TEXT    NOT NULL,
      salt            TEXT    NOT NULL,
      scheme          TEXT    NOT NULL,
      language        TEXT    NOT NULL DEFAULT 'zh',
      intake_json     TEXT,
      answers_json    TEXT    NOT NULL,
      scores_json     TEXT    NOT NULL,
      comprehensive_json TEXT,
      crisis          INTEGER NOT NULL DEFAULT 0,
      created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_assessments_token ON assessments(token);
    CREATE INDEX IF NOT EXISTS idx_assessments_created ON assessments(created_at);

    CREATE TABLE IF NOT EXISTS knowledge_resources (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      slug         TEXT    NOT NULL UNIQUE,
      category     TEXT    NOT NULL,
      title_zh     TEXT    NOT NULL,
      title_en     TEXT    NOT NULL,
      summary_zh   TEXT,
      summary_en   TEXT,
      body_zh      TEXT,
      body_en      TEXT,
      file_path    TEXT,
      external_url TEXT,
      sort_order   INTEGER NOT NULL DEFAULT 0
    );
  `)
}

export function closeDb() {
  if (db) {
    db.close()
    db = null
  }
}

export { path }
