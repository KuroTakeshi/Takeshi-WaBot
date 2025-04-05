const axios = require("axios");

const sfwCategories = [
  "waifu",
  "maid",
  "marin-kitagawa",
  "mori-calliope",
  "raiden-shogun",
  "selfies",
  "uniform",
  "kamisato-ayaka",
];

const nsfwCategories = [
  "oppai",
  "ero",
  "ass",
  "hentai",
  "milf",
  "oral",
  "paizuri",
  "ecchi",
];

module.exports = {
  command: "waifuim",
  alias: ["wim"],
  category: ["anime", "sfw"],
  settings: {
    owner: false,
  },
  description:
    "Mendapatkan gambar dari Waifu.im API dengan kategori SFW atau NSFW",
  async run(m, { text, sock, Func, config }) {
    let args = text.split(" ");
    if (!text) {
      return m.reply(
        `> *– 乂 Panduan Penggunaan Perintah* 💡\n` +
          `> 1. Gunakan *\`.waifuim --sfw [kategori]\`* untuk gambar SFW\n` +
          `> 2. Gunakan *\`.waifuim --nsfw [kategori]\`* untuk gambar NSFW\n` +
          `> 3. Gunakan *\`.waifuim --list\`* untuk melihat kategori`,
      );
    }

    let type = args[0].toLowerCase();
    let category = args[1]?.toLowerCase();

    if (type === "--list") {
      return m.reply(
        `> *– 乂 Kategori yang Tersedia:*\n` +
          `> *SFW:* ${sfwCategories.join(", ")}\n` +
          `> *NSFW:* ${nsfwCategories.join(", ")}`,
      );
    }

    if (type === "--sfw" && !sfwCategories.includes(category)) {
      return m.reply(
        `> ❌ *Kategori SFW tidak ditemukan!*\n> Gunakan \`.waifuim --list\` untuk melihat daftar kategori.`,
      );
    }

    if (type === "--nsfw" && !nsfwCategories.includes(category)) {
      return m.reply(
        `> ❌ *Kategori NSFW tidak ditemukan!*\n> Gunakan \`.waifuim --list\` untuk melihat daftar kategori.`,
      );
    }

    let apiUrl = `https://api.waifu.im/search?included_tags=${encodeURIComponent(category)}`;

    try {
      let res = await axios.get(apiUrl);
      if (!res.data.images || res.data.images.length === 0)
        throw "Error mengambil gambar";

      let imageUrl = res.data.images[0].url;

      await m.reply({
        image: { url: imageUrl },
        caption: config.messages.success,
      });
    } catch (e) {
      return m.reply(
        `> ❌ *Gagal mengambil gambar untuk kategori "${category}"*\n> Coba lagi nanti atau pilih kategori lain.`,
      );
    }
  },
};
