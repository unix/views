const client = require('../lib/client')
const utils = require('../lib/utils')


module.exports = async(req, res) => {
  res.setHeader('content-type', 'image/svg+xml')
  utils.setViewsStatus(res, 'bad')
  if (!req.headers.referer || !req.query.key) return utils.ok(req, res)

  let name, key
  try {
    const { origin } = new URL(req.headers.referer)
    if (!origin) return utils.ok(req, res)
    name = utils.md5(origin)
    key = utils.md5(req.query.key)
  } catch (e) {
    if (res.writableEnded) return
    return utils.ok(req, res)
  }

  try {
    const { viewsCount, pagesCount, hasItem } = await client.getViews(name, key)
    const limitExcceeded = utils.checkLimitExcceeded(res, pagesCount)
    utils.setReadTime(req, res, key)
    utils.setViewsStatus(res, 'ok')
    utils.ok(req, res, viewsCount)

    if (!hasItem) return await client.createViewsItem(name, key)
    if (utils.onRead(req, key)) return
    if (limitExcceeded) return

    await client.updateViewsCount(name, key, viewsCount)
  } catch (e) {
    console.log(`Error connecting to Dynamo: ${e}`)
    if (!res.writableEnded) {
      utils.ok(req, res)
    }
  }
  
}
