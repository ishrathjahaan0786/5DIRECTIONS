import app from './app.js'

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`\n=================================================`)
  console.log(` 5Directions Backend API running on port ${PORT}`)
  console.log(` Base URL: http://localhost:${PORT}`)
  console.log(` Health Check: http://localhost:${PORT}/api/health`)
  console.log(`=================================================\n`)
})
