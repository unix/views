import { PrismaClient } from '@prisma/client'
import { RequestViewer } from './utils'

const prisma = new PrismaClient()

export const findPageByMD5Key = async (
  viewId: string,
  key: string,
): Promise<{
  hasPage: boolean
  count: number
}> => {
  const view = await prisma.view.findUnique({
    where: { name: viewId },
    include: { pages: { where: { name: key } } },
  })
  const hasPage = view?.pages && view?.pages.length > 0
  const currentCount = hasPage ? view?.pages[0]?.count : 1
  const count = hasPage ? currentCount + 1 : 1
  return {
    hasPage,
    count,
  }
}

// export const

export const createPageByViewId = async ({
  viewId,
  key,
  host,
  page,
}: RequestViewer): Promise<{ limitExceeded: boolean }> => {
  const count = await prisma.page.count({ where: { name: key } })
  if (count > 100)
    return {
      limitExceeded: true,
    }
  const r = await prisma.view.upsert({
    where: { name: viewId },
    update: {
      host,
      pages: {
        create: {
          name: key,
          page,
          count: 1,
        },
      },
    },
    create: {
      name: viewId,
      host,
      pages: {
        connectOrCreate: {
          where: { name: key },
          create: {
            name: key,
            page,
            count: 1,
          },
        },
      },
    },
  })
  return {
    limitExceeded: false,
  }
}

export const updatePageByMD5Key = async (key: string): Promise<void> => {
  await prisma.page.update({
    where: { name: key },
    data: {
      count: { increment: 1 },
    },
  })
}
