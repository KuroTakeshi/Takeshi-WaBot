const axios = require("axios");

module.exports = {
  command: "boobs",
  alias: ["boobs"],
  category: ["nsfw", "random"],
  async run(m, { Api, sock, config }) {
    try {
      const result = Api.createUrl("delirius", `/nsfw/boobs`);
      await m.reply({
        image: { url: result },
        caption: config.messages.success,
      });
    } catch (e) {
      await m.reply(`${e}`);
    }
  },
};
