
import express from 'express'
import { renderPage } from 'vike/server'
import { root } from './root.js'
import fetch from 'node-fetch'
import apollo from '@apollo/client'
const { ApolloClient, createHttpLink, InMemoryCache } = apollo

startServer()

async function startServer() {
  const app = express()

  const vite = await import('vite')
  const viteDevMiddleware = (
    await vite.createServer({
      root,
      server: { middlewareMode: true }
    })
  ).middlewares
  app.use(viteDevMiddleware)

  app.get('*', async (req, res, next) => {
    // It's important to create an entirely new instance of Apollo Client for each request.
    // Otherwise, our response to a request might include sensitive cached query results
    // from a previous request. Source: https://www.apollographql.com/docs/react/performance/server-side-rendering/#example
    const apolloClient = makeApolloClient()

    const pageContextInit = {
      urlOriginal: req.originalUrl,
      apolloClient
    }
    const pageContext = await renderPage(pageContextInit)

    const { httpResponse } = pageContext
    if (!httpResponse) {
      return next()
    } else {
      const { body, statusCode, headers } = httpResponse
      headers.forEach(([name, value]) => res.setHeader(name, value))
      res.status(statusCode).send(body)
    }
  })

  const port = 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}

function makeApolloClient() {
  const apolloClient = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: 'https://countries.trevorblades.com',
      fetch
    }),
    cache: new InMemoryCache()
  })
  return apolloClient
}
