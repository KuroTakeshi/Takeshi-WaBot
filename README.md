![Logo](https://files.catbox.moe/45rmzn.jpg)

**Takeshi-WaBot | 1.1.0** | ***create by KuroTakeshi***


```> Simple WhatsApp bot Using Library Baileys```

```javascript
{
  message: Message { conversation: '>_ Welcome to Takeshi-WaBot' },
  type: 'conversation',
  msg: '>_ Welcome to Takeshi-WaBot',
  isMedia: false,
  key: {
    remoteJid: '0@s.whatsapp.net',
    participant: '0@s.whatsapp.net',
    fromMe: false,
    id: '5780C33F89C0BE600B6D71DF79C4FC02'
  },
  cht: '0@s.whatsapp.net',
  fromMe: false,
  id: '5780C33F89C0BE600B6D71DF79C4FC02',
  device: 'android',
  isBot: false,
  isGroup: false,
  participant: '0@s.whatsapp.net',
  sender: '0@s.whatsapp.net',
  mentions: [],
  body: '>_ Welcome to Takeshi-WaBot',
  prefix: '',
  command: '>_',
  args: [ 'Welcome', 'to', 'Takeshi-WaBot' ],
  text: 'Welcome to Takeshi-WaBot',
  isOwner: true,
  download: [AsyncFunction (anonymous)]
}
```
## ⚙️ Settings Bot ***( settings/configuration.js )***

```javascript
const fs = require("fs");

const config = {
  author: "Lorenzxz",
  botNumber: "0",
  database: "takeshi-database",
  inviteCode: "CtnxNzmlxLOJqeSlxdQXTz",
  name: "- Takeshi - Simple WhatsApp bot",
  owner: ["0", "0"],
  prefix: ["!", ".", "#", "/"],
  sessions: "sessions",
  tz: "Asia/Jakarta",

  id: {
    group: "1@g.us",
    newsletter: "1@newsletter",
  },

  style: {
    bold: (text) => `*${text}*`,
    boldItalic: (text) => `_*${text}*_`,
    boldUnderline: (text) => `**_${text}_**`,
    bullet: (text) => `• ${text}`,
    italic: (text) => `_${text}_`,
    monospace: (text) => `\`\`\`${text}\`\`\``,
    number: (num, text) => `${num}. ${text}`,
    quote: (text) => `> ${text}`,
    strikethrough: (text) => `~${text}~`,
  },

  settings: {
    alwaysOnline: true,
    antiCall: true,
    autoBio: true,
    autoFollowNewsletter: false,
    autoGoodbye: false,
    autoJoinGc: false,
    autoTyping: false,
    autoWelcome: false,
    dmOnly: false,
    groupBotOnly: false,
    groupOnly: false,
    online: false,
    readChat: false,
    readSw: false,
    reactSw: false,
    sendConnectionMessage: false,
    statusOnly: false,
  },

  messages: {
    admin:
      "> 👮 *Fitur ini hanya untuk Admin Grup*... Pastikan Anda adalah admin untuk menggunakannya.",
    badwords:
      "> ❎ *Mohon maaf*... Anda tidak diperbolehkan berkata kasar disini, saya akan menghapus pesan anda",
    botAdmin:
      "> ⚠️ *Bot harus menjadi admin grup*... Berikan hak admin kepada bot untuk menggunakan fitur ini.",
    call: "> 🚫 *Mohon maaf*... Kami tidak bisa menerima telepon dari Anda, anti call aktif!",
    done: "> 🎉 *Selesai!*... Terima kasih sudah menggunakan fitur ini!",
    error:
      "> ❌ *Terjadi kesalahan*... Silakan laporkan kepada pemilik bot untuk diperbaiki.",
    errorlink:
      "> 🔗 *Harap masukkan URL yang valid*... URL harus dimulai dengan 'https://'.",
    example: "> ❎ *Contoh Penggunaan Fitur*",
    group:
      "> 👥 *Fitur ini hanya tersedia di grup*... Pastikan Anda berada di grup WhatsApp untuk mengakses fitur ini.",
    maintenance:
      "> 🚧 *Fitur sedang dalam pemeliharaan*... Mohon tunggu hingga perbaikan selesai.",
    nsfw: "> ❎ *Media yang Anda kirimkan mengandung unsur pornografi,* kami akan menghapus-nya.",
    notFound: "> *❎ Tidak ada yang ditemukan!* Coba lagi nanti.",
    owner:
      "> 🧑‍💻 *Fitur ini hanya untuk pemilik bot*... Maaf, Anda tidak memiliki akses ke fitur ini.",
    premium:
      "> 🥇 *Upgrade ke Premium* untuk mendapatkan akses ke fitur eksklusif, murah dan cepat! Hubungi admin untuk info lebih lanjut.",
    private:
      "> 🔒 *Fitur ini hanya tersedia di chat pribadi*... Gunakan di chat pribadi dengan bot.",
    success:
      "> ✅ *Berhasil!*... Permintaan Anda telah diproses dengan sukses.",
    unregistered:
      "> ❎ *Mohon maaf*... Anda belum terdaftar dalam database kami, silahkan daftar agar Anda dapat menggunakan fitur ini.\n\n> Ketik .daftar [nama Anda] agar Anda terdaftar.",
    urlInvalid: "> *❎ URL tidak valid!*",
    wait: "> ⏳ *Mohon tunggu sebentar*... Kami sedang memproses permintaan Anda, harap bersabar ya!",
  },

  sticker: {
    androidApp:
      "https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro",
    author: "🐾 Lorenzxz 🐾",
    email: "lorenzxz@gmail.com",
    emojis: [],
    iOSApp:
      "https://apps.apple.com/id/app/muslim-pro-al-quran-adzan/id388389451?|=id",
    isAvatar: 0,
    packId: "https://github.com/Lorenzxz",
    packname: "✨ NekoPack ✨",
    website: "https://github.com/Lorenzxz",
  },
};

