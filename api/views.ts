import { VercelRequest, VercelResponse } from '@vercel/node'
import * as _ from '../lib/utils'
import { findPageByMD5Key, updatePageByMD5Key, createPageByViewId } from '../lib/services'

module.exports = async (req: VercelRequest, res: VercelResponse) => {
  _.setAllowOrigin(req, res)
  _.setContentType(req, res)
  _.setViewsStatus(res, 'bad')
  if (!req.headers.referer || !req.query.key) return _.ok(req, res)

  try {
    const currentView = _.getViewsKeys(req)
    const { viewId, key } = currentView
    const { hasPage, count } = await findPageByMD5Key(viewId, key)
    _.setReadTime(req, res, key)
    _.setViewsStatus(res, 'ok')

    if (_.onRead(req, key) || req.query.readonly) return _.ok(req, res, count)

    if (!hasPage) {
      const { limitExceeded } = await createPageByViewId(currentView)
      if (limitExceeded) {
        _.setViewsStatus(res, 'limit-exceeded')
      }
      return _.ok(req, res, 1)
    }
    _.ok(req, res, count)

    await updatePageByMD5Key(key)
  } catch (e) {
    console.log(`referer: ${req.headers.referer}, key: ${req.query.key}\n`, e)
    if (res.writableEnded) return
    return _.ok(req, res)
  }
}
