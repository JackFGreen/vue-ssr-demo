import logger from '../tools/logger'

const isProd = process.env.NODE_ENV === 'production'

export default () => async (ctx, next) => {
  const s = Date.now()
  const isCache = await next()
  if (!isProd) {
    const renderTitle = `[render${isCache ? ' cache' : ''}]`
    logger.render.info(`${renderTitle} [${ctx.url}] whole request: ${Date.now() - s}ms`)
  }
}
