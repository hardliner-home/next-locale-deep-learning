const express = require('express')
const next = require('next')
// const nextI18NextMiddleware = require('next-i18next/middleware').default

const nextI18next = require('./i18n')

const port = process.env.PORT || 8080
const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler();

(async () => {
  await app.prepare()
  const server = express()

  await nextI18next.initPromise
  // server.use(nextI18NextMiddleware(nextI18next))

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  await server.listen(port)
  console.log(`> Ready on http://localhost:${port}`)
})()
