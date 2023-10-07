// This file isn't processed by Vite, see https://github.com/vikejs/vike/issues/562
// Consequently:
//  - When changing this file, you needed to manually restart your server for your changes to take effect.
//  - To use your environment variables defined in your .env files, you need to install dotenv, see https://vike.dev/env
//  - To use your path aliases defined in your vite.config.js, you need to tell Node.js about them, see https://vike.dev/path-aliases

import express from 'express'
import { renderPage } from 'vike/server'
import { root } from './root.js'
import fetch from 'node-fetch'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

(async () => {
  const { setImportBuildGetters } = await import('../node_modules/vike/dist/esm/node/runtime/globalContext/loadImportBuild.js');
  setImportBuildGetters({
    pageFiles: () => import(null),
    clientManifest: () => import(null),
    pluginManifest: () => import(null),
  });
})()

startServer()

async function startServer() {
  const app = express()

  app.use(express.static(`${root}/dist/client`))

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
