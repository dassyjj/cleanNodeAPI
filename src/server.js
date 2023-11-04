import http from 'node:http'
import { jsonMiddleware } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const app = http.createServer(async (req, res) => {
  const {method, url} = req

  await jsonMiddleware(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route){
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  // Early return
  return res.writeHead(404).end()
})

app.listen(3333)