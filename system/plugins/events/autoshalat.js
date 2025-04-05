const fetch = require("node-fetch");

async function events(m, { sock }) {
  if (!global.autosholat) global.autosholat = {};
  let who =
    m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.fromMe
        ? sock.user.id
        : m.sender;
  let id = m.cht;

  if (id in global.autosholat) {
    return;
  }

  let jadwalSholat = {
    Shubuh: "04:45",
    Dhuha: "06:20",
    Dhuhur: "11:55",
    Ashar: "15:15",
    Maghrib: "18:05",
    Isha: "19:05",
  };

  const date = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
  );
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  for (const [sholat, waktu] of Object.entries(jadwalSholat)) {
    if (timeNow === waktu) {
      let caption = `Halo! Waktu *${sholat}* telah tiba. Segera ambil wudhu dan laksanakan sholat dengan khusyuk. Jangan sampai terlewat, ya! ðŸ™‚\n\nâ° *${waktu}*\n_(Untuk wilayah Jawa Barat dan sekitarnya.)_`;
      global.autosholat[id] = [
        sock.sendMessage(m.cht, { text: caption, mentions: [who] }),
        setTimeout(() => {
          delete global.autosholat[id];
        }, 57000),
      ];
    }
  }
}

module.exports = { events };