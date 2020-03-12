const aws = require('aws-sdk')

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
  region: 'ap-east-1',
})

const docClient = new aws.DynamoDB.DocumentClient()

const makeParams = (name, key) => {
  return {
    TableName: 'views',
    Key: {
      name,
    },
    UpdateExpression: `SET #v.#key = if_not_exists(#v.#key, :zero) + :val`,
    ExpressionAttributeNames: {
      '#v': 'v',
      '#key': key,
    },
    ExpressionAttributeValues: {
      ':zero': 0,
      ':val': 1,
    },
  }
}

const updateViewsCount = async(name, key, count = 0) => {
  const params = makeParams(name, key)
  return new Promise((resolve, reject) => {
    return docClient.update(params, (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

const createViewsItem = async(name, key) => {
  const params = {
    TableName: 'views',
    Item: {
      name,
      v: { [key]: 1 },
    },
  }
  return new Promise((resolve, reject) => {
    return docClient.put(params, (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

const getViews = async(name, key) => {
  const params = {
    TableName: 'views',
    Key: {
      name,
    },
  }
  return new Promise((resolve, reject) => {
    docClient.get(params, (err, data) => {
      if (err) return reject(err)
      if (!data || !data.Item) return resolve({
        viewsCount: 0, pagesCount: 0, hasItem: false,
      })
      const viewsCount = (data.Item.v || {})[key]
      const pagesCount = Object.keys((data.Item.v || {})).length
      
      return resolve({
        viewsCount: viewsCount ? viewsCount : 0,
        pagesCount: pagesCount,
        hasItem: true,
      })
    })
  })
}

module.exports = {
  updateViewsCount,
  createViewsItem,
  getViews,
}
