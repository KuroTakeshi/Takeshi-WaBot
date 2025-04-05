const moment = require("moment-timezone");
const pkg = require(process.cwd() + "/package.json");
const axios = require("axios");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
  command: "menu",
  alias: ["menu", "help"],
  category: ["main"],
  description: "Menampilkan menu bot",
  loading: true,
  async run(m, { sock, plugins, config, Func, text }) {
    let data = fs.readFileSync(process.cwd() + "/system/case.js", "utf8");
    let casePattern =
      /case\s+"([^"]+)"\s*:\s*\{\s*\/\/\s*category:\s*"([^"]+)"/g;
    let matches = [...data.matchAll(casePattern)];

    let menu = {};
    matches.forEach((match) => {
      let caseName = match[1];
      let category = match[2];
      if (!menu[category]) {
        menu[category] = {
          command: [],
        };
      }
      menu[category].command.push({
        name: caseName,
        alias: [],
        description: "",
        settings: {},
      });
    });

    plugins.forEach((item) => {
      if (item.category && item.command && item.alias) {
        item.category.forEach((cat) => {
          if (!menu[cat]) {
            menu[cat] = {
              command: [],
            };
          }
          menu[cat].command.push({
            name: item.command,
            alias: item.alias,
            description: item.description,
            settings: item.settings,
          });
        });
      }
    });

    let cmd = 0;
    let alias = 0;
    let pp = await sock
      .profilePictureUrl(m.sender, "image")
      .catch((e) => "https://files.catbox.moe/8getyg.jpg");
    Object.values(menu).forEach((category) => {
      cmd += category.command.length;
      category.command.forEach((command) => {
        alias += command.alias.length;
      });
    });
    let premium = db.list().user[m.sender].premium.status;
    let limit = db.list().user[m.sender].limit;

    const header = `☘️ *T A K E S H I – W A B O T*
👋 Hai nama saya Takeshi saya adalah asisten bot WhatsApp 
yang akan membantu anda dengan fitur yang sediakan !
─────────────────────────
        `;

    const footer = `
📢 *Jika Anda menemui masalah*
*hubungi developer bot.*

> 💬 *Fitur Limit*: 🥈
> 💎 *Fitur Premium*: 🥇
─────────────────────────
`;

    if (text === "all") {
      let caption = `${header} 
🎮 *Info Pengguna*:
> - 🧑‍💻 Nama: ${m.pushName}
> - 🏷️ Tag: @${m.sender.split("@")[0]}
> - � Status: ${m.isOwner ? "Developer" : premium ? "Premium" : "Gratis"}
> - ⚖️ Limit: ${m.isOwner ? "Tidak terbatas" : limit}

🤖 *Info Bot*:
> - 🏷️ Nama: ${pkg.name}
> - 🔢 Versi: v${pkg.version}
> - 🕰️ Waktu Aktif: ${Func.toDate(process.uptime() * 1000)}
> - 🔑 Prefix: [ ${m.prefix} ]
> - ⚡ Total perintah: ${cmd + alias + matches.length}

🕰️ *Info Waktu*:
> - 🕒 ${moment().tz("Asia/Jakarta").format("HH:mm:ss")} WIB
> - 🕒 ${moment().tz("Asia/Makassar").format("HH:mm:ss")} WITA
> - 🕒 ${moment().tz("Asia/Jayapura").format("HH:mm:ss")} WIT
> - 📅 Hari: ${["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][moment().tz("Asia/Jakarta").day()]}
> - 📅 Tanggal: ${moment().tz("Asia/Jakarta").date()} ${["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][moment().tz("Asia/Jakarta").month()]} ${moment().tz("Asia/Jakarta").year()}
 
🛠️ *Menu – CASE (features available on case.js)* 
${matches.map((a, i) => `> *(${i + 1})* ${m.prefix + a[1]}`).join("\n")}
─────────────────────────
`;

      Object.entries(menu).forEach(([tag, commands]) => {
        caption += `\n🛠️ *Menu – ${tag.toUpperCase()}* 
${commands.command.map((command, index) => `> *(${index + 1})* ${m.prefix + command.name} ${command.settings?.premium ? "🥇" : command.settings?.limit ? "🥈" : ""}`).join("\n")}
─────────────────────────
`;
      });

      caption += footer;

      m.reply({
        text: caption,
        contextInfo: {
          mentionedJid: sock.parseMention(caption),
          externalAdReply: {
            title: "Takeshi | Playground",
            body: "👨‍💻 Bot WhatsApp - Simple",
            mediaType: 1,
            sourceUrl: "https://whatsapp.com/channel/0029VazhxPyLtOjBfKkyXm3F",
            thumbnailUrl: "https://files.catbox.moe/011zxw.png",
            renderLargerThumbnail: true,
          },
        },
      });
    } else if (Object.keys(menu).find((a) => a === text.toLowerCase())) {
      let list = menu[Object.keys(menu).find((a) => a === text.toLowerCase())];
      let caption = `${header}
🎮 *Info Pengguna*:
> - 🧑‍💻 Nama: ${m.pushName}
> - 🏷️ Tag: @${m.sender.split("@")[0]}
> - 🎖️ Status: ${m.isOwner ? "Developer" : premium ? "Premium" : "Gratis"}
> - ⚖️ Limit: ${m.isOwner ? "Tidak terbatas" : limit}

🤖 *Info Bot*:
> - 🏷️ Nama: ${pkg.name}
> - 🔢 Versi: v${pkg.version}
> - 🕰️ Waktu Aktif: ${Func.toDate(process.uptime() * 1000)}
> - 🔑 Prefix: [ ${m.prefix} ]
> - ⚡ Total perintah: ${cmd + alias + matches.length}

🕰️ *Info Waktu*:
> - 🕒 ${moment().tz("Asia/Jakarta").format("HH:mm:ss")} WIB
> - 🕒 ${moment().tz("Asia/Makassar").format("HH:mm:ss")} WITA
> - 🕒 ${moment().tz("Asia/Jayapura").format("HH:mm:ss")} WIT
> - 📅 Hari: ${["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][moment().tz("Asia/Jakarta").day()]}
> - 📅 Tanggal: ${moment().tz("Asia/Jakarta").date()} ${["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][moment().tz("Asia/Jakarta").month()]} ${moment().tz("Asia/Jakarta").year()}

─────────────────────────
🛠️ *Menu – ${text.toUpperCase()}*
${list.command
  .map(
    (a, i) =>
      `> *(${i + 1})* ${m.prefix + a.name} ${a.settings?.premium ? "🥇" : a.settings?.limit ? "🥈" : ""}`,
  )
  .join("\n")}
─────────────────────────
`;

      caption += footer;

      m.reply({
        text: caption,
        contextInfo: {
          mentionedJid: sock.parseMention(caption),
          externalAdReply: {
            title: "Takeshi | Playground",
            body: "👨‍💻 Bot WhatsApp - Simple",
            mediaType: 1,
            sourceUrl: "https://whatsapp.com/channel/0029VazhxPyLtOjBfKkyXm3F",
            thumbnailUrl: "https://files.catbox.moe/011zxw.png",
            renderLargerThumbnail: true,
          },
        },
      });
    } else {
      let list = Object.keys(menu);
      let caption = `${header}
🎮 *Info Pengguna*:
> - 🧑‍💻 Nama: ${m.pushName}
> - 🏷️ Tag: @${m.sender.split("@")[0]}
> - 🎖️ Status: ${m.isOwner ? "Developer" : premium ? "Premium" : "Gratis"}
> - ⚖️ Limit: ${m.isOwner ? "Tidak terbatas" : limit}

🤖 *Info Bot*:
> - 🏷️ Nama: ${pkg.name}
> - 🔢 Versi: v${pkg.version}
> - 🕰️ Waktu Aktif: ${Func.toDate(process.uptime() * 1000)}
> - 🔑 Prefix: [ ${m.prefix} ]
> - ⚡ Total perintah: ${cmd + alias + matches.length}

🕰️ *Info Waktu*:
> - 🕒 ${moment().tz("Asia/Jakarta").format("HH:mm:ss")} WIB
> - 🕒 ${moment().tz("Asia/Makassar").format("HH:mm:ss")} WITA
> - 🕒 ${moment().tz("Asia/Jayapura").format("HH:mm:ss")} WIT
> - 📅 Hari: ${["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][moment().tz("Asia/Jakarta").day()]}
> - 📅 Tanggal: ${moment().tz("Asia/Jakarta").date()} ${["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][moment().tz("Asia/Jakarta").month()]} ${moment().tz("Asia/Jakarta").year()}

─────────────────────────
🗂️ *Daftar Menu*:
> *(all)* ${m.prefix}menu all
${list.map((a) => `> *(${a})* ${m.prefix}menu ${a}`).join("\n")}

─────────────────────────
`;

      caption += footer;

      m.reply({
        text: caption,
        contextInfo: {
          mentionedJid: sock.parseMention(caption),
          externalAdReply: {
            title: "Takeshi | Playground",
            body: "👨‍💻 Bot WhatsApp - Simple",
            mediaType: 1,
            sourceUrl: "https://whatsapp.com/channel/0029VazhxPyLtOjBfKkyXm3F",
            thumbnailUrl: "https://files.catbox.moe/011zxw.png",
            renderLargerThumbnail: true,
          },
        },
      });
    }
  },
};
