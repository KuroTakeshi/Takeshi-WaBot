const axios = require("axios");

module.exports = {
  command: "aoyo",
  alias: ["ao"],
  category: ["ai"],
  description: "Jawab semua pertanyaan mu dengan Aoyo AI",
  loading: true,
  async run(m, { text, sock, Api, Msg, config }) {
    if (!text)
      return m.reply(
        `${Msg.generateInstruction(["send"], ["text"])}\n` +
          Msg.generateCommandExample(
            m.prefix,
            m.command,
            "Apa itu bot whatsapp?",
          ),
      );
    try {
      const apiUrl = Api.createUrl("fast", "/aiexperience/aoyo", {
        ask: text,
      });
      const result = (await axios.get(apiUrl)).data.result.answer;

      return await m.reply(result);
    } catch (error) {
      m.reply(error);
      if (error.status !== 200) return await m.reply(config.messages.notFound);
    }
  },
};
