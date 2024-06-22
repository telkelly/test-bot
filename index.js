const TelegramBot = require("node-telegram-bot-api");
const {gameOptions, againOptions} = require('./options')
const token = "7383975274:AAGGmB9hpLlC68NI5K4OBF9DgJGJ68FEN2Q";

const bot = new TelegramBot(token, { polling: true });

const chats = {};

bot.setMyCommands([
  { command: "/start", description: "Welcome" },
  { command: "/info", description: "Know who are you" },
  { command: "/game", description: "Guess number from 1 till 10" },
]);

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `guess number from 1 till 9`);
  const ranNum = Math.floor(Math.random() * 10);
  chats[chatId] = ranNum;
  console.log(ranNum);
  await bot.sendMessage(chatId, "Guess", gameOptions);
};

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
      await bot.sendMessage(chatId, `Welcome, bro`);
      return bot.sendSticker(
        chatId,
        `https://tlgrm.ru/_/stickers/8eb/10f/8eb10f4b-8f4f-4958-aa48-80e7af90470a/256/44.webp`
      );
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Your name is ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, `Can't understand you`);
  });

  bot.on("callback_query", async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Congratz, you win,data is ${data} the bot's num is ${chats[chatId]}`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `No congratz, you don't win, data is ${data} the bot's num is ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
