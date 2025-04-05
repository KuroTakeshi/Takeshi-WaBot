const axios = require("axios");

const nekosCategories = [
  "fox_girl",
  "smug",
  "woof",
  "gasm",
  "8ball",
  "goose",
  "cuddle",
  "avatar",
  "slap",
  "pat",
  "gecg",
  "feed",
  "lizard",
  "neko",
  "hug",
  "meow",
  "kiss",
  "wallpaper",
  "tickle",
  "spank",
  "waifu",
  "lewd",
];

module.exports = {
  command: "nekos",
  alias: [],
  category: ["anime", "sfw"],
  description: "Mendapatkan gambar dari nekos.life API berdasarkan kategori",
  async run(m, { text, sock, config }) {
    if (!text || text === "--list") {
      return m.reply(
        `> *– 乂 Kategori yang Tersedia:*\n\n` +
          nekosCategories.map((cat) => `> • *${cat}*`).join("\n") +
          `\n\n> Gunakan *\`.nekos [kategori]\`* untuk mendapatkan gambar.`,
      );
    }

    let category = text.toLowerCase();
    if (!nekosCategories.includes(category)) {
      return m.reply(
        `> ❌ *Kategori tidak ditemukan!*\n> Gunakan \`.nekos --list\` untuk melihat daftar kategori.`,
      );
    }

    let apiUrl = `https://nekos.life/api/v2/img/${category}`;

    try {
      let res = await axios.get(apiUrl);
      if (!res.data.url) throw "Error mengambil gambar";

      await m.reply({
        image: { url: res.data.url },
        caption: config.messages.success,
      });
    } catch (e) {
      return m.reply(
        `> ❌ *Gagal mengambil gambar untuk kategori "${category}"*\n> Coba lagi nanti atau pilih kategori lain.`,
      );
    }
  },
};
