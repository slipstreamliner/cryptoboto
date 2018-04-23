var keybaseChatBot = require('keybase-chat-bot')

var bot = new keybaseChatBot.Bot()
bot.init({verbose: false}, function(err) {
  if (!err) {
    var channel = {
      name: 'aeto,' + bot.myInfo().username,
      public: false,
      topic_type: 'chat'
    }
    var send_arg = {
      channel: channel,
      message: {
        body: 'Hello aeto! Saying hello from my device ' + bot.myInfo().devicename
      }
    }
    bot.chatSend(send_arg, function(err) {
      console.log('That probably sent!', err)
    })
  }
})
