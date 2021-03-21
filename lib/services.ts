import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const findPage = async (
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

export const createPage = async (
  viewId: string,
  key: string,
): Promise<{ limitExcceeded: boolean }> => {
  const count = await prisma.page.count({ where: { name: key } })
  if (count > 100)
    return {
      limitExcceeded: true,
    }
  await prisma.view.upsert({
    where: { name: viewId },
    update: {
      pages: {
        create: {
          name: key,
          count: 1,
        },
      },
    },
    create: {
      name: viewId,
      pages: {
        connectOrCreate: {
          where: { name: key },
          create: {
            name: key,
            count: 1,
          },
        },
      },
    },
  })
  return {
    limitExcceeded: false,
  }
}

export const updatePage = async (key: string, count: number): Promise<void> => {
  await prisma.page.update({
    where: { name: key },
    data: {
      count,
    },
  })
}
