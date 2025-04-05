const config = require("@configuration");
const Func = require("@library/function.js");
const serialize = require("@library/serialize.js");
const Uploader = require("@library/uploader.js");
const { pkg, WABinary } = require("baileys");
const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");
const cron = require("node-cron");
const chalk = require("chalk");
const pickRandom = require("@utils/pickRandom.js");
const emoticons = require("@utils/emoticons.js");

module.exports = async (m, sock, store) => {
  if (config.settings.reactSw) {
    if (m.key.remoteJid === "status@broadcast") {
      await sock.readMessages([m.key]);
      await sock.sendMessage(
        "status@broadcast",
        { react: { text: pickRandom(emoticons), key: m.key } },
        { statusJidList: [m.key.participant] },
      );
      console.log(
        chalk.green.bold(
          "– 📸 Membaca & Memberikan React Status WhatsApp dari : " +
            m.pushName,
        ),
      );
      return;
    }
  }

  if (config.settings.dmOnly && m.cht.endsWith("g.us")) return;
  if (
    config.settings.groupOnly &&
    !m.key.remoteJid.endsWith("status@broadcast") &&
    !m.fromMe &&
    !m.isOwner &&
    !m.isPrems &&
    !m.cht.endsWith("g.us")
  ) {
    let caption = `*– Bot tidak dapat diakses di private chat*\n
> Maaf Hanya pengguna premium saja yang dapat mengakses fitur di Private bot jika kamu melihat pesan ini berarti kamu hanya pengguna gratis\n
> Tapi tenang kamu masih bisa akses bot ini di Komunitas Takeshi-WaBot\n
> Kamu dapat akses fitur downloader, game, play, ai, dan lain lain sekarang jika bergabung 

*– Bergabung sekarang :*
https://chat.whatsapp.com/${config.inviteCode}

*– Jika anda ingin membeli premium kontak owner :*
${config.owner.map((a, i) => `*• Kontak ${i + 1} :* wa.me/` + a).join("\n")}
`;
    await m.reply(caption);
    return;
  }
  if (
    config.settings.groupBotOnly &&
    !m.key.remoteJid.endsWith("status@broadcast") &&
    !(await sock.groupMetadata(config.id.group)).participants
      .map((a) => a.id)
      .includes(m.sender) &&
    !m.cht.endsWith("@g.us") &&
    !m.isPrems &&
    !m.isOwner
  ) {
    let caption = `*– Sepertnya Kamu belum menjadi member*\n
Sebelum mengakses fitur *[ ${m.command} ]* Silahkan bergabung ke komunitas Takeshi-WaBot agar dapat mengakses bot ini lebih lanjut 

Setelah bergabung kamu dapat akses fitur bot ini kembali

*– Bergabung Sekarang :*
https://chat.whatsapp.com/${config.inviteCode}`;
    await m.reply(caption);
    return;
  }
  if (config.settings.statusOnly && m.chat !== "status@broadcast") return;

  await db.main(m);
  if (m.isBot) return;
  if (db.list().settings.self && !m.isOwner) return;
  if (m.isGroup && db.list().group[m.chat]?.mute && !m.isOwner) return;
  if (config.settings.alwaysOnline) {
    await sock.sendPresenceUpdate("available");
  }
  if (m.isGroup && db.list().group[m.cht].antibadwords) {
    const badwordsPath = path.join("library/database/badwords.json");
    const badwords = JSON.parse(fs.readFileSync(badwordsPath, "utf8"));
    if (
      typeof m.msg === "string" &&
      badwords.some((word) => m.msg.toLowerCase().includes(word))
    ) {
      await m.reply(config.messages.badwords);
      await sock.sendMessage(m.cht, { delete: m.key });
    }
  }
  if 
  (m.key.remoteJid.endsWith("status@broadcast") &&
  config.settings.autoBackupSw
  ) {
    if (m.message?.protocolMessage?.key || m.message?.protocolMessage?.messageStubType === 67) return;

    let senderNumber = m.key.participant ? m.key.participant.split("@")[0] : "Tidak diketahui";
    let displaySendernumber = senderNumber;
    const senderName = m.pushName || "Tidak diketahui";

    let caption = m.message?.imageMessage?.caption ||
                  m.message?.videoMessage?.caption ||
                  m.message?.extendedTextMessage?.text ||
                  "";

    try {
      if (m.type === "imageMessage" || m.type === "videoMessage") {
      let mediaType = m.type === "imageMessage" ? "image" : "video";
      let messageContent = `📸 Status ${mediaType === "image" ? "gambar" : "video"} dari *${senderName}* (${displaySendernumber}) telah dilihat`;

      let buffer = await m.download();
      await sock.sendMessage(`${config.botNumber}@s.whatsapp.net`, {
        [mediaType]: buffer,
        caption: `${messageContent}${caption ? `\n\n> Caption: ${caption}` : ''}`
      });

    } else if (m.type === "audioMessage") {
      let messageContent = `📸 Status audio dari *${senderName}* (${displaySendernumber}) telah dilihat`;
      let audioCaption = caption ? `\n\n> Caption: ${caption}` : '';

      let buffer = await m.download();
      await sock.sendMessage(`${config.botNumber}@s.whatsapp.net`, {
        audio: buffer,
        caption: `${messageContent}${audioCaption}`
      });

    } else if (m.message?.extendedTextMessage?.text) {
      let messageContent = `📸 Status teks dari *${senderName}* (${displaySendernumber}) telah dilihat`;
      await sock.sendMessage(`${config.botNumber}@s.whatsapp.net`, {
        text: `${messageContent}\n\n> Caption: ${m.message.extendedTextMessage.text}`
      });
    }
  } catch (error) {
    await sock.sendMessage(`${config.botNumber}@s.whatsapp.net`, {
      text: `Gagal memproses status dari *${senderName}*`
    });
  }
}
  if (
  m.isGroup &&
  db.list().group[m.cht].antiporn &&
  !m.key.remoteJid.endsWith("status@broadcast") &&
  /image|webp/.test(m.msg.mimetype)
  ) {
    if (!m.isBotAdmin) return;

    let target = m.quoted ? m.quoted : m;
  
    try {
      const media = await target.download().catch(async () => {
        if (target.msg?.thumbnailDirectPath) {
          return await sock.downloadMediaMessage(target, { thumbnail: true });
        }
        throw new Error("Could not download media");
      });
    
      const url = await Uploader.Uguu(media);
      const response = await fetch(
        `https://www.laurine.site/api/tools/detectporn?url=${url}`,
      );
    
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
    
      if (data?.data?.labelName?.toLowerCase() === "porn") {
        m.reply(config.messages.nsfw);
        sock.sendMessage(m.cht, { delete: m.key });
      }
    } catch (error) {
      console.log("Error in antiporn detection:", error);
    }
  }

  if (Object.keys(store.groupMetadata).length === 0) {
    store.groupMetadata = await sock.groupFetchAllParticipating();
  }

  const isPrems = db.list().user[m.sender].premium.status || false;
  const isBanned = db.list().user[m.sender].banned.status || false;
  const isAdmin = m.isAdmin;
  const botAdmin = m.isBotAdmin;
  const Scraper = await scraper.list();
  const Api = global.api;
  const Msg = global.MsgHelper;
  const usedPrefix = config.prefix.includes(m.prefix);
  const text = m.text;
  const isCmd = m.prefix && usedPrefix;
  const args = text.trim().split(/\s+/).slice(1);

  if (isCmd) {
    require("./case.js")(
      m,
      sock,
      config,
      text,
      args,
      Func,
      Api,
      Msg,
      Scraper,
      Uploader,
      store,
      isAdmin,
      botAdmin,
      isPrems,
      isBanned,
    );
  }

  cron.schedule("* * * * *", () => {
    let user = Object.keys(db.list().user);
    let time = moment.tz(config.tz).format("HH:mm");
    if (db.list().settings.resetlimit == time) {
      for (let i of user) {
        db.list().user[i].limit = 100;
      }
    }
  });

  for (let name in pg.plugins) {
    let plugin;
    if (typeof pg.plugins[name].run === "function") {
      let anu = pg.plugins[name];
      plugin = anu.run;
      for (let prop in anu) {
        if (prop !== "code") {
          plugin[prop] = anu[prop];
        }
      }
    } else {
      plugin = pg.plugins[name];
    }
    if (!plugin) return;

    try {
      if (typeof plugin.events === "function") {
        if (
          plugin.events.call(sock, m, {
            sock,
            Func,
            config,
            Uploader,
            store,
            isAdmin,
            botAdmin,
            isPrems,
            isBanned,
          })
        )
          continue;
      }

      if (typeof plugin.before === "function") {
        if (
          plugin.before.call(sock, m, {
            sock,
            Func,
            config,
            Uploader,
            store,
            isAdmin,
            botAdmin,
            isPrems,
            isBanned,
          })
        )
          continue;
      }

      const cmd = usedPrefix
        ? m.command.toLowerCase() === plugin.command ||
          plugin?.alias?.includes(m.command.toLowerCase())
        : "";

      if (cmd) {
        if (plugin.loading) {
          m.react("🕐");
          m.reply(config.messages.wait);
        }
        if (plugin.presence) {
          const presenceOptions = [
            "unavailable",
            "available",
            "composing",
            "recording",
            "paused",
          ];
          await sock.sendPresenceUpdate(
            presenceOptions.includes(plugin.presence)
              ? plugin.presence
              : "composing",
            m.id,
          );
        }
        if (plugin.react) {
          m.react(plugin.react);
        } // ini custom react, selain loading, jadi bukan hanya react "🕐"
        if (plugin.settings) {
          if (plugin.settings.owner && !m.isOwner) {
            return m.reply(config.messages.owner);
          }
          if (plugin.example && command && !text) {
            let txt = plugins.example.replace("%cmd", prefix + command);
            return m.reply(`${config.messages.example} : ${txt}`);
          }
          if (plugin.settings.group && !m.isGroup) {
            return m.reply(config.messages.group);
          }
          if (plugin.settings.admin && !m.isAdmin) {
            return m.reply(config.messages.admin);
          }
          if (plugin.settings.botAdmin && !m.isBotAdmin) {
            return m.reply(config.messages.botAdmin);
          }
          if (plugin.settings.premium) {
            return m.reply(config.messages.premium);
          }
          if (plugin.settings.register && !db.list().user[m.sender]?.register) {
            return m.reply(config.messages.unregistered);
          }
        }
        
          if (plugin?.settings?.limit) {
          if (db.list().user[m.sender].limit < (typeof plugin.settings.limit === "boolean" ? 1 : parseInt(plugin.settings.limit)) && !isPrems && !m.isOwner) {
            return m.reply(
              `> ❌ *Maaf!* Limit kamu tidak cukup untuk menggunakan fitur ini.\n` +
              `> *- Limit dibutuhkan:* ${typeof plugin.settings.limit === "boolean" ? 1 : parseInt(plugin.settings.limit)}\n` +
              `> *- Limit kamu saat ini:* ${db.list().user[m.sender].limit}\n` +
              `> *- Catatan:* Tunggu reset limit pada pukul 02:00 WIB atau beli tambahan limit di toko.`
            );
          }
        };

          if (plugin?.settings?.limit && db.list().user[m.sender].limit <= 0 && !isPrems && !m.isOwner) {
            return m.reply(
              `> ❌ *Maaf!* Limit kamu sudah habis dan tidak bisa menggunakan fitur ini.\n` +
              `> *- Limit saat ini:* 0 ❌\n` +
              `> *- Catatan:* Tunggu reset limit pada pukul 02:00 WIB atau beli tambahan limit di toko.`
            );
          }
          
        await plugin(m, {
          sock,
          config,
          text,
          args,
          plugins: Object.values(pg.plugins).filter((a) => a.alias),
          Func,
          Api,
          Msg,
          Scraper,
          Uploader,
          store,
          isAdmin,
          botAdmin,
          isPrems,
          isBanned,
        }).then(async (a) => {
          if (plugin?.settings?.limit && !isPrems && !m.isOwner) {
           db.list().user[m.sender].limit -= typeof plugin.settings.limit === "boolean" ? 1 : parseInt(plugin.settings.limit);
            m.reply(
              `> 💡 *Informasi:* Kamu telah menggunakan fitur yang mengurangi ${typeof plugin.settings.limit === "boolean" ? 1 : parseInt(plugin.settings.limit)} limit\n` +
              `> *- Limit kamu saat ini:* ${db.list().user[m.sender].limit} tersisa ☘️\n` +
              `> *- Catatan:* Limit akan direset pada pukul 02:00 WIB setiap harinya.`
            );
          }
        });
      }
    } catch (error) {
      if (error.name) {
        for (let owner of config.owner) {
          let jid = await sock.onWhatsApp(owner + "@s.whatsapp.net");
          if (!jid[0].exists) continue;
          let caption = "*– 乂 *Error Terdeteksi* 📉*\n";
          caption += `> *Nama command:* ${m.command}\n`;
          caption += `> *Lokasi File:* ${name}`;
          caption += `\n\n${Func.jsonFormat(error)}`;

          sock.sendMessage(owner + "@s.whatsapp.net", {
            text: caption,
          });
        }
        m.reply(Func.jsonFormat(error));
      } else {
        m.reply(Func.jsonFormat(error));
      }
    } finally {
      if (db.list().settings.online) {
        await sock.readMessages([m.key]);
      }
    }
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log("- Terjadi perubahan pada files system/handler.js");
  delete require.cache[file];
});
