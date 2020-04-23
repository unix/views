const client = require('../lib/client')
const utils = require('../lib/utils')


module.exports = async(req, res) => {
  if (req.query.json && req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
  }
  const contentType = req.query.json ? 'application/json' : 'image/svg+xml'
  res.setHeader('Content-Type', contentType)
  
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
    utils.setViewsStatus(res, hasItem ? 'ok' : 'unallowed')
    utils.ok(req, res, viewsCount)

    if (!hasItem) {
      // return await client.createViewsItem(name, key)
      return
    }
    if (utils.onRead(req, key) || req.query.readonly) return
    
    if (limitExcceeded) return
    await client.updateViewsCount(name, key, viewsCount)
  } catch (e) {
    console.log(`Error connecting to Dynamo: ${e}`)
    if (!res.writableEnded) {
      utils.ok(req, res)
    }
  }
  
}
