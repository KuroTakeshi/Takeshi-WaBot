require("module-alias/register");
const {
  default: makeWASocket,
  WABinary,
  useMultiFileAuthState,
  jidNormalizedUser,
  fetchLatestBaileysVersion,
  Browsers,
  proto,
  makeInMemoryStore,
  DisconnectReason,
  delay,
  generateWAMessage,
  getAggregateVotesInPollMessage,
  areJidsSameUser,
} = require("baileys");
const pino = require("pino");
const path = require("path");
const { Boom } = require("@hapi/boom");
const chalk = require("chalk");
const readline = require("node:readline");
const simple = require("@library/simple.js");
const fs = require("node:fs");
const pkg = require("./package.json");
const moment = require("moment-timezone");
const now = moment().tz("Asia/Jakarta");
const Queque = require("@library/queque.js");
const messageQueue = new Queque();
const Database = require("@library/database.js");
const append = require("@library/append");
const serialize = require("@library/serialize.js");
const config = require("@configuration");
const { getBuffer } = require("@utils/getBuffer.js");
const canvafy = require("canvafy");

const appenTextMessage = async (m, sock, text, chatUpdate) => {
  let messages = await generateWAMessage(
    m.key.remoteJid,
    {
      text: text,
    },
    {
      quoted: m.quoted,
    },
  );
  messages.key.fromMe = areJidsSameUser(m.sender, sock.user.id);
  messages.key.id = m.key.id;
  messages.pushName = m.pushName;
  if (m.isGroup) messages.participant = m.sender;
  let msg = {
    ...chatUpdate,
    messages: [proto.WebMessageInfo.fromObject(messages)],
    type: "append",
  };
  return sock.ev.emit("messages.upsert", msg);
};

const question = (text) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(text, resolve);
  });
};
async function initializeSystem() {
  global.db = new Database(config.database + ".json");
  await db.init();

  const APIManager = require("@utils/api.js");
  global.api = new APIManager();

  const MsgHelper = require("@utils/msg.js");
  global.MsgHelper = MsgHelper;

  const Plugins = await require(process.cwd() + "/library/plugins");
  global.pg = new Plugins(process.cwd() + "/system/plugins");
  await pg.watch();

  const Scraper = await require(process.cwd() + "/scrapers");
  global.scraper = new Scraper(process.cwd() + "/scrapers/src");
  await scraper.watch();

  setInterval(async () => {
    await db.save();
    await pg.load();
    await scraper.load();
  }, 2000);
}

const store = makeInMemoryStore({
  logger: pino().child({
    level: "silent",
    stream: "store",
  }),
});

console.log(
  chalk.green.bold(`
    --------------------------------------
    ☘️ Selamat datang di Takeshi-WaBot
  terimakasih telah menggunakan script ini 👍
    --------------------------------------
  `),
);

console.log(chalk.yellow.bold("📁     Inisialisasi modul..."));
console.log(chalk.cyan.bold("- API Baileys Telah Dimuat"));
console.log(chalk.cyan.bold("- Sistem File Siap Digunakan"));
console.log(chalk.cyan.bold("- Database Telah Diinisialisasi"));

console.log(chalk.blue.bold("\n🤖 Info Bot:"));
console.log(
  chalk.white.bold("  | GitHub: ") +
    chalk.cyan.bold("https://github.com/Lorenzxz"),
);
console.log(chalk.white.bold("  | Developer: ") + chalk.green.bold("Lorenzxz"));
console.log(
  chalk.white.bold("  | Status Server: ") + chalk.green.bold("Online"),
);
console.log(chalk.white.bold("  | Versi: ") + chalk.magenta.bold(pkg.version));
console.log(
  chalk.white.bold("  | Versi Node.js: ") + chalk.magenta.bold(process.version),
);

console.log(chalk.blue.bold("\n🔁 Memuat plugin dan scraper..."));

