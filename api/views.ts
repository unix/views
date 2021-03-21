import { VercelRequest, VercelResponse } from '@vercel/node'
import * as utils from '../lib/utils'
import * as services from '../lib/services'

module.exports = async (req: VercelRequest, res: VercelResponse) => {
  utils.setAllowOrigin(req, res)
  utils.setContentType(req, res)
  utils.setViewsStatus(res, 'bad')
  if (!req.headers.referer || !req.query.key) return utils.ok(req, res)

  try {
    const { viewId, key } = utils.getViewsKeys(req)
    const { hasPage, count } = await services.findPage(viewId, key)
    utils.setReadTime(req, res, key)
    utils.setViewsStatus(res, 'ok')

    if (utils.onRead(req, key) || req.query.readonly) return utils.ok(req, res, count)

    if (!hasPage) {
      const { limitExcceeded } = await services.createPage(viewId, key)
      if (limitExcceeded) {
        utils.setViewsStatus(res, 'limit-exceeded')
      }
      return utils.ok(req, res, 1)
    }
    utils.ok(req, res, count)

    await services.updatePage(key)
  } catch (e) {
    console.log(`referer: ${req.headers.referer}, key: ${req.query.key}\n`, e)
    if (res.writableEnded) return
    return utils.ok(req, res)
  }
}
