const moment = require("moment-timezone");
const { getBuffer } = require("@utils/getBuffer");
const canvafy = require("canvafy");
const config = require("@configuration");

module.exports = function(sock, store, db) {
  const defaultTexts = {
    welcomeText: `┌─⭓「 *SELAMAT DATANG* 」
│ *• Halo!* %member baru saja bergabung di %subject!
│ *• Waktu bergabung:* %time
└───────────────⭓

*• Kenalan dong~ Ceritakan sedikit tentang dirimu!*`,
    goodbyeText: `┌─⭓「 *SAMPAI JUMPA* 」
│ *• Seseorang telah meninggalkan grup* %subject
│ *• Waktu keluar:* %time
└───────────────⭓

*• Semoga sukses di perjalanan berikutnya!*`,
    promoteText: `┌─⭓「 *PROMOSI ADMIN* 」
│ *• Selamat!* %member sekarang menjadi admin!
│ *• Waktu promosi:* %time
└───────────────⭓

*• Jaga grup kita ya~*`,
    demoteText: `┌─⭓「 *TURUN JABATAN* 」
│ *• Terima kasih* %member sudah menjadi admin
│ *• Waktu perubahan:* %time
└───────────────⭓

*• Tetap semangat berkontribusi!*`,
  };

  const parseTemplate = (template, participant, subject, time) => {
    return template
      .replace(/%member/g, `@${participant.split("@")[0]}`)
      .replace(/%subject/g, subject)
      .replace(/%time/g, time);
  };

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
      const groupMetadata = await sock.groupMetadata(groupUpdate.id);
      const participants = groupUpdate.participants;
      const totalMembers = groupMetadata.participants.length;
      const groupSettings = db.list().group[groupUpdate.id] || {};
      const currentTime = moment().tz("Asia/Jakarta").format("HH:mm");

      for (const participant of participants) {
        let userProfilePicture;
        try {
          userProfilePicture = await sock.profilePictureUrl(participant, "image");
        } catch {
          userProfilePicture = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60";
        }

        const imageBuffer = await getBuffer(userProfilePicture);

        if (groupUpdate.action === "add" && groupSettings.welcomeGoodbye) {
          const raw = groupSettings.welcomeText && groupSettings.welcomeText.trim() !== ""
            ? groupSettings.welcomeText
            : defaultTexts.welcomeText;
          const welcomeText = parseTemplate(raw, participant, groupMetadata.subject, currentTime);

          const welcomeCanvas = await new canvafy.WelcomeLeave()
            .setAvatar(imageBuffer)
            .setBackground("image", "https://e.top4top.io/p_31964qbk71.jpg")
            .setTitle("W E L C O M E")
            .setDescription(`Member #${totalMembers}`)
            .setBorder("#2a2e35")
            .setAvatarBorder("#2a2e35")
            .setOverlayOpacity(0.5)
            .build();

          await sock.sendMessage(groupUpdate.id, {
            image: welcomeCanvas,
            caption: welcomeText,
            mentions: [participant]
          });
        }

        if (groupUpdate.action === "remove" && groupSettings.welcomeGoodbye) {
          const raw = groupSettings.goodbyeText && groupSettings.goodbyeText.trim() !== ""
            ? groupSettings.goodbyeText
            : defaultTexts.goodbyeText;
          const goodbyeText = parseTemplate(raw, participant, groupMetadata.subject, currentTime);

          const goodbyeCanvas = await new canvafy.WelcomeLeave()
            .setAvatar(imageBuffer)
            .setBackground("image", "https://e.top4top.io/p_31964qbk71.jpg")
            .setTitle("G O O D B Y E")
            .setDescription(`Now ${totalMembers - 1} members`)
            .setBorder("#2a2e35")
            .setAvatarBorder("#2a2e35")
            .setOverlayOpacity(0.5)
            .build();

          await sock.sendMessage(groupUpdate.id, {
            image: goodbyeCanvas,
            caption: goodbyeText,
            mentions: [participant]
          });
        }

        if (groupUpdate.action === "promote" && groupSettings.promoteDemote) {
          const raw = groupSettings.promoteText && groupSettings.promoteText.trim() !== ""
            ? groupSettings.promoteText
            : defaultTexts.promoteText;
          const promoteText = parseTemplate(raw, participant, groupMetadata.subject, currentTime);

          const promoteCanvas = await new canvafy.WelcomeLeave()
            .setAvatar(imageBuffer)
            .setBackground("image", "https://e.top4top.io/p_31964qbk71.jpg")
            .setTitle("P R O M O T E D")
            .setDescription("New Admin")
            .setBorder("#2a2e35")
            .setAvatarBorder("#2a2e35")
            .setOverlayOpacity(0.5)
            .build();

          await sock.sendMessage(groupUpdate.id, {
            image: promoteCanvas,
            caption: promoteText,
            mentions: [participant]
          });
        }

        if (groupUpdate.action === "demote" && groupSettings.promoteDemote) {
          const raw = groupSettings.demoteText && groupSettings.demoteText.trim() !== ""
            ? groupSettings.demoteText
            : defaultTexts.demoteText;
          const demoteText = parseTemplate(raw, participant, groupMetadata.subject, currentTime);

          const demoteCanvas = await new canvafy.WelcomeLeave()
            .setAvatar(imageBuffer)
            .setBackground("image", "https://e.top4top.io/p_31964qbk71.jpg")
            .setTitle("D E M O T E D")
            .setDescription("No Longer Admin")
            .setBorder("#2a2e35")
            .setAvatarBorder("#2a2e35")
            .setOverlayOpacity(0.5)
            .build();

          await sock.sendMessage(groupUpdate.id, {
            image: demoteCanvas,
            caption: demoteText,
            mentions: [participant]
          });
        }
      }
    } catch (err) {
      console.error("Group participants update error:", err);
    }
  });
};