async function system() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessions);
  sock = simple(
    {
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      auth: state,
      version: [2, 3000, 1019441105],
      browser: Browsers.ubuntu("Edge"),
      getMessage: async (key) => {
        const jid = jidNormalizedUser(key.remoteJid);
        const msg = await store.loadMessage(jid, key.id);
        return msg?.message || "";
      },
      shouldSyncHistoryMessage: (msg) => {
        console.log(`\x1b[32mMemuat chat [${msg.progress}%]\x1b[39m`);
        return !!msg.syncType;
      },
    },
    store,
  );
  store.bind(sock.ev);
  if (!sock.authState.creds.registered) {
    console.log(
      chalk.white.bold(
        "- Silakan masukkan nomor WhatsApp Anda, misalnya +628xxxx",
      ),
    );
    const phoneNumber = await question(chalk.green.bold(`– Nomor Anda: `));
    const code = await sock.requestPairingCode(phoneNumber);
    setTimeout(() => {
      console.log(chalk.white.bold("- Kode Pairing Anda: " + code));
    }, 3000);
  }

  //=====[ Pembaruan Koneksi ]======
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      connectedToWhatsapp = false;
      const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      if (lastDisconnect.error == "Error: Stream Errored (unknown)") {
      } else if (reason === DisconnectReason.badSession) {
        console.log(
          chalk.red.bold("File sesi buruk, Harap hapus sesi dan scan ulang"),
        );
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log(
          chalk.yellow.bold(
            "Koneksi ditutup, sedang mencoba untuk terhubung kembali...",
          ),
        );
      } else if (reason === DisconnectReason.connectionLost) {
        console.log(
          chalk.yellow.bold(
            "Koneksi hilang, mencoba untuk terhubung kembali...",
          ),
        );
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log(
          chalk.green.bold(
            "Koneksi diganti, sesi lain telah dibuka. Harap tutup sesi yang sedang berjalan.",
          ),
        );
        sock.logout();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(chalk.green.bold("Perangkat logout, harap scan ulang."));
        sock.logout();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log(
          chalk.green.bold("Restart diperlukan, sedang memulai ulang..."),
        );
        system();
      } else if (reason === DisconnectReason.timedOut) {
        console.log(
          chalk.green.bold(
            "Koneksi waktu habis, sedang mencoba untuk terhubung kembali...",
          ),
        );
        system();
      }
    } else if (connection === "connecting") {
      console.log(chalk.blue.bold("Menghubungkan ke WhatsApp..."));
    } else if (connection === "open") {
      connectedToWhatsapp = true;
      console.log(chalk.green.bold("Bot berhasil terhubung."));

      if (config.settings.autoJoinGc) {
        await sock.groupAcceptInvite(config.inviteCode);
      }
      if (config.settings.autoFollowNewsletter) {
        await sock.subscribeNewsletterUpdates(config.id.newsletter);
      }

      const currentTime = moment().tz("Asia/Jakarta");
      const pingSpeed = new Date() - currentTime;
      const formattedPingSpeed = pingSpeed < 0 ? "N/A" : `${pingSpeed}ms`;
      const infoMsg = `*Laporan Informasi*  
Perangkat telah terhubung, berikut detailnya:  

*[ Tentang Sistem ]*  
> *User ID*: ${sock.user.id}  
> *Nama*: ${sock.user.name}  
> *Kecepatan*: ${formattedPingSpeed}  
> *Tanggal*: ${currentTime.format("dddd, DD MMMM YYYY")}  
> *Waktu*: ${currentTime.format("HH:mm:ss")}  
`;
      if (config.settings.sendConnectionMessage) {
        const connectionMessage = await sock.sendMessage(
          `${config.botNumber}@s.whatsapp.net`,
          {
            text: infoMsg,
            mentions: [config.botNumber, +"@s.whatsapp.net", sock.user.id],
          },
          {
            quoted: null,
          },
        );
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("contacts.update", (update) => {
    for (let contact of update) {
      let id = jidNormalizedUser(contact.id);
      if (store && store.contacts)
        store.contacts[id] = {
          ...(store.contacts?.[id] || {}),
          ...(contact || {}),
        };
    }
  });

  sock.ev.on("contacts.upsert", (update) => {
    for (let contact of update) {
      let id = jidNormalizedUser(contact.id);
      if (store && store.contacts)
        store.contacts[id] = { ...(contact || {}), isContact: true };
    }
  });

  sock.ev.on("groups.update", (updates) => {
    for (const update of updates) {
      const id = update.id;
      if (store.groupMetadata[id]) {
        store.groupMetadata[id] = {
          ...(store.groupMetadata[id] || {}),
          ...(update || {}),
        };
      }
    }
  });

  sock.ev.on("group-participants.update", async (groupUpdate) => {
    try {
      let groupMetadata = await sock.groupMetadata(groupUpdate.id);
      let participants = groupUpdate.participants;
      let totalMembers = groupMetadata.participants.length;

      for (let participant of participants) {
        try {
          userProfilePicture = await sock.profilePictureUrl(
            participant,
            "image",
          );
        } catch (err) {
          userProfilePicture =
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60";
        }

        try {
          groupProfilePicture = await sock.profilePictureUrl(
            groupUpdate.id,
            "image",
          );
        } catch (err) {
          groupProfilePicture =
            "https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60";
        }

        const welcomeImageBuffer = await getBuffer(userProfilePicture);
        const goodbyeImageBuffer = await getBuffer(userProfilePicture);
        const demoteImageBuffer = await getBuffer(userProfilePicture);
        const promoteImageBuffer = await getBuffer(userProfilePicture);

        if (groupUpdate.action === "add" && db.list().group[groupUpdate.id]?.welcomeGoodbye) {
          const welcomeCanvas = await new canvafy.WelcomeLeave()
            .setAvatar(welcomeImageBuffer)
            .setBackground("image", "https://e.top4top.io/p_31964qbk71.jpg")
            .setTitle("W e l c o m e")
            .setDescription(`Welcome to - ${groupMetadata.subject}`)
            .setBorder("#2a2e35")
            .setAvatarBorder("#2a2e35")
            .setOverlayOpacity(0.5)
            .build();

          const welcomeMessage = `Halloo @${participant.split("@")[0]}👋\nSelamat datang di ${groupMetadata.subject}\n\n> Pastikan untuk selalu membaca peraturan grup.`;

          sock.sendMessage(groupUpdate.id, {
            image: welcomeCanvas,
            caption: welcomeMessage,
            contextInfo: {
              mentionedJid: [participant],
              forwardingScore: 9999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: config.id.newsletter,
                serverMessageId: 20,
                newsletterName: "Takeshi | Playground",
              },
            },
          });
        } else if (
          groupUpdate.action === "remove" &&
          db.list().group[groupUpdate.id]?.welcomeGoodbye
        ) {
          const goodbyeCanvas = await new canvafy.WelcomeLeave()
            .setAvatar(goodbyeImageBuffer)
            .setBackground("image", "https://e.top4top.io/p_31964qbk71.jpg")
            .setTitle("G o o d b y e")
            .setDescription(`Goodbye member ke - ${totalMembers}`)
            .setBorder("#2a2e35")
            .setAvatarBorder("#2a2e35")
            .setOverlayOpacity(0.5)
            .build();

          const goodbyeMessage = `Selamat tinggal @${participant.split("@")[0]} 👋\n\n> Terimakasih telah menjadi anggota disini.`;

          sock.sendMessage(groupUpdate.id, {
            image: goodbyeCanvas,
            caption: goodbyeMessage,
            contextInfo: {
              mentionedJid: [participant],
              forwardingScore: 9999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: config.id.newsletter,
                serverMessageId: 20,
                newsletterName: "Takeshi | Playground",
              },
            },
          });
        } else if (
          groupUpdate.action === "promote" &&
          db.list().group[groupUpdate.id]?.promoteDemote
        ) {
          const promoteCanvas = await new canvafy.WelcomeLeave()
            .setAvatar(promoteImageBuffer)
            .setBackground("image", "https://e.top4top.io/p_31964qbk71.jpg")
            .setTitle("P r o m o t e")
            .setDescription(`Selamat!`)
            .setBorder("#2a2e35")
            .setAvatarBorder("#2a2e35")
            .setOverlayOpacity(0.5)
            .build();

          const promoteMessage = `Selamat @${participant.split("@")[0]} !!\n\n> Anda telah dipromosikan menjadi Admin Group.`;

          sock.sendMessage(groupUpdate.id, {
            image: promoteCanvas,
            caption: promoteMessage,
            contextInfo: {
              mentionedJid: [participant],
              forwardingScore: 9999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: config.id.newsletter,
                serverMessageId: 20,
                newsletterName: "Takeshi | Playground",
              },
            },
          });
        }  else if (
          groupUpdate.action === "demote" &&
          db.list().group[groupUpdate.id]?.promoteDemote
        ) {
          const demoteCanvas = await new canvafy.WelcomeLeave()
            .setAvatar(demoteImageBuffer)
            .setBackground("image", "https://e.top4top.io/p_31964qbk71.jpg")
            .setTitle("D e m o t e")
            .setDescription(`Terimakasih`)
            .setBorder("#2a2e35")
            .setAvatarBorder("#2a2e35")
            .setOverlayOpacity(0.5)
            .build();

          const demoteMessage = `Terimakasih @${participant.split("@")[0]} !!\n\n> Termakasih telah menjadi bagian admin di group ini.`;

          sock.sendMessage(groupUpdate.id, {
            image: demoteCanvas,
            caption: demoteMessage,
            contextInfo: {
              mentionedJid: [participant],
              forwardingScore: 9999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: config.id.newsletter,
                serverMessageId: 20,
                newsletterName: "Takeshi | Playground",
              },
            },
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

  async function getMessage(key) {
    if (store) {
      const msg = await store.loadMessage(key.remoteJid, key.id);
      return msg;
    }
    return {
      conversation: "Takeshi-WaBot",
    };
  }

  let lastCall = new Map();

  sock.ev.on("call", async (calls) => {
    if (!config.settings.antiCall) return;
    for (const call of calls) {
      if (!call.id || !call.from) continue;

      let lastTime = lastCall.get(call.from);
      let now = Date.now();

      if (!lastTime || now - lastTime > 5000) {
        lastCall.set(call.from, now);
        await sock.rejectCall(call.id, call.from);
        await sock.sendMessage(call.from, {
          text: config.messages.call,
          mentions: [call.from],
        });
      }
    }
  });

  sock.ev.on("messages.upsert", async (cht) => {
    console.log(cht);
    if (cht.messages.length === 0) return;
    const chatUpdate = cht.messages[0];
    if (!chatUpdate.message) return;
    const userId = chatUpdate.key.id;
    global.m = await serialize(chatUpdate, sock, store);
    let jid = m.key.remoteJid;
    let senderNumber = m.key.participant || jid;
    senderNumber = senderNumber.split("@")[0];
    let senderName = m.pushName || "Unknown";
    const messageContent =
      m.message?.conversation || m.message?.extendedTextMessage?.text || "";

    require("@library/logger.js")(m);

    if (m.isBot) return;
    if (!m.isOwner && db.list().settings.self) return;
    await require("./system/handler.js")(m, sock, store);

    if (config.settings.autotyping)
      sock.sendPresenceUpdate("composing", m.from);
    if (!config.settings.online) sock.sendPresenceUpdate("unavailable", m.from);
    if (config.settings.online) sock.sendPresenceUpdate("available", m.from);
    if (config.settings.readchat) sock.readMessages([m.key]);

    sock.storyJid = sock.storyJid ? sock.storyJid : [];
    sock.story = sock.story ? sock.story : [];

    if (
      config.settings.readsw &&
      m.from.endsWith("broadcast") &&
      !/protocol/.test(m.type)
    ) {
      await sock.readMessages([m.key]);
    }
  });

  sock.ev.on("messages.update", async (chatUpdate) => {
    for (const { key, update } of chatUpdate) {
      if (update.pollUpdates && key.fromMe) {
        const pollCreation = await getMessage(key);
        if (pollCreation) {
          let pollUpdate = await getAggregateVotesInPollMessage({
            message: pollCreation?.message,
            pollUpdates: update.pollUpdates,
          });
          let toCmd = pollUpdate.filter((v) => v.voters.length !== 0)[0]?.name;
          console.log(toCmd);
          await appenTextMessage(m, sock, toCmd, pollCreation);
          await sock.sendMessage(m.cht, { delete: key });
        } else return false;
        return;
      }
    }
  });

  return sock;
}

initializeSystem();
system();
