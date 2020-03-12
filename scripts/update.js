const path = require('path')
const crypto = require('crypto')
const fs = require('fs-extra')
const yml = require('js-yaml')
const aws = require('aws-sdk')

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
  region: 'ap-east-1',
})

const client = new aws.DynamoDB.DocumentClient()

const md5 = text => {
  return crypto.createHash('md5').update(text).digest('hex')
}

const createViewsItem = async (name) => {
  const params = {
    TableName: 'views',
    Item: {
      name,
      v: { i: 1 },
    },
  }
  return new Promise((resolve, reject) => {
    return client.put(params, (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

const getRecord = async (name) => {
  const params = {
    TableName: 'views',
    Key: { name },
  }
  return new Promise((resolve, reject) => {
    client.get(params, (err, data) => {
      if (err) return reject(err)
      if (!data || !data.Item) return resolve(false)
      resolve(true)
    })
  })
}

const update = async () => {
  const domainsString = await fs.readFile(path.join(__dirname, '../src/domains.yml'), 'utf-8')
  const domains = yml.safeLoad(domainsString).domains
  let newDomains = 0
  
  await Promise.all(domains.map(async item => {
    let name = typeof item === 'string' ? item : item.name
    if (!name) return
    const indexName = md5(`https://${name}`)
    const hasRecord = await getRecord(indexName)
    console.log(`\n-- ${name} ${hasRecord ? 'got' : 'none'}`)
    
    if (hasRecord) return
    newDomains ++
    await createViewsItem(indexName)
    console.log(`   ${name} register completed`)
  }))
  console.log(`\n  Solved ${domains.length}, contains ${newDomains} new domains.`)
}

update()
  .then()
  .catch(err => {
    console.log(err)
  })
