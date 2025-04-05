const {
  jidNormalizedUser,
  extractMessageContent,
  downloadMediaMessage,
  proto,
  areJidsSameUser,
  generateWAMessage,
} = require("baileys");
const config = require("@configuration");
const axios = require("axios");

const getContentType = (content) => {
  if (!content) return null;
  const keys = Object.keys(content);
  return keys.find(
    (k) =>
      (k === "conversation" ||
        k.endsWith("Message") ||
        k.includes("V2") ||
        k.includes("V3")) &&
      k !== "senderKeyDistributionMessage"
  );
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseMessage(content) {
  if (!content) return null;
  content = extractMessageContent(content);
  if (content?.viewOnceMessageV2Extension) {
    content = content.viewOnceMessageV2Extension.message;
  }
  if (content?.protocolMessage) {
    const type = getContentType(content.protocolMessage);
    if (type) content = content.protocolMessage[type];
  }
  if (content?.message) {
    const type = getContentType(content.message);
    if (type) content = content.message[type];
  }
  return content;
}

function isMediaMessage(msg) {
  return !!(
    msg?.mimetype ||
    msg?.thumbnailDirectPath ||
    msg?.imageMessage ||
    msg?.videoMessage ||
    msg?.audioMessage ||
    msg?.stickerMessage ||
    msg?.documentMessage
  );
}

module.exports = async (messages, sock, store) => {
  const m = {};
  if (!messages.message) return;
  m.message = parseMessage(messages.message) || {};
  
  if (messages.key) {
    m.key = messages.key;
    m.cht = m.key.remoteJid.startsWith("status")
      ? jidNormalizedUser(m.key?.participant || messages.participant)
      : jidNormalizedUser(m.key.remoteJid);
    m.fromMe = m.key.fromMe;
    m.id = m.key.id;
    m.isBot = /^(BAE5|NEK0|3EB0)|-/.test(m?.id);
    m.isGroup = m.cht.endsWith("@g.us");
    m.participant = jidNormalizedUser(messages?.participant || m.key.participant) || false;
    m.sender = jidNormalizedUser(
      m.fromMe ? sock.user.id : m.isGroup ? m.participant : m.cht
    );
  }

  if (m.isGroup) {
    if (!(m.cht in store.groupMetadata)) {
      store.groupMetadata[m.cht] = await sock.groupMetadata(m.cht);
    }
    m.metadata = store.groupMetadata[m.cht];
    m.groupAdmins = m.metadata.participants
      .filter(member => member.admin)
      .map(member => ({
        id: member.id,
        admin: member.admin
      }));
    m.isAdmin = m.isGroup && m.groupAdmins.some(member => member.id === m.sender);
    m.isBotAdmin = m.isGroup && 
      m.groupAdmins.some(member => member.id === jidNormalizedUser(sock.user.id));
  }

  m.pushName = messages.pushName;
  m.isOwner = [
    sock.decodeJid(sock.user.id),
    ...config.owner.map(a => `${a}@s.whatsapp.net`)
  ].includes(m.sender);

  if (m.message) {
    m.type = getContentType(m.message) || Object.keys(m.message)[0];
    m.msg = parseMessage(m.message[m.type]) || m.message[m.type];
    m.mentions = [
      ...(m.msg?.contextInfo?.mentionedJid || []),
      ...(m.msg?.contextInfo?.groupMentions?.map(v => v.groupJid) || [])
    ];
    
    m.body = [
      m.msg?.text,
      m.msg?.conversation,
      m.msg?.caption,
      m.message?.conversation,
      m.msg?.selectedButtonId,
      m.msg?.singleSelectReply?.selectedRowId,
      m.msg?.selectedId,
      m.msg?.contentText,
      m.msg?.selectedDisplayText,
      m.msg?.title,
      m.msg?.name
    ].find(Boolean) || "";
    
    m.prefix = /^[°•π÷×¶∆£¢€¥®™+✓=|/~!?@#%^&.©^]/.test(m.body)
      ? m.body.match(/^[°•π÷×¶∆£¢€¥®™+✓=|/~!?@#%^&.©^]/)[0]
      : "";
      
    m.command = m.body && m.body.trim()
      .replace(m.prefix, "")
      .trim()
      .split(/ +/)
      .shift();
      
    m.args = m.body
      .trim()
      .replace(new RegExp(`^${escapeRegExp(m.prefix)}`, "i"), "")
      .replace(m.command, "")
      .split(/ +/)
      .filter(Boolean);
      
    m.text = m.args.join(" ").trim();
    m.expiration = m.msg?.contextInfo?.expiration || 0;
    m.timestamps = typeof messages.messageTimestamp === "number"
      ? messages.messageTimestamp * 1000
      : m.msg.timestampMs * 1000;
      
    m.isMedia = isMediaMessage(m.msg);

    m.isQuoted = !!m.msg?.contextInfo?.quotedMessage;
    if (m.isQuoted) {
      m.quoted = {};
      m.quoted.message = parseMessage(m.msg.contextInfo.quotedMessage) || {};
      
      if (m.quoted.message) {
        m.quoted.type = getContentType(m.quoted.message) || Object.keys(m.quoted.message)[0];
        m.quoted.msg = parseMessage(m.quoted.message[m.quoted.type]) || m.quoted.message[m.quoted.type];
        m.quoted.isMedia = isMediaMessage(m.quoted.msg);
        
        m.quoted.key = {
          remoteJid: m.msg.contextInfo.remoteJid || m.cht,
          participant: jidNormalizedUser(m.msg.contextInfo.participant),
          fromMe: areJidsSameUser(
            jidNormalizedUser(m.msg.contextInfo.participant),
            jidNormalizedUser(sock.user.id)
          ),
          id: m.msg.contextInfo.stanzaId,
        };
        
        m.quoted.cht = /g\.us|status/.test(m.msg.contextInfo.remoteJid)
          ? m.quoted.key.participant
          : m.quoted.key.remoteJid;
          
        m.quoted.fromMe = m.quoted.key.fromMe;
        m.quoted.id = m.msg.contextInfo.stanzaId;
        m.quoted.device = /^3A/.test(m.quoted.id)
          ? "ios"
          : /^3E/.test(m.quoted.id)
            ? "web"
            : /^.{21}/.test(m.quoted.id)
              ? "android"
              : /^.{18}/.test(m.quoted.id)
                ? "desktop"
                : "unknown";
                
        m.quoted.isBot = /^(BAE5|NEK0|3EB0)|-|FELZ/.test(m.quoted.id);
        m.quoted.isGroup = m.quoted.cht.endsWith("@g.us");
        m.quoted.participant = jidNormalizedUser(m.msg.contextInfo.participant) || false;
        m.quoted.sender = jidNormalizedUser(
          m.msg.contextInfo.participant || m.quoted.cht
        );
        
        m.quoted.mentions = [
          ...(m.quoted.msg?.contextInfo?.mentionedJid || []),
          ...(m.quoted.msg?.contextInfo?.groupMentions?.map(v => v.groupJid) || [])
        ];
        
        m.quoted.body = [
          m.quoted.msg?.text,
          m.quoted.msg?.caption,
          m.quoted.message?.conversation,
          m.quoted.msg?.selectedButtonId,
          m.quoted.msg?.singleSelectReply?.selectedRowId,
          m.quoted.msg?.selectedId,
          m.quoted.msg?.contentText,
          m.quoted.msg?.selectedDisplayText,
          m.quoted.msg?.title,
          m.quoted.msg?.name
        ].find(Boolean) || "";
        
        m.quoted.emit = async (text) => {
          const message = await generateWAMessage(
            m.key.remoteJid,
            { text, mentions: m.mentions },
            { quoted: m.quoted }
          );
          
          message.key.fromMe = areJidsSameUser(m.sender, sock.user.id);
          message.key.id = m.key.id;
          message.pushName = m.pushName;
          
          if (m.isGroup) message.participant = m.sender;
          
          const msg = {
            ...m,
            messages: [proto.WebMessageInfo.fromObject(message)],
            type: "append",
          };
          
          return sock.ev.emit("messages.upsert", msg);
        };
        
        m.quoted.prefix = /^[°•π÷×¶∆£¢€¥®™+✓=|/~!?@#%^&.©^]/.test(m.quoted.body)
          ? m.quoted.body.match(/^[°•π÷×¶∆£¢€¥®™+✓=|/~!?@#%^&.©^]/)[0]
          : "";
          
        m.quoted.command = m.quoted.body && m.quoted.body
          .replace(m.quoted.prefix, "")
          .trim()
          .split(/ +/)
          .shift();
          
        m.quoted.args = m.quoted.body
          .trim()
          .replace(new RegExp(`^${escapeRegExp(m.quoted.prefix)}`, "i"), "")
          .replace(m.quoted.command, "")
          .split(/ +/)
          .filter(Boolean);
          
        m.quoted.text = m.quoted.args.join(" ").trim() || m.quoted.body;
        m.quoted.isOwner = [
          sock.decodeJid(sock.user.id),
          ...config.owner.map(a => `${a}@s.whatsapp.net`)
        ].includes(m.sender);
        
        if (m.quoted.isMedia) {
          m.quoted.download = async () => {
            try {
              return await downloadMediaMessage(m.quoted, "buffer", {}, {
                reuploadRequest: sock.updateMediaMessage
              });
            } catch (error) {
              if (m.quoted.msg?.thumbnailDirectPath) {
                try {
                  return await sock.downloadMediaMessage(m.quoted, {
                    thumbnail: true
                  });
                } catch (err) {
                  if (m.quoted.msg?.url) {
                    try {
                      const response = await axios.get(m.quoted.msg.url, {
                        responseType: 'arraybuffer'
                      });
                      return Buffer.from(response.data);
                    } catch (err) {
                      throw new Error("All download methods failed");
                    }
                  }
                  throw error;
                }
              }
              throw error;
            }
          };
          
          m.quoted.copy = (txt) => sock.cMod(m.cht, m.quoted, txt);
          m.quoted.forward = (Boolean) => sock.copyNForward(m.cht, m.quoted, Boolean);
        }
      }
    }
  }

  if (m.isMedia) {
    m.download = async () => {
      try {
        return await downloadMediaMessage(m, "buffer", {}, {
          reuploadRequest: sock.updateMediaMessage
        });
      } catch (error) {
        if (m.msg?.thumbnailDirectPath) {
          try {
            return await sock.downloadMediaMessage(m, { thumbnail: true });
          } catch (err) {
            if (m.msg?.url) {
              try {
                const response = await axios.get(m.msg.url, {
                  responseType: 'arraybuffer'
                });
                return Buffer.from(response.data);
              } catch (err) {
                throw new Error("All download methods failed");
              }
            }
            throw error;
          }
        }
        throw error;
      }
    };
    
    m.copy = (txt) => sock.cMod(m.cht, m, txt);
    m.forward = (Boolean) => sock.copyNForward(m.cht, m, Boolean);
  }

  m.reply = async (text, options = {}) => {
    const messageContent = typeof text === "string" ? {
      text,
      contextInfo: {
        mentionedJid: sock.parseMention(text) || [],
        externalAdReply: {
          title: options.title || "Takeshi | Playground",
          body: options.body || "- Simple WhatsApp bot by Lorenzxz",
          mediaType: 1,
          thumbnailUrl: options.thumbnailUrl || "https://files.catbox.moe/45rmzn.jpg",
          sourceUrl: options.sourceUrl || "https://github.com/KuroTakeshi/Takeshi-WaBot",
        },
      },
      ...options,
    } : text;
    
    return sock.sendMessage(
      m.cht,
      messageContent,
      {
        quoted: m,
        ephemeralExpiration: m.expiration,
        ...options,
      }
    );
  };
  
  m.replyError = async (text, options = {}) => {
    const messageContent = typeof text === "string" ? {
      text,
      contextInfo: {
        mentionedJid: sock.parseMention(text) || [],
        externalAdReply: {
          title: "Error | Detected",
          body: "- Please report this error to the Owner",
          mediaType: 1,
          thumbnailUrl: "https://files.catbox.moe/kittfb.jpg",
          sourceUrl: "https://github.com/KuroTakeshi/Takeshi-WaBot",
        },
      },
      ...options,
    } : text;
    
    return sock.sendMessage(
      m.cht,
      messageContent,
      {
        quoted: m,
        ephemeralExpiration: m.expiration,
        ...options,
      }
    );
  };
  
  m.react = async (emoji) => {
    return sock.sendMessage(m.cht, {
      react: {
        text: emoji,
        key: m.key,
      },
    });
  };
  
  m.emit = async (text) => {
    const message = await generateWAMessage(
      m.key.remoteJid,
      { text, mentions: m.mentions },
      { quoted: m.quoted }
    );
    
    message.key.fromMe = areJidsSameUser(m.sender, sock.user.id);
    message.key.id = m.key.id;
    message.pushName = m.pushName;
    
    if (m.isGroup) message.participant = m.sender;
    
    const msg = {
      ...m,
      messages: [proto.WebMessageInfo.fromObject(message)],
      type: "append",
    };
    
    return sock.ev.emit("messages.upsert", msg);
  };
  
  return m;
};