const config = require("@configuration");

module.exports = (sock) => {
  const lastCall = new Map();

  sock.ev.on("call", async (callData) => {
    if (!config.settings.antiCall) return;

    for (const call of callData) {
      const now = Date.now();
      const lastCallTime = lastCall.get(call.from) || 0;

      if (now - lastCallTime > 5000) {
        lastCall.set(call.from, now);
        
        await sock.rejectCall(call.id, call.from);
        await sock.sendMessage(call.from, {
          text: `🚫 ${config.messages.call}`,
          mentions: [call.from]
        });
      }
    }
  });
};