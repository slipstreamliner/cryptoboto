const keybaseChatBot = require('keybase-chat-bot')
const https = require('https')


const TEAM = '' // SET ME!
const CHANNEL = 'general' // SET ME!

const bot = new keybaseChatBot.Bot()
bot.init({verbose: false}, function(err) {
  if (!err) {
    var onMessages = function(m) {
      const channel  = m.channel
      const messages = m.messages
      messages.map(m => {
        let msg = ''
        if (m.msg.content.text) {
          msg = m.msg.content.text.body.split(' ')
        }
        if (msg.length > 1) {
          if (msg[0] === '@' + bot.myInfo().username) {
            let cmc_raw = ''
            const req = https.get({
              hostname: 'api.coinmarketcap.com',
              path: '/v1/ticker/' + msg[1].toLowerCase() + '/',
              method: 'GET'}, res => {
                res.on('data', doc => cmc_raw += doc)
                res.on('end', () => {
                  try {
                    const cmc = JSON.parse(cmc_raw)
                    if (cmc.length) {
                      let output = cmc[0].symbol + ' $' + Number(cmc[0].price_usd).toFixed(4) + ' (B' + cmc[0].price_btc + ') ' + cmc[0].percent_change_24h + '% 24h — $' + Number(cmc[0].market_cap_usd).toLocaleString() + ' MC'
                      bot.chatSend({
                        channel: channel,
                        message: {body: output}
                      }, function(err, res) {
                        if (err) console.log(err)
                      })
                    }
                  } catch(err) {
                    console.error(err.message)
                  }
                })
              }
            )
          }
        }
      })
    }
    bot.watchChannelForNewMessages({
      onMessages: onMessages,
      channel: {
        name: TEAM,
        members_type: 'team',
        topic_name: CHANNEL
      }
    })
  }
})
