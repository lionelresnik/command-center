import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import path from "path"
import os from "os"
import fs from "fs"
import * as schema from "./schema"

const DATA_DIR = path.join(os.homedir(), ".command-center")
const DB_PATH = path.join(DATA_DIR, "cc.db")

/** Run additive migrations — safe to call on every startup */
function runMigrations(sqlite: InstanceType<typeof Database>) {
  const migrations = [
    // Phase 4: token tracking columns
    `ALTER TABLE missions ADD COLUMN tokens_input INTEGER DEFAULT 0`,
    `ALTER TABLE missions ADD COLUMN tokens_output INTEGER DEFAULT 0`,
    `ALTER TABLE missions ADD COLUMN tokens_total INTEGER DEFAULT 0`,
    `ALTER TABLE missions ADD COLUMN estimated_cost_usd REAL DEFAULT 0`,
    // Phase 4: AGENTS.md columns
    `ALTER TABLE projects ADD COLUMN agents_md_local TEXT`,
    `ALTER TABLE projects ADD COLUMN agents_md_github_pr INTEGER`,
    `ALTER TABLE projects ADD COLUMN agents_md_status TEXT DEFAULT 'local'`,
    // Phase 5: Workspaces
    `CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      color TEXT DEFAULT '#8b5cf6',
      repo_paths TEXT DEFAULT '[]',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
    `ALTER TABLE projects ADD COLUMN workspace_id TEXT`,
    `ALTER TABLE missions ADD COLUMN workspace_id TEXT`,
    `ALTER TABLE knowledge_entries ADD COLUMN workspace_id TEXT`,
  ]

  for (const sql of migrations) {
    try {
      sqlite.exec(sql)
    } catch {
      // "duplicate column name" or similar — already applied, skip silently
    }
  }
}

let _db: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (!_db) {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
    const sqlite = new Database(DB_PATH)
    sqlite.pragma("journal_mode = WAL")
    sqlite.pragma("foreign_keys = ON")
    runMigrations(sqlite)
    _db = drizzle(sqlite, { schema })
  }
  return _db
}

export { schema }
