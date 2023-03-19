const puppeteer = require('puppeteer');
const cron = require('node-cron');
const TelegramBot = require('node-telegram-bot-api')
const Token = '6235639134:AAFPJIcTaQo0TDQAcPgaayUSyOdjVncmSPc'
const API = new TelegramBot(Token, { polling: true })
var chatId;

var date = new Date();
var days = ["воскресенье", "понедельник", "вторник", "среду", "четверг", "пятницу", "субботу"];
var content = [__dirname + '/понедельник.jpg', __dirname + '/вторник.jpg', __dirname + '/среда.jpg', __dirname + '/четверг.jpg', __dirname + '/пятница.jpg', __dirname + '/суббота.jpg'];

var auto = false;

function update() {

    if (days[date.getDay() + 1] != "воскресенье") {
        
        API.sendPhoto(chatId, content[date.getDay()], {caption: 'базовое расписание на ' + days[date.getDay() + 1] + ":"});

        (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('http://чхмт.рф/zamena/spo.php?a=0');
            await page.screenshot({ path: 'zamena.png' });
            await browser.close();
        })();

        var zamena = __dirname + '/замены.png';
        
        API.sendPhoto(chatId, zamena, {caption: "замены:"});

    } else {

        API.sendMessage(chatId, 'вы завтра отдыхаете, парни!');   

    }

}

cron.schedule('* * * * *', function() {

    if (auto) {

        API.sendMessage(chatId, "автоматическая рассылка!");   

        update();

        console.log("автоматическая рассылка была совершена!");

    } else {

        console.log("автоматическая рассылка отключена!");

    }

});

API.onText(/\/start/, (msg) => {

    chatId = msg.chat.id;

    API.sendMessage(chatId, 'махорка бот запущен.');

});

API.onText(/\/update/, (msg) => { update(); });

API.onText(/\/auto/, (msg) => {

    auto = !auto;

    if (auto) {

        API.sendMessage(chatId, 'автоматическая рассылка включена!');

    } else {

        API.sendMessage(chatId, 'автоматическая рассылка отключена!');

    }

});

API.onText(/\/info/, (msg) => {

    API.sendMessage(chatId, 'махорка бот версии 1.0.\nвторой семестр 2022-2023 учебного года.');

});