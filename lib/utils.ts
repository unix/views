import { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'crypto'
import { URL } from 'url'
import domains from '../src/domains.json'

const makeSvg = (req: VercelRequest, res, count: number = 0): string => {
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

export const setViewsStatus = (res: VercelResponse, status: string): void => {
  res.setHeader('x-view-status', status)
}

export const setAllowOrigin = (req: VercelRequest, res: VercelResponse): void => {
  if (req.query.json && req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
  }
}

export const setContentType = (req: VercelRequest, res: VercelResponse): void => {
  const contentType = req.query.json ? 'application/json' : 'image/svg+xml'
  res.setHeader('Content-Type', contentType)
}

export type RequestViewer = {
  viewId: string
  key: string
  host?: string
  page?: string
}

export const getViewsKeys = (req: VercelRequest): RequestViewer => {
  let { hostname } = new URL(req.headers.referer)
  if (!hostname) throw new Error('not found origin')

  const isAllow = domains.includes(hostname)
  if (!isAllow) throw new Error('not allow')

  const viewId = md5(hostname)
  const key = md5(req.query.key as string)
  return {
    viewId,
    key,
    host: `${hostname}`,
    page: `${req.query.key}`,
  }
}

export const ok = (req: VercelRequest, res: VercelResponse, count: number = 0): void => {
  if (req.query.json) {
    res.status(200).send({ count })
  } else {
    res.status(200).send(makeSvg(req, res, count))
  }
}

export const md5 = (text: string): string => {
  return crypto.createHash('md5').update(text).digest('hex')
}

export const onRead = (req: VercelRequest, key: string): boolean => {
  return !!req.cookies[key]
}

export const setReadTime = (
  req: VercelRequest,
  res: VercelResponse,
  key: string,
): void => {
  if (onRead(req, key)) return
  if (res.writableEnded || !req.query.unique) return
  res.setHeader(
    'Set-Cookie',
    `${key}=1;expires=${new Date(Date.now() + 50000).toUTCString()};httpOnly`,
  )
}
