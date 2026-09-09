import { createApp } from './app.js'
import { PORT, HOST } from './config.js'

const app = createApp()

app.listen(PORT, HOST, () => {
  console.log(`[server] listening on http://${HOST}:${PORT}`)
})
