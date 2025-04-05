const axios = require("axios");

module.exports = {
  command: "loli",
  alias: ["loli"],
  category: ["anime"],
  async run(m, { sock, config }) {
    try {
      const res = await axios.get(
        "https://api.lolicon.app/setu/v2?num=1&r18=0&tag=lolicon",
      );
      const result = await res.data.data[0].urls.original;
      await m.reply({
        image: { url: result },
        caption: config.messages.success,
      });
    } catch (e) {
      await m.reply(`${e}`);
    }
  },
};
