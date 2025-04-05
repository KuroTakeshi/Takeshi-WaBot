function generateInstruction(actions, mediaTypes) {
  if (!actions || !actions.length)
    return "'actions' yang diperlukan harus ditentukan!";

  let translatedMediaTypes;
  if (typeof mediaTypes === "string") {
    translatedMediaTypes = [mediaTypes];
  } else if (Array.isArray(mediaTypes)) {
    translatedMediaTypes = mediaTypes;
  } else {
    return "'mediaTypes' harus berupa string atau array string!";
  }

  const mediaTypeTranslations = {
    audio: "audio",
    contact: "kontak",
    document: "dokumen",
    gif: "GIF",
    image: "gambar",
    liveLocation: "lokasi langsung",
    location: "lokasi",
    payment: "pembayaran",
    poll: "polling",
    product: "produk",
    ptt: "pesan suara",
    reaction: "reaksi",
    sticker: "stiker",
    templateMessage: "pesan template",
    text: "teks",
    video: "video",
    viewOnce: "sekali lihat",
  };

  const translatedMediaTypeList = translatedMediaTypes.map(
    (type) => mediaTypeTranslations[type],
  );

  let mediaTypesList;
  if (translatedMediaTypeList.length > 1) {
    const lastMediaType =
      translatedMediaTypeList[translatedMediaTypeList.length - 1];
    mediaTypesList =
      translatedMediaTypeList.slice(0, -1).join(", ") +
      `, atau ${lastMediaType}`;
  } else {
    mediaTypesList = translatedMediaTypeList[0];
  }

  const actionTranslations = {
    send: "Kirim",
    reply: "Balas",
  };

  const instructions = actions.map((action) => `${actionTranslations[action]}`);
  const actionList = instructions.join(actions.length > 1 ? " atau " : "");

  return `> ‼️ ${actionList} ${mediaTypesList}!`;
}

function generateCommandExample(prefix, command, args) {
  if (!prefix) return "'prefix' harus diberikan!";
  if (!command) return "'command' harus diberikan!";
  if (!args) return "'args' harus diberikan!";

  const commandMessage = `> Contoh: \`\`\`${prefix + command} ${args}\`\`\``;
  return commandMessage;
}

function generatesFlagInformation(flags) {
  if (typeof flags !== "object" || !flags) return "'flags' harus berupa objek!";

  const flagInfo =
    "Flag:\n" +
    Object.entries(flags)
      .map(([flag, description]) => `> • \`\`\`${flag}\`\`\`: ${description}`)
      .join("\n");

  return flagInfo;
}

function generateNotes(notes) {
  if (!Array.isArray(notes)) return "'notes' harus berupa string!";

  const notesInfo =
    "Catatan:\n" + notes.map((note) => `> • ${note}`).join("\n");

  return notesInfo;
}

module.exports = {
  generateInstruction,
  generateCommandExample,
  generatesFlagInformation,
  generateNotes,
};
