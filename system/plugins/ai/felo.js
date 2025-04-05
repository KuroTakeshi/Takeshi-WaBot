const axios = require("axios");

module.exports = {
  command: "felo",
  alias: ["fl"],
  category: ["ai"],
  description: "Jawab semua pertanyaan mu dengan Felo AI",
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
      const apiUrl = Api.createUrl("fast", "/aiexperience/felo", {
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
