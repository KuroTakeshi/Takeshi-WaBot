module.exports = {
  command: "settings",
  alias: ["stg"],
  category: ["group"],
  description: "⚙️ Mengatur fitur grup (welcome/promote/anti-porn/anti-badwords)",
  settings: {
    group: true,
    admin: true,
    botAdmin: true,
  },
  async run(m, { text }) {
    const [feature, status] = text.split(" ").map((v) => v.trim());

    const validFeatures = ["welcome", "promote", "porn", "badwords"];
    const validStatus = ["on", "off"];

    if (!feature || !status) {
      return m.reply(
        `*⚙️ Cara Menggunakan Settings:*\n\n` +
        `> 📌 *Format:* \`.settings [fitur] [on/off]\`\n\n` +
        `*⚙️ Fitur yang Tersedia:*\n` +
        `> • *welcome* - Sambutan member masuk/keluar\n` +
        `> • *promote* - Notifikasi promote/demote admin\n` +
        `> • *porn* - Filter konten dewasa (gambar/sticker)\n` +
        `> • *badwords* - Filter kata-kata kasar\n\n` +
        `*⚙️ Contoh Penggunaan:*\n` +
        `> • \`.set welcome on\`\n` +
        `> • \`.set promote off\`\n` +
        `> • \`.set porn on\`\n` +
        `> • \`.set badwords off\``
      );
    }

    if (!validFeatures.includes(feature)) {
      return m.reply("❌ Fitur tidak dikenali. Gunakan `.set` untuk melihat daftar fitur.");
    }

    if (!validStatus.includes(status)) {
      return m.reply("❌ Status hanya bisa `on` atau `off`.");
    }

    const groupId = m.cht;
    const isEnabled = status === "on";

    if (!db.list().group[groupId]) {
      db.list().group[groupId] = {};
    }

    const featureKeys = {
      welcome: "welcomeGoodbye",
      promote: "promoteDemote",
      porn: "antiporn",
      badwords: "antibadwords",
    };

    db.list().group[groupId][featureKeys[feature]] = isEnabled;
    await db.save();

    const actionText = isEnabled ? "mengaktifkan" : "menonaktifkan";
    const featureDesc = {
      welcome: isEnabled
        ? "Bot akan kirim pesan sambutan otomatis."
        : "Pesan sambutan dinonaktifkan.",
      promote: isEnabled
        ? "Bot akan memberi notifikasi saat admin berubah."
        : "Notifikasi promote/demote dimatikan.",
      porn: isEnabled
        ? "Bot akan menghapus konten NSFW secara otomatis."
        : "Filter konten dewasa dimatikan.",
      badwords: isEnabled
        ? "Bot akan menghapus pesan dengan kata kasar."
        : "Filter kata kasar dinonaktifkan.",
    };

    return m.reply(`> ✅ *Berhasil ${actionText} fitur ${feature}*\n> ${featureDesc[feature]}`);
  },
};