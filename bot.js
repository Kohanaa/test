require("dotenv").config();
const telegramController=require("./controllers/telegram")
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/test/, async (msg) => {
  telegramController.test(bot,msg)
});
bot.onText(/\/stats/, async (msg) => {
  telegramController.stats(bot,msg)
});
bot.onText(/\/next/, async (msg) => {
  telegramController.next(bot,msg)
});
bot.on("callback_query", async (ctx) => {
  console.log(ctx);
  const {
    from:{id:user_id},
    message:{chat:{id:chat_id}},
    data
  }=ctx
  const [action, param2, param3] = JSON.parse(data);

  if(action=='test_choice') { // нажал на кнопку выбора теста
    telegramController.testChoice(bot, chat_id, user_id, param2);
  } else if(action=='question_choice') { // нажал на кнопку выбора вопроса
    telegramController.questionChoice(bot, chat_id, user_id, param2);
  } else if(action=='option_choice') { // нажал на кнопку ответа на вопрос
    telegramController.optionChoice(bot, chat_id, user_id, param2,param3);
  } else {
    bot.sendMessage(chat_id, 'Action is unavailable');
  }
});