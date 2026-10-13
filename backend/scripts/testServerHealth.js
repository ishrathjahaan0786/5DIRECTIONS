import app from '../src/app.js'

const server = app.listen(5099, async () => {
  console.log('Testing server running on port 5099...')
  try {
    const res = await fetch('http://localhost:5099/api/health')
    const json = await res.json()
    console.log('[SUCCESS] /api/health responded with status:', res.status)
    console.log(JSON.stringify(json, null, 2))
  } catch (err) {
    console.error('[ERROR] Health check failed:', err)
  } finally {
    server.close(() => {
      console.log('Test server closed cleanly.')
      process.exit(0)
    })
  }
})
