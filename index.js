const keybaseChatBot = require('keybase-chat-bot')
const https = require('https')


const CHANNEL = '' // SET ME!

const bot = new keybaseChatBot.Bot()
bot.init({verbose: false}, function(err) {
  if (!err) {
    var onMessages = function(m) {
      const channel  = m.channel
      const messages = m.messages
      messages.map(m => {
        msg = m.msg.content.text.body.split(' ')
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
                      price = cmc[0].symbol + ' $' + Number(cmc[0].price_usd).toFixed(2) + ' (B' + cmc[0].price_btc + ')'
                      bot.chatSend({
                        channel: channel,
                        message: {body: price}
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
        name: CHANNEL,
        public: false,
        topic_type: 'chat'
      }
    })
  }
})
