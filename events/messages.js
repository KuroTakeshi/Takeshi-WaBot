const serialize = require("@library/serialize.js");
const config = require("@configuration");

module.exports = (sock, store) => {
  async function getMessage(key) {
    if (store) {
      const msg = await store.loadMessage(key.remoteJid, key.id);
      return msg;
    }
    return {
      conversation: "Takeshi-WaBot",
    };
  }

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
    await require("../system/handler.js")(m, sock, store);

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

  return {
    getMessage,
    appenTextMessage
  };
};