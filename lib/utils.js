const crypto = require('crypto')

const makeSvg = (req, count = 0) => {
  const {
    width = '100%',
    height = '100%',
    size = 12,
    weight = 'normal',
    fill = '212529',
    family = '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
    suffix = ' views',
    x = '0',
    y = '50%',
    dy = '0',
    anchor = 'start',
    baseline = 'middle',
  } = req.query
  return `<svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<text x="${x}" y="${y}" text-anchor="${anchor}" fill="#${fill}" dy="${dy}"
  font-family="${family}" font-size="${size}" font-weight="${weight}"
  letter-spacing="1.2" dominant-baseline="${baseline}">${count}${suffix}</text></svg>`
}

const setViewsStatus = (res, status) => {
  res.setHeader('x-view-status', status)
}

const checkLimitExcceeded = (res, count) => {
  const limitExcceeded = count >= 100
  res.setHeader('x-view-count', limitExcceeded ? 'limit-exceeded' : count)
  return limitExcceeded
}

const ok = (req, res, count = 0) => {
  res.status(200).send(makeSvg(req, count))
}

const md5 = text => {
  return crypto.createHash('md5').update(text).digest('hex')
}

const onRead = (req, key) => {
  return !!req.cookies[key]
}

const setReadTime = (req, res, key) => {
  if (onRead(req, res)) return
  if (res.writableEnded || !req.query.unique) return
  res.setHeader('Set-Cookie', `${key}=1;expires=${new Date(Date.now()+900000).toUTCString()};httpOnly`)
}

module.exports = {
  setViewsStatus,
  checkLimitExcceeded,
  ok,
  md5,
  onRead,
  setReadTime,
}
