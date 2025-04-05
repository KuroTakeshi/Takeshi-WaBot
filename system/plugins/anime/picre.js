module.exports = {
  command: "picre",
  alias: ["pcr"],
  category: ["anime"],
  async run(m, { sock, config }) {
    try {
      await m.reply({
        image: { url: "https://pic.re/image" },
        caption: config.messages.success,
      });
    } catch (e) {
      await m.reply(`${e}`);
    }
  },
};
