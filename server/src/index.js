import { createApp } from './app.js'
import { getDb } from './db.js'
import { PORT, HOST, DB_FILE } from './config.js'

// Initialize storage eagerly so schema errors surface at startup.
getDb()
console.log(`[db] using SQLite at ${DB_FILE}`)

const app = createApp()

app.listen(PORT, HOST, () => {
  console.log(`[server] listening on http://${HOST}:${PORT}`)
})
