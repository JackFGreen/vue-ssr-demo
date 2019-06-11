const fs = require("fs");
const path = require("path");
const Koa = require("koa");
const static = require("koa-static");
const favicon = require('koa-favicon')
const { createBundleRenderer } = require("vue-server-renderer");

const createApp = require("./entry-server");

const {
  CODE_NOTFOUND,
  CODE_SERVER_ERROR,
  CODE_NOTFOUND_RESPONSE,
  CODE_SERVER_ERROR_RESPONSE
} = require("./constant/code");
const logger = require("./tools/logger");

const server = new Koa();
const isProd = process.env.NODE_ENV === "production";

function resolve(...arg) {
  return path.resolve(__dirname, ...arg);
}

// prod render
let renderer;
// dev render
let readyPromise;

const templatePath = resolve("./index.html");
const template = fs.readFileSync(templatePath, "utf-8");

if (isProd) {
  const clientManifest = require("../dist/vue-ssr-client-manifest.json");
  const serverBundle = require("../dist/vue-ssr-server-bundle.json");
  renderer = createBundleRenderer(serverBundle, {
    template,
    clientManifest,
    runInNewContext: false
  });
} else {
  readyPromise = require("../build/setup-dev-server")(
    server,
    templatePath,
    (bundle, options) => {
      renderer = createBundleRenderer(bundle, options);
    }
  );
}

// process render
async function render(ctx) {
  const s = Date.now();

  function handleError(err) {
    if (err.code === CODE_NOTFOUND) {
      ctx.status = CODE_NOTFOUND;
      ctx.body = CODE_NOTFOUND_RESPONSE;
    } else {
      ctx.status = CODE_SERVER_ERROR;
      ctx.body = CODE_SERVER_ERROR_RESPONSE;
    }
    logger.error(err);
  }

  const context = {
    url: ctx.url,
    title: "vue-ssr-demo",
    meta: `
      <meta name="description" content="This is a Vue SSR demo">
      <meta name="keywords" content="Vue, SSR">
    `
  };

  try {
    const html = await renderer.renderToString(context);
    ctx.body = html;
    if (!isProd) {
      console.log(`whole request: ${Date.now() - s}ms`);
    }
  } catch (err) {
    handleError(err);
  }
}

// dev hot reload render
async function renderDev(ctx) {
  try {
    await readyPromise;
    return render(ctx);
  } catch (err) {
    handleError(err)
  }
}
// render app
server.use(static(resolve("../")));
server.use(favicon(resolve('../public/logo-48.png')));

server.use(isProd ? render : renderDev);

server.listen(3000);