module.exports = config;
```


## 👨‍💻 How to install/run


```bash
$ git clone https://github.com/KuroTakeshi/Takeshi-WaBot
$ cd Takeshi-WaBot
$ npm install
$ npm start
```

## ☘️ Example Features
Berikut cara menambahkan fitur pada bot ini

## 1. Plugins

```javascript

module.exports = {
    command: "tes", //- Nama fitur nya
    alias: ["tesbot", "testing"], //- Short cut command
    category: ["main"], //- Kategori Fitur 
    loading: false, // - Apakah Fitur ini ada loading nya ?
    react: "💻", // - Ini adalah custom react selain react dari loading
    settings: {
        limit: 10, // - Apakah Fitur ini memerlukan limit, jika menggunakan "true" maka akan menggunakan 1 limit 
        owner: false, // -  Apakah Fitur ini khusus owner ?
        group: false, // - Apakah Fitur ini khusus group ?
        register: false, // - Apakah Fitur ini harus register ?
     },
    description: "Tes bot saja", //- Penjelasan tentang fitur nya
    loading: true, //- Ingin menambahkan loading messages ?
 async run(m, { sock, Func, Api, Msg, Scraper, text, config }) {
    m.reply("> Bot Online ✓")
  }
}
```
## 2. Case

```javascript
case "tes" : {
   // category: "main" 
   // - Category agar case ini masuk kedalam category yang ada di menu
     m.reply("> Bot Online ✓")
   }
break
```
## 📢 Discussion 
Jika ingin mengenal seputar Script ini lebih dalam lagi
silahkan mampir ke komunitas kami

[![WhatsApp Group](https://img.shields.io/badge/WhatsApp%20Group-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://chat.whatsapp.com/BSiAQ2Wn3Mp8egl7Y3qVgQ)

[![WhatsApp channel](https://img.shields.io/badge/WhatsApp%20Channel-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://whatsapp.com/channel/0029VbALRiqHltY7owUWhr3H)

