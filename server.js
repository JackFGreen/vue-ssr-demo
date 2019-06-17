const fs = require("fs");
const path = require("path");
const Koa = require("koa");
const koaStatic = require("koa-static");
const favicon = require("koa-favicon");
const { createBundleRenderer } = require("vue-server-renderer");

const {
  CODE_NOTFOUND,
  CODE_SERVER_ERROR,
  CODE_NOTFOUND_RESPONSE,
  CODE_SERVER_ERROR_RESPONSE
} = require("./src/constant/code");
const logger = require("./src/tools/logger");

const server = new Koa();
const isProd = process.env.NODE_ENV === "production";

function resolve(...arg) {
  return path.resolve(__dirname, ...arg);
}

function createRenderer(bundle, options) {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      runInNewContext: false
    })
  );
}

// prod render
let renderer;
// dev render
let readyPromise;

const templatePath = resolve("./src/index.html");
const template = fs.readFileSync(templatePath, "utf-8");

if (isProd) {
  const clientManifest = require("./dist/vue-ssr-client-manifest.json");
  const serverBundle = require("./dist/vue-ssr-server-bundle.json");
  renderer = createRenderer(serverBundle, {
    template,
    clientManifest
  });
} else {
  readyPromise = require("./build/setup-dev-server")(
    server,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options);
    }
  );
}

// process render
async function render(ctx) {
  const s = Date.now();

  function handleError(err) {
    console.log("");
    console.log(err);
    if (err.url) {
      res.redirect(err.url);
    } else if (err.code === CODE_NOTFOUND) {
      ctx.status = CODE_NOTFOUND;
      ctx.body = CODE_NOTFOUND_RESPONSE;
    } else {
      ctx.status = CODE_SERVER_ERROR;
      ctx.body = CODE_SERVER_ERROR_RESPONSE;
      console.error(`error during render : ${ctx.url}`);
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
    handleError(err);
  }
}

// render app
server.use(koaStatic(resolve("./")));
server.use(favicon(resolve("./public/logo-48.png")));

server.use(isProd ? render : renderDev);

const port = 3000;
server.listen(port, () => {
  console.log("");
  console.log(`server started at localhost:${port}`);
});
