(async () => {
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
const config = require("@configuration");
const groupEvents = require("@events/groups.js");
const callEvents = require("@events/calls.js");
const messageEvents = require("@events/messages.js");

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
    const code = await sock.requestPairingCode(phoneNumber, config.pairingCode);
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
        await sock.sendNode({
        tag: "iq",
        attrs: {
          id: sock.generateMessageTag(),
          type: "get",
          xmlns: "w:mex",
          to: "@s.whatsapp.net",
        },
        content: [
          {
            tag: "query",
            attrs: {
              query_id: "7871414976211147",
            },
            content: new TextEncoder().encode(
              JSON.stringify({
                variables: {
                  newsletter_id: config.id.newsletter,
                },
              }),
            ),
          },
        ],
      });
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

  async function getMessage(key) {
    if (store) {
      const msg = await store.loadMessage(key.remoteJid, key.id);
      return msg;
    }
    return {
      conversation: "Takeshi-WaBot",
    };
  }
  
  callEvents(sock);
  groupEvents(sock, store, db);
  messageEvents(sock, store);

  return sock;
}

system();
})();
