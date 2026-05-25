import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from '../../db/schema'
import path from 'path'
import fs from 'fs'

const sqlite = new Database(':memory:')
sqlite.pragma('foreign_keys = ON')

const migrationSql = fs.readFileSync(
  path.join(__dirname, '../../db/migrations/0000_sleepy_gorilla_man.sql'),
  'utf-8'
)
for (const stmt of migrationSql.split('--> statement-breakpoint')) {
  const trimmed = stmt.trim()
  if (trimmed) sqlite.exec(trimmed)
}

export const db = drizzle(sqlite, { schema })

export type DB = typeof db

export function clearDb() {
  sqlite.exec('DELETE FROM invoices')
  sqlite.exec('DELETE FROM job_photos')
  sqlite.exec('DELETE FROM jobs')
  sqlite.exec('DELETE FROM customers')
}
