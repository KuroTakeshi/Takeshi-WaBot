const fs = require("fs");
const config = require("@configuration");

async function events(m, { sock }) {
  if (config.settings.autoBio) {
    let uptime = clockString(process.uptime() * 1000);

    try {
      await sock.updateProfileStatus(
        `Takeshi-WaBot | Runtime: ${uptime} | Mode: ${config.settings["groupOnly"] ? "Group" : "Publik"}`,
      );
    } catch (err) {
      console.error("Gagal memperbarui bio:", err);
    }
  }
}

module.exports = {
  events,
};

function clockString(ms) {
  let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
}
