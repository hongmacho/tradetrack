import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import path from 'path'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

const DB_PATH = path.join(process.cwd(), 'tradetrack.db')

const sqlite = new Database(DB_PATH)
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')
sqlite.pragma('busy_timeout = 30000')

export const db = drizzle(sqlite, { schema })

migrate(db, { migrationsFolder: path.join(process.cwd(), 'db/migrations') })

export type DB = typeof db
