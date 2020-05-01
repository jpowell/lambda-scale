const Heroku = require('heroku-client')
const decrypt = require('./decrypt')
const config = require('./dyno-config')

exports.handler = async (ev, context, callback) => {
  console.log('Received event: %j', ev)
  const { appId, formation } = ev
  const appConfig = config[appId] || {}
  const updates = appConfig[formation] || appConfig.default

  try {
    if (!updates) { throw `No config error` }

    const token = await decrypt(process.env.HEROKU_API_TOKEN)
    const heroku = new Heroku({ token })

    const reponse = await heroku.patch(`/apps/${appId}/formation`, { body: { updates } })

    console.log(`Updated Formation for ${appId}`, reponse)

    context.done()
  } catch(err) {
    console.error(`Failed to scale ${appId}`, err)
    callback(err)
  }
}
