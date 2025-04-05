const axios = require('axios');
const cheerio = require('cheerio');

const cerpenCategories = [
  "anak",
  "bahasa daerah",
  "bahasa inggris",
  "bahasa jawa",
  "bahasa sunda",
  "budaya",
  "cinta",
  "cinta islami",
  "cinta pertama",
  "cinta romantis",
  "cinta sedih",
  "cinta segitiga",
  "cinta sejati",
  "galau",
  "gokil",
  "inspiratif",
  "jepang",
  "kehidupan",
  "keluarga",
  "kisah nyata",
  "korea",
  "kristen",
  "liburan",
  "malaysia",
  "mengharukan",
  "misteri",
  "motivasi",
  "nasihat",
  "nasionalisme",
  "olahraga",
  "patah hati",
  "penantian",
  "pendidikan",
  "pengalaman pribadi",
  "pengorbanan",
  "penyesalan",
  "perjuangan",
  "perpisahan",
  "persahabatan",
  "petualangan",
  "ramadhan",
  "remaja",
  "rindu",
  "rohani",
  "romantis",
  "sastra",
  "sedih",
  "sejarah"
];

async function cerpen(category) {
  return new Promise(async (resolve, reject) => {
    try {
      let title = category.toLowerCase().replace(/[()*]/g, "");
      let judul = title.replace(/\s/g, "-");
      let page = Math.floor(Math.random() * 5);
      
      const { data } = await axios.get(`http://cerpenmu.com/category/cerpen-${judul}/page/${page}`);
      let $ = cheerio.load(data);
      let links = [];
      
      $('article.post').each(function() {
        links.push($(this).find('a').attr('href'));
      });
      
      if (links.length === 0) {
        return reject(new Error("No stories found for this category"));
      }
      
      let randomLink = links[Math.floor(Math.random() * links.length)];
      const storyRes = await axios.get(randomLink);
      let $$ = cheerio.load(storyRes.data);
      
      const contentText = $$('#content > article').text();
      const hasil = {
        title: $$('#content > article > h1').text().trim(),
        author: contentText.split('Cerpen Karangan: ')[1]?.split('Kategori: ')[0]?.trim() || 'Unknown',
        kategori: contentText.split('Kategori: ')[1]?.split('\n')[0]?.trim() || 'Unknown',
        lolos: contentText.split('Lolos moderasi pada: ')[1]?.split('\n')[0]?.trim() || 'Unknown',
        cerita: $$('#content > article > p').text().trim()
      };
      
      resolve(hasil);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  command: "cerpen",
  alias: ["cerpen"],
  category: ["story"],
  description: "Mendapatkan cerpen dari berbagai kategori yang tersedia",
  async run(m, { text, sock, Func, config }) {
    if (!text) {
      return m.reply(
        `> *– 乂 Panduan Penggunaan Perintah* 💡\n` +
        `> 1. Gunakan *\`.cerpen [kategori]\`* untuk membaca cerpen\n` +
        `> 2. Gunakan *\`.cerpen --list\`* untuk melihat daftar kategori\n` +
        `> Contoh: \`.cerpen cinta\``
      );
    }

    if (text === "--list") {
      return m.reply(
        `> *– 乂 Kategori Cerpen Tersedia:*\n` +
        cerpenCategories.map((c, i) => `> *${i + 1}.* ${c}`).join("\n")
      );
    }

    if (!cerpenCategories.includes(text.toLowerCase())) {
      return m.reply(
        `> ❌ *Kategori tidak ditemukan!*\n` +
        `> Gunakan \`.cerpen --list\` untuk melihat daftar kategori yang tersedia.`
      );
    }

    try {
      let hasil = await cerpen(text);
      await m.reply(
        `❏ *Judul*: ${hasil.title}\n` +
        `❏ *Author*: ${hasil.author}\n` +
        `❏ *Category*: ${hasil.kategori}\n` +
        `❏ *Pass Moderation*: ${hasil.lolos}\n\n` +
        `❏ *Story*: ${hasil.cerita}`
      );
    } catch (e) {
      console.error(e);
      return m.reply(
        `> ❌ *Gagal mengambil cerpen untuk kategori "${text}"*\n` +
        `> Coba lagi nanti atau pilih kategori lain.`
      );
    }
  },
};