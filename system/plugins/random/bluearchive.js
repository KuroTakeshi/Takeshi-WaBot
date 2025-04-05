const axios = require("axios");

module.exports = {
  command: "ba",
  alias: ["ba"],
  category: ["anime", "game", "random"],
  async run(m, { Api, sock, config }) {
    try {
      const result = Api.createUrl("apizell", `/random/ba`);
      await m.reply({
        image: { url: result },
        caption: config.messages.success,
      });
    } catch (e) {
      await m.reply(`${e}`);
    }
  },
};
