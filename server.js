const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const koaStatic = require('koa-static')
const cors = require('@koa/cors')
const favicon = require('koa-favicon')
const { createBundleRenderer } = require('vue-server-renderer')

const LRU = require('lru-cache')
const microCache = new LRU({
  max: 100,
  maxAge: 1000
})
function isCacheable (ctx) {
  return true
}

const {
  CODE_NOTFOUND,
  CODE_SERVER_ERROR,
  CODE_NOTFOUND_RESPONSE,
  CODE_SERVER_ERROR_RESPONSE
} = require('./constant/code')
const logger = require('./tools/logger')

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

const templatePath = resolve('./src/index.html')
const template = fs.readFileSync(templatePath, 'utf-8')

if (isProd) {
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  renderer = createRenderer(serverBundle, {
    template,
    clientManifest
  })
} else {
  readyPromise = require('./build/setup-dev-server')(server, templatePath, (bundle, options) => {
    renderer = createRenderer(bundle, options)
  })
}

// process render
async function render (ctx) {
  const s = Date.now()
  const cacheable = isCacheable(ctx)
  if (cacheable) {
    const hit = microCache.get(ctx.url)
    if (hit) {
      ctx.body = hit
      if (!isProd) {
        console.log(`whole request: ${Date.now() - s}ms`)
      }
      return
    }
  }

  function handleError (err) {
    console.log('')
    console.log(err)
    if (err.url) {
      ctx.redirect(err.url)
    } else if (err.code === CODE_NOTFOUND) {
      ctx.status = CODE_NOTFOUND
      ctx.body = CODE_NOTFOUND_RESPONSE
    } else {
      ctx.status = CODE_SERVER_ERROR
      ctx.body = CODE_SERVER_ERROR_RESPONSE
      console.error(`error during render : ${ctx.url}`)
    }
    logger.error(err)
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
    if (!isProd) {
      console.log(`whole request: ${Date.now() - s}ms`)
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
server.use(koaStatic(resolve('./dist')))
server.use(koaStatic(resolve('./src/static')))
server.use(favicon(resolve('./src/assets/logo-48.png')))

server.use(isProd ? render : renderDev)

const port = 3000
server.listen(port, () => {
  console.log('')
  console.log(`server started at localhost:${port}`)
})
