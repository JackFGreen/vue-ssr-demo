import fs from 'fs'
import path from 'path'
import Koa from 'koa'
import koaStatic from 'koa-static'
import cors from '@koa/cors'
import favicon from 'koa-favicon'
import { createBundleRenderer } from 'vue-server-renderer'
import LRU from 'lru-cache'

import renderTime from './middleware/renderTime'
import logger from './tools/logger'

import {
  CODE_NOTFOUND,
  CODE_SERVER_ERROR,
  CODE_NOTFOUND_RESPONSE,
  CODE_SERVER_ERROR_RESPONSE
} from './constant/code'

const microCache = new LRU({
  max: 100,
  maxAge: 1000
})
function isCacheable (ctx) {
  return true
}

const server = new Koa()
const isProd = process.env.NODE_ENV === 'production'

function resolve (...arg) {
  return path.resolve(__dirname, ...arg)
}

function createRenderer (bundle, options) {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      runInNewContext: false
    })
  )
}

// prod render
let renderer
// dev render
let readyPromise

const templatePath = resolve('./index.html')
const template = fs.readFileSync(templatePath, 'utf-8')

if (isProd) {
  const clientManifest = require('../vue-ssr-client-manifest.json')
  const serverBundle = require('../vue-ssr-server-bundle.json')
  renderer = createRenderer(serverBundle, {
    template,
    clientManifest
  })
} else {
  readyPromise = require('../../build/setup-dev-server')(
    server,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options)
    }
  )
}

// process render
async function render (ctx) {
  const cacheable = isCacheable(ctx)
  if (cacheable) {
    const hit = microCache.get(ctx.url)
    if (hit) {
      ctx.body = hit
      return true
    }
  }

  function handleError (err) {
    if (err.url) {
      ctx.redirect(err.url)
    } else if (err.code === CODE_NOTFOUND) {
      ctx.status = CODE_NOTFOUND
      ctx.body = CODE_NOTFOUND_RESPONSE
    } else {
      ctx.status = CODE_SERVER_ERROR
      ctx.body = CODE_SERVER_ERROR_RESPONSE
      logger.render.error(`[render error] [${ctx.url}]`)
    }
    logger.app.error(err)
  }

  const context = {
    url: ctx.url,
    title: 'vue-ssr-demo',
    meta: `
      <meta name="description" content="This is a Vue SSR demo">
      <meta name="keywords" content="Vue, SSR">
    `
  }

  try {
    const html = await renderer.renderToString(context)
    ctx.body = html
    if (cacheable) {
      microCache.set(ctx.url, html)
    }
  } catch (err) {
    handleError(err)
  }
}

// dev hot reload render
async function renderDev (ctx) {
  await readyPromise
  return render(ctx)
}

// render app
server.use(cors())
server.use(koaStatic(resolve('../../dist')))
server.use(koaStatic(resolve('../static')))
server.use(favicon(resolve('../static/logo-48.png')))

server.use(renderTime())
server.use(isProd ? render : renderDev)

const port = 3000
server.listen(port, () => {
  console.log('')
  console.log(`server started at localhost:${port}`)
})
