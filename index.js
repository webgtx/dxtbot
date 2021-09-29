const TelegramBot = require('node-telegram-bot-api');
const sqlite = require('sqlite-sync');
const os = require('os');
const { exec } = require("child_process");  

sqlite.connect('data/users.db');
sqlite.run('CREATE TABLE IF NOT EXISTS users(id INTEGER, name TEXT UNIQUE, pass TEXT)')
sqlite.insert('users', {id: 1, name: 'dxv1d', pass: '123'})

function runSh(command, chatId) {
  exec(command, (err, stdout, stderr) => {
          if (err) {
              bot.sendMessage(chatId,`error: ${err.message}`);
              return;
          }
          if (stderr) {
              bot.sendMessage(chatId,`stderr: ${stderr}`);
              return;
          }
          bot.sendMessage(chatId,`stdout: ${stdout}`);
  })
}

const token = 'token';
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const arr = msg.text.split(' ');
  const command = arr[0];
  const flags = arr.slice(1, arr.length);
  console.log(command, flags)

  switch(msg.text) {
    case('/start'):
      const opts = {
          reply_markup: {
              resize_keyboard: true,
              one_time_keyboard: false,
              keyboard: [['Чём Лёша сейчас занят?'], ['Архив'], ['Позвать меня'], ['Вебсайт']]
          }
      };
      bot.sendMessage(chatId, 'Привет Ань, я написал бота по приколу :) \nТут есть пару прикольных функций, так что тестируй', opts);
      break;
    case('Вебсайт'): 
      bot.sendMessage(chatId, 'https://webgtx.github.com');
      break;
    case('Чём Лёша сейчас занят?'):
      bot.sendMessage(chatId, 'Сейчас он пишет код 🖥🙃');
      bot.sendMessage(chatId, 'Данные о его сессии');
      runSh('w', chatId);
      break;
    case('Архив'):
      bot.sendMessage(chatId, 'а архива та нету 👍');
      break;
    case('Позвать меня'):
      bot.sendMessage(chatId, 'Ожидайте на линии, наш админ киевстара вам напишет :)')
      setTimeout(() => {
        bot.sendMessage(chatId ,'Пиииип, пииииип.');
      }, 2000)
      console.log(msg)
      break;
  }
});
