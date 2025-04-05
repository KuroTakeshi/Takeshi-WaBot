const axios = require("axios");

module.exports = {
  command: "korean",
  alias: ["korean"],
  category: ["nsfw", "random"],
  async run(m, { Api, sock, config }) {
    try {
      const result = Api.createUrl("delirius", `/nsfw/corean`);
      await m.reply({
        image: { url: result },
        caption: config.messages.success,
      });
    } catch (e) {
      await m.reply(`${e}`);
    }
  },
};
