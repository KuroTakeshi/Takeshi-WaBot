module.exports = {
  command: "set",
  alias: [],
  category: ["group"],
  description: "⚙️ Mengatur pesan custom (welcome/goodbye/promote/demote)",
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  async run(m, { text }) {
    const [feature, ...rest] = text.split(" ");
    const customText = rest.join(" ").trim();

    const validFeatures = ["welcome", "goodbye", "promote", "demote"];
    const groupId = m.cht;

    if (!feature || !validFeatures.includes(feature)) {
      return m.reply(
        `*⚙️ Cara Menggunakan .set [fitur] [teks]*\n\n` +
        `*Fitur yang bisa diubah:*\n` +
        `> • welcome\n` +
        `> • goodbye\n` +
        `> • promote\n` +
        `> • demote\n\n` +
        `*Contoh:* \`.set welcome Halo %member, selamat datang di %subject!\`\n\n` +
        `*Placeholder yang bisa digunakan:*\n` +
        `> • %member → Nama member\n` +
        `> • %subject → Nama grup\n` +
        `> • %time → Waktu saat ini`
      );
    }

    if (!db.list().group[groupId]) {
      db.list().group[groupId] = {};
    }

    const textKeys = {
      welcome: "welcomeText",
      goodbye: "goodbyeText",
      promote: "promoteText",
      demote: "demoteText",
    };

    db.list().group[groupId][textKeys[feature]] = customText;
    await db.save();

    return m.reply(`> ✅ *Pesan ${feature} berhasil diperbarui!*`);
  },
};