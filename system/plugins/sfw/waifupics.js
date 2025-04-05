const axios = require("axios");

const sfwCategories = [
  "waifu",
  "neko",
  "shinobu",
  "megumin",
  "bully",
  "cuddle",
  "cry",
  "hug",
  "awoo",
  "kiss",
  "lick",
  "pat",
  "smug",
  "bonk",
  "yeet",
  "blush",
  "smile",
  "wave",
  "highfive",
  "handhold",
  "nom",
  "bite",
  "glomp",
  "slap",
  "kill",
  "kick",
  "happy",
  "wink",
  "poke",
  "dance",
  "cringe",
];

const nsfwCategories = ["waifu", "neko", "trap", "blowjob"];

module.exports = {
  command: "waifupics",
  alias: ["wpics"],
  category: ["anime", "sfw"],
  settings: {
    owner: false,
  },
  description:
    "Mendapatkan gambar dari Waifu.pics API dengan kategori SFW atau NSFW",
  async run(m, { text, sock, Func, config }) {
    let args = text.split(" ");
    if (!text) {
      return m.reply(
        `> *– 乂 Panduan Penggunaan Perintah* 💡\n> 1. Gunakan *\`.waifupics --sfw [kategori]\`* untuk gambar SFW\n> 2. Gunakan *\`.waifupics --nsfw [kategori]\`* untuk gambar NSFW\n> 3. Gunakan *\`.waifupics --list\`* untuk melihat kategori`,
      );
    }

    let type = args[0].toLowerCase();
    let category = args[1]?.toLowerCase();

    if (type === "--list") {
      return m.reply(
        `> *– 乂 Kategori yang Tersedia:*\n> *SFW:* ${sfwCategories.join(", ")}\n> *NSFW:* ${nsfwCategories.join(", ")}`,
      );
    }

    if (type === "--sfw" && !sfwCategories.includes(category)) {
      return m.reply(
        `> ❌ *Kategori SFW tidak ditemukan!*\n> Gunakan \`.waifupics --list\` untuk melihat daftar kategori.`,
      );
    }

    if (type === "--nsfw" && !nsfwCategories.includes(category)) {
      return m.reply(
        `> ❌ *Kategori NSFW tidak ditemukan!*\n> Gunakan \`.waifupics --list\` untuk melihat daftar kategori.`,
      );
    }

    let apiUrl = `https://api.waifu.pics/${type.replace("--", "")}/${category}`;

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
