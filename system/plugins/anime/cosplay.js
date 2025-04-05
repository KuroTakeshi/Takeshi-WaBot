const axios = require("axios");

module.exports = {
  command: "cosplay",
  alias: ["cp"],
  category: ["anime"],
  async run(m, { sock, config, Api }) {
    try {
      const result = Api.createUrl("archive", `/asupan/cosplay`);
      await m.reply({
        image: { url: result },
        caption: config.messages.success,
      });
    } catch (e) {
      await m.reply(`${e}`);
    }
  },
};
