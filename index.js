const Heroku = require('heroku-client')
const heroku = new Heroku({ token: process.env.HEROKU_API_TOKEN })
const appId = process.env.HEROKU_APP_ID

exports.handle = function(event, context, callback) {
  console.log('Received event: %j', event)
  const { appId, updates } = event

  heroku
    .patch(`/apps/${appId}/formation`, { body: { updates } })
    .then(apps => {
      for (var app of apps) {
        console.log(`Successfully scaled ${app.name} to ${app.quantity} dynos`)
      }
  
      context.done()
    })
    .catch(err => {
      console.error(`Failed to scale ${appId}`, err)
      callback(err)
    })
}
