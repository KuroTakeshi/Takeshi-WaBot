const emoticons = [
  "💘",
  "💝",
  "💖",
  "💗",
  "💓",
  "💞",
  "💕",
  "💟",
  "❣️",
  "💔",
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🤎",
  "🖤",
  "🤍",
  "❤️‍",
  "🔥",
  "❤️‍",
  "🩹",
  "💯",
  "♨️",
  "💢",
  "💬",
  "👁️‍🗨️",
  "🗨️",
  "🗯️",
  "💭",
  "💤",
  "🌐",
  "♠️",
  "♥️",
  "♦️",
  "♣️",
  "🃏",
  "🀄️",
  "🎴",
  "🎭️",
  "🔇",
  "🔈️",
  "🔉",
  "🔊",
  "🔔",
  "🔕",
  "🎼",
  "🎵",
  "🎶",
  "💹",
  "🏧",
  "🚮",
  "🚰",
  "♿️",
  "🚹️",
  "🚺️",
  "🚻",
  "🚼️",
  "🚾",
  "🛂",
  "🛃",
  "🛄",
  "🛅",
  "⚠️",
  "🚸",
  "⛔️",
  "🚫",
  "🚳",
  "🚭️",
  "🚯",
  "🚱",
  "🚷",
  "📵",
  "🔞",
  "☢️",
  "☣️",
  "⬆️",
  "↗️",
  "➡️",
  "↘️",
  "⬇️",
  "↙️",
  "⬅️",
  "↖️",
  "↕️",
  "↔️",
  "↩️",
  "↪️",
  "⤴️",
  "⤵️",
  "🔃",
  "🔄",
  "🔙",
  "🔚",
  "🔛",
  "🔜",
  "🔝",
  "🛐",
  "⚛️",
  "🕉️",
  "✡️",
  "☸️",
  "☯️",
  "✝️",
  "☦️",
  "☪️",
  "☮️",
  "🕎",
  "🔯",
  "♈️",
  "♉️",
  "♊️",
  "♋️",
  "♌️",
  "♍️",
  "♎️",
  "♏️",
  "♐️",
  "♑️",
  "♒️",
  "♓️",
  "⛎",
  "🔀",
  "🔁",
  "🔂",
  "▶️",
  "⏩️",
  "⏭️",
  "⏯️",
  "◀️",
  "⏪️",
  "⏮️",
  "🔼",
  "⏫",
  "🔽",
  "⏬",
  "⏸️",
  "⏹️",
  "⏺️",
  "⏏️",
  "🎦",
  "🔅",
  "🔆",
  "📶",
  "📳",
  "📴",
  "♀️",
  "♂️",
  "⚧",
  "✖️",
  "➕",
  "➖",
  "➗",
  "♾️",
  "‼️",
  "⁉️",
  "❓️",
  "❔",
  "❕",
  "❗️",
  "〰️",
  "💱",
  "💲",
  "⚕️",
  "♻️",
  "⚜️",
  "🔱",
  "📛",
  "🔰",
  "⭕️",
  "✅",
  "☑️",
  "✔️",
  "❌",
  "❎",
  "➰",
  "➿",
  "〽️",
  "✳️",
  "✴️",
  "❇️",
  "©️",
  "®️",
  "™️",
  "#️⃣",
  "*️⃣",
  "0️⃣",
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣",
  "🔟",
  "🔠",
  "🔡",
  "🔢",
  "🔣",
  "🔤",
  "🅰️",
  "🆎",
  "🅱️",
  "🆑",
  "🆒",
  "🆓",
  "ℹ️",
  "🆔",
  "Ⓜ️",
  "🆕",
  "🆖",
  "🅾️",
  "🆗",
  "🅿️",
  "🆘",
  "🆙",
  "🆚",
  "🈁",
  "🈂️",
  "🈷️",
  "🈶",
  "🈯️",
  "🉐",
  "🈹",
  "🈚️",
  "🈲",
  "🉑",
  "🈸",
  "🈴",
  "🈳",
  "㊗️",
  "㊙️",
  "🈺",
  "🈵",
  "🔴",
  "🟠",
  "🟡",
  "🟢",
  "🔵",
  "🟣",
  "🟤",
  "⚫️",
  "⚪️",
  "🟥",
  "🟧",
  "🟨",
  "🟩",
  "🟦",
  "🟪",
  "🟫",
  "⬛️",
  "⬜️",
  "◼️",
  "◻️",
  "◾️",
  "◽️",
  "▪️",
  "▫️",
  "🔶",
  "🔷",
  "🔸",
  "🔹",
  "🔺",
  "🔻",
  "💠",
  "🔘",
  "🔳",
  "🔲",
  "🕛️",
  "🕧️",
  "🕐️",
  "🕜️",
  "🕑️",
  "🕝️",
  "🕒️",
  "🕞️",
  "🕓️",
  "🕟️",
  "🕔️",
  "🕠️",
  "🕕️",
  "🕡️",
  "🕖️",
  "🕢️",
  "🕗️",
  "🕣️",
  "🕘️",
  "🕤️",
  "🕙️",
  "🕥️",
  "🕚️",
  "🕦️",
  "*️",
  "#️",
  "0️",
  "1️",
  "2️",
  "3️",
  "4️",
  "5️",
  "6️",
  "7️",
  "8️",
  "9️",
  "🛎️",
  "🧳",
  "⌛️",
  "⏳️",
  "⌚️",
  "⏰",
  "⏱️",
  "⏲️",
  "🕰️",
  "🌡️",
  "🗺️",
  "🧭",
  "🎃",
  "🎄",
  "🧨",
  "🎈",
  "🎉",
  "🎊",
  "🎎",
  "🎏",
  "🎐",
  "🎀",
  "🎁",
  "🎗️",
  "🎟️",
  "🎫",
  "🔮",
  "🧿",
  "🎮️",
  "🕹️",
  "🎰",
  "🎲",
  "♟️",
  "🧩",
  "🧸",
  "🖼️",
  "🎨",
  "🧵",
  "🧶",
  "👓️",
  "🕶️",
  "🥽",
  "🥼",
  "🦺",
  "👔",
  "👕",
  "👖",
  "🧣",
  "🧤",
  "🧥",
  "🧦",
  "👗",
  "👘",
  "🥻",
  "🩱",
  "🩲",
  "🩳",
  "👙",
  "👚",
  "👛",
  "👜",
  "👝",
  "🛍️",
  "🎒",
  "👞",
  "👟",
  "🥾",
  "🥿",
  "👠",
  "👡",
  "🩰",
  "👢",
  "👑",
  "👒",
  "🎩",
  "🎓️",
  "🧢",
  "⛑️",
  "📿",
  "💄",
  "💍",
  "💎",
  "📢",
  "📣",
  "📯",
  "🎙️",
  "🎚️",
  "🎛️",
  "🎤",
  "🎧️",
  "📻️",
  "🎷",
  "🎸",
  "🎹",
  "🎺",
  "🎻",
  "🪕",
  "🥁",
  "📱",
  "📲",
  "☎️",
  "📞",
  "📟️",
  "📠",
  "🔋",
  "🔌",
  "💻️",
  "🖥️",
  "🖨️",
  "⌨️",
  "🖱️",
  "🖲️",
  "💽",
  "💾",
  "💿️",
  "📀",
  "🧮",
  "🎥",
  "🎞️",
  "📽️",
  "🎬️",
  "📺️",
  "📷️",
  "📸",
  "📹️",
  "📼",
  "🔍️",
  "🔎",
  "🕯️",
  "💡",
  "🔦",
  "🏮",
  "🪔",
  "📔",
  "📕",
  "📖",
  "📗",
  "📘",
  "📙",
  "📚️",
  "📓",
  "📒",
  "📃",
  "📜",
  "📄",
  "📰",
  "🗞️",
  "📑",
  "🔖",
  "🏷️",
  "💰️",
  "💴",
  "💵",
  "💶",
  "💷",
  "💸",
  "💳️",
  "🧾",
  "✉️",
  "💌",
  "📧",
  "🧧",
  "📨",
  "📩",
  "📤️",
  "📥️",
  "📦️",
  "📫️",
  "📪️",
  "📬️",
  "📭️",
  "📮",
  "🗳️",
  "✏️",
  "✒️",
  "🖋️",
  "🖊️",
  "🖌️",
  "🖍️",
  "📝",
  "💼",
  "📁",
  "📂",
  "🗂️",
  "📅",
  "📆",
  "🗒️",
  "🗓️",
  "📇",
  "📈",
  "📉",
  "📊",
  "📋️",
  "📌",
  "📍",
  "📎",
  "🖇️",
  "📏",
  "📐",
  "✂️",
  "🗃️",
  "🗄️",
  "🗑️",
  "🔒️",
  "🔓️",
  "🔏",
  "🔐",
  "🔑",
  "🗝️",
  "🔨",
  "🪓",
  "⛏️",
  "⚒️",
  "🛠️",
  "🗡️",
  "⚔️",
  "💣️",
  "🏹",
  "🛡️",
  "🔧",
  "🔩",
  "⚙️",
  "🗜️",
  "⚖️",
  "🦯",
  "🔗",
  "⛓️",
  "🧰",
  "🧲",
  "⚗️",
  "🧪",
  "🧫",
  "🧬",
  "🔬",
  "🔭",
  "📡",
  "💉",
  "🩸",
  "💊",
  "🩹",
  "🩺",
  "🚪",
  "🛏️",
  "🛋️",
  "🪑",
  "🚽",
  "🚿",
  "🛁",
  "🪒",
  "🧴",
  "🧷",
  "🧹",
  "🧺",
  "🧻",
  "🧼",
  "🧽",
  "🧯",
  "🛒",
  "🚬",
  "⚰️",
  "⚱️",
  "🏺",
  "🕳️",
  "🏔️",
  "⛰️",
  "🌋",
  "🗻",
  "🏕️",
  "🏖️",
  "🏜️",
  "🏝️",
  "🏟️",
  "🏛️",
  "🏗️",
  "🧱",
  "🏘️",
  "🏚️",
  "🏠️",
  "🏡",
  "🏢",
  "🏣",
  "🏤",
  "🏥",
  "🏦",
  "🏨",
  "🏩",
  "🏪",
  "🏫",
  "🏬",
  "🏭️",
  "🏯",
  "🏰",
  "💒",
  "🗼",
  "🗽",
  "⛪️",
  "🕌",
  "🛕",
  "🕍",
  "⛩️",
  "🕋",
  "⛲️",
  "⛺️",
  "🌁",
  "🌃",
  "🏙️",
  "🌄",
  "🌅",
  "🌆",
  "🌇",
  "🌉",
  "🗾",
  "🏞️",
  "🎠",
  "🎡",
  "🎢",
  "💈",
  "🎪",
  "🚂",
  "🚃",
  "🚄",
  "🚅",
  "🚆",
  "🚇️",
  "🚈",
  "🚉",
  "🚊",
  "🚝",
  "🚞",
  "🚋",
  "🚌",
  "🚍️",
  "🚎",
  "🚐",
  "🚑️",
  "🚒",
  "🚓",
  "🚔️",
  "🚕",
  "🚖",
  "🚗",
  "🚘️",
  "🚙",
  "🚚",
  "🚛",
  "🚜",
  "🏎️",
  "🏍️",
  "🛵",
  "🦽",
  "🦼",
  "🛺",
  "🚲️",
  "🛴",
  "🛹",
  "🚏",
  "🛣️",
  "🛤️",
  "🛢️",
  "⛽️",
  "🚨",
  "🚥",
  "🚦",
  "🛑",
  "🚧",
  "⚓️",
  "⛵️",
  "🛶",
  "🚤",
  "🛳️",
  "⛴️",
  "🛥️",
  "🚢",
  "✈️",
  "🛩️",
  "🛫",
  "🛬",
  "🪂",
  "💺",
  "🚁",
  "🚟",
  "🚠",
  "🚡",
  "🛰️",
  "🚀",
  "🛸",
  "🎆",
  "🎇",
  "🎑",
  "🗿",
  "⚽️",
  "⚾️",
  "🥎",
  "🏀",
  "🏐",
  "🏈",
  "🏉",
  "🎾",
  "🥏",
  "🎳",
  "🏏",
  "🏑",
  "🏒",
  "🥍",
  "🏓",
  "🏸",
  "🥊",
  "🥋",
  "🥅",
  "⛳️",
  "⛸️",
  "🎣",
  "🤿",
  "🎽",
  "🎿",
  "🛷",
  "🥌",
  "🎯",
  "🪀",
  "🪁",
  "🎱",
  "🎖️",
  "🏆️",
  "🏅",
  "🥇",
  "🥈",
  "🥉",
  "🍇",
  "🍈",
  "🍉",
  "🍊",
  "🍋",
  "🍌",
  "🍍",
  "🥭",
  "🍎",
  "🍏",
  "🍐",
  "🍑",
  "🍒",
  "🍓",
  "🥝",
  "🍅",
  "🥥",
  "🥑",
  "🍆",
  "🥔",
  "🥕",
  "🌽",
  "🌶️",
  "🥒",
  "🥬",
  "🥦",
  "🧄",
  "🧅",
  "🍄",
  "🥜",
  "🌰",
  "🍞",
  "🥐",
  "🥖",
  "🥨",
  "🥯",
  "🥞",
  "🧇",
  "🧀",
  "🍖",
  "🍗",
  "🥩",
  "🥓",
  "🍔",
  "🍟",
  "🍕",
  "🌭",
  "🥪",
  "🌮",
  "🌯",
  "🥙",
  "🧆",
  "🥚",
  "🍳",
  "🥘",
  "🍲",
  "🥣",
  "🥗",
  "🍿",
  "🧈",
  "🧂",
  "🥫",
  "🍱",
  "🍘",
  "🍙",
  "🍚",
  "🍛",
  "🍜",
  "🍝",
  "🍠",
  "🍢",
  "🍣",
  "🍤",
  "🍥",
  "🥮",
  "🍡",
  "🥟",
  "🥠",
  "🥡",
  "🍦",
  "🍧",
  "🍨",
  "🍩",
  "🍪",
  "🎂",
  "🍰",
  "🧁",
  "🥧",
  "🍫",
  "🍬",
  "🍭",
  "🍮",
  "🍯",
  "🍼",
  "🥛",
  "☕️",
  "🍵",
  "🍶",
  "🍾",
  "🍷",
  "🍸️",
  "🍹",
  "🍺",
  "🍻",
  "🥂",
  "🥃",
  "🥤",
  "🧃",
  "🧉",
  "🧊",
  "🥢",
  "🍽️",
  "🍴",
  "🥄",
  "🔪",
  "🐵",
  "🐒",
  "🦍",
  "🦧",
  "🐶",
  "🐕️",
  "🦮",
  "🐕‍",
  "🦺",
  "🐩",
  "🐺",
  "🦊",
  "🦝",
  "🐱",
  "🐈️",
  "🐈‍",
  "🦁",
  "🐯",
  "🐅",
  "🐆",
  "🐴",
  "🐎",
  "🦄",
  "🦓",
  "🦌",
  "🐮",
  "🐂",
  "🐃",
  "🐄",
  "🐷",
  "🐖",
  "🐗",
  "🐽",
  "🐏",
  "🐑",
  "🐐",
  "🐪",
  "🐫",
  "🦙",
  "🦒",
  "🐘",
  "🦏",
  "🦛",
  "🐭",
  "🐁",
  "🐀",
  "🐹",
  "🐰",
  "🐇",
  "🐿️",
  "🦔",
  "🦇",
  "🐻",
  "🐻‍",
  "❄️",
  "🐨",
  "🐼",
  "🦥",
  "🦦",
  "🦨",
  "🦘",
  "🦡",
  "🐾",
  "🦃",
  "🐔",
  "🐓",
  "🐣",
  "🐤",
  "🐥",
  "🐦️",
  "🐧",
  "🕊️",
  "🦅",
  "🦆",
  "🦢",
  "🦉",
  "🦩",
  "🦚",
  "🦜",
  "🐸",
  "🐊",
  "🐢",
  "🦎",
  "🐍",
  "🐲",
  "🐉",
  "🦕",
  "🦖",
  "🐳",
  "🐋",
  "🐬",
  "🐟️",
  "🐠",
  "🐡",
  "🦈",
  "🐙",
  "🦑",
  "🦀",
  "🦞",
  "🦐",
  "🦪",
  "🐚",
  "🐌",
  "🦋",
  "🐛",
  "🐜",
  "🐝",
  "🐞",
  "🦗",
  "🕷️",
  "🕸️",
  "🦂",
  "🦟",
  "🦠",
  "💐",
  "🌸",
  "💮",
  "🏵️",
  "🌹",
  "🥀",
  "🌺",
  "🌻",
  "🌼",
  "🌷",
  "🌱",
  "🌲",
  "🌳",
  "🌴",
  "🌵",
  "🎋",
  "🎍",
  "🌾",
  "🌿",
  "☘️",
  "🍀",
  "🍁",
  "🍂",
  "🍃",
  "🌍️",
  "🌎️",
  "🌏️",
  "🌑",
  "🌒",
  "🌓",
  "🌔",
  "🌕️",
  "🌖",
  "🌗",
  "🌘",
  "🌙",
  "🌚",
  "🌛",
  "🌜️",
  "☀️",
  "🌝",
  "🌞",
  "🪐",
  "💫",
  "⭐️",
  "🌟",
  "✨",
  "🌠",
  "🌌",
  "☁️",
  "⛅️",
  "⛈️",
  "🌤️",
  "🌥️",
  "🌦️",
  "🌧️",
  "🌨️",
  "🌩️",
  "🌪️",
  "🌫️",
  "🌬️",
  "🌀",
  "🌈",
  "🌂",
  "☂️",
  "☔️",
  "⛱️",
  "⚡️",
  "❄️",
  "☃️",
  "⛄️",
  "☄️",
  "🔥",
  "💧",
  "🌊",
  "💥",
  "💦",
  "💨",
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "🤣",
  "😂",
  "🙂",
  "🙃",
  "😉",
  "😊",
  "😇",
  "🥰",
  "😍",
  "🤩",
  "😘",
  "😗",
  "☺️",
  "😚",
  "😙",
  "😋",
  "😛",
  "😜",
  "🤪",
  "😝",
  "🤑",
  "🤗",
  "🤭",
  "🤫",
  "🤔",
  "🤐",
  "🤨",
  "😐️",
  "😑",
  "😶",
  "😏",
  "😒",
  "🙄",
  "😬",
  "🤥",
  "😌",
  "😔",
  "😪",
  "😮‍",
  "💨",
  "🤤",
  "😴",
  "😷",
  "🤒",
  "🤕",
  "🤢",
  "🤮",
  "🤧",
  "🥵",
  "🥶",
  "😶‍",
  "🌫️",
  "🥴",
  "😵‍",
  "💫",
  "😵",
  "🤯",
  "🤠",
  "🥳",
  "😎",
  "🤓",
  "🧐",
  "😕",
  "😟",
  "🙁",
  "☹️",
  "😮",
  "😯",
  "😲",
  "😳",
  "🥺",
  "😦",
  "😧",
  "😨",
  "😰",
  "😥",
  "😢",
  "😭",
  "😱",
  "😖",
  "😣",
  "😞",
  "😓",
  "😩",
  "😫",
  "🥱",
  "😤",
  "😡",
  "😠",
  "🤬",
  "😈",
  "👿",
  "💀",
  "☠️",
  "💩",
  "🤡",
  "👹",
  "👺",
  "👻",
  "👽️",
  "👾",
  "🤖",
  "😺",
  "😸",
  "😹",
  "😻",
  "😼",
  "😽",
  "🙀",
  "😿",
  "😾",
  "🙈",
  "🙉",
  "🙊",
  "👋",
  "🤚",
  "🖐️",
  "✋",
  "🖖",
  "👌",
  "🤏",
  "✌️",
  "🤞",
  "🤟",
  "🤘",
  "🤙",
  "👈️",
  "👉️",
  "👆️",
  "🖕",
  "👇️",
  "☝️",
  "👍️",
  "👎️",
  "✊",
  "👊",
  "🤛",
  "🤜",
  "👏",
  "🙌",
  "👐",
  "🤲",
  "🤝",
  "🙏",
  "✍️",
  "💅",
  "🤳",
  "💪",
  "🦾",
  "🦿",
  "🦵",
  "🦶",
  "👂️",
  "🦻",
  "👃",
  "🧠",
  "🦷",
  "🦴",
  "👀",
  "👁️",
  "👅",
  "👄",
  "💋",
  "👶",
  "🧒",
  "👦",
  "👧",
  "🧑",
  "👨",
  "👩",
  "🧔",
  "🧔‍♀️",
  "🧔‍♂️",
  "🧑",
  "👨‍",
  "🦰",
  "👩‍",
  "🦰",
  "🧑",
  "👨‍",
  "🦱",
  "👩‍",
  "🦱",
  "🧑",
  "👨‍",
  "🦳",
  "👩‍",
  "🦳",
  "🧑",
  "👨‍",
  "🦲",
  "👩‍",
  "🦲",
  "👱",
  "👱‍♂️",
  "👱‍♀️",
  "🧓",
  "👴",
  "👵",
  "🙍",
  "🙍‍♂️",
  "🙍‍♀️",
  "🙎",
  "🙎‍♂️",
  "🙎‍♀️",
  "🙅",
  "🙅‍♂️",
  "🙅‍♀️",
  "🙆",
  "🙆‍♂️",
  "🙆‍♀️",
  "💁",
  "💁‍♂️",
  "💁‍♀️",
  "🙋",
  "🙋‍♂️",
  "🙋‍♀️",
  "🧏",
  "🧏‍♂️",
  "🧏‍♀️",
  "🙇",
  "🙇‍♂️",
  "🙇‍♀️",
  "🤦",
  "🤦‍♂️",
  "🤦‍♀️",
  "🤷",
  "🤷‍♂️",
  "🤷‍♀️",
  "🧑‍⚕️",
  "👨‍⚕️",
  "👩‍⚕️",
  "🧑‍🎓",
  "👨‍🎓",
  "👩‍🎓",
  "🧑‍🏫",
  "👨‍🏫",
  "👩‍🏫",
  "🧑‍⚖️",
  "👨‍⚖️",
  "👩‍⚖️",
  "🧑‍🌾",
  "👨‍🌾",
  "👩‍🌾",
  "🧑‍🍳",
  "👨‍🍳",
  "👩‍🍳",
  "🧑‍🔧",
  "👨‍🔧",
  "👩‍🔧",
  "🧑‍🏭",
  "👨‍🏭",
  "👩‍🏭",
  "🧑‍💼",
  "👨‍💼",
  "👩‍💼",
  "🧑‍🔬",
  "👨‍🔬",
  "👩‍🔬",
  "🧑‍💻",
  "👨‍💻",
  "👩‍💻",
  "🧑‍🎤",
  "👨‍🎤",
  "👩‍🎤",
  "🧑‍🎨",
  "👨‍🎨",
  "👩‍🎨",
  "🧑‍✈️",
  "👨‍✈️",
  "👩‍✈️",
  "🧑‍🚀",
  "👨‍🚀",
  "👩‍🚀",
  "🧑‍🚒",
  "👨‍🚒",
  "👩‍🚒",
  "👮",
  "👮‍♂️",
  "👮‍♀️",
  "🕵️",
  "🕵️‍♂️",
  "🕵️‍♀️",
  "💂",
  "💂‍♂️",
  "💂‍♀️",
  "👷",
  "👷‍♂️",
  "👷‍♀️",
  "🤴",
  "👸",
  "👳",
  "👳‍♂️",
  "👳‍♀️",
  "👲",
  "🧕",
  "🤵",
  "🤵‍♂️",
  "🤵‍♀️",
  "👰",
  "👰‍♂️",
  "👰‍♀️",
  "🤰",
  "🤱",
  "👩‍",
  "🍼",
  "👨‍",
  "🍼",
  "🧑‍",
  "🍼",
  "👼",
  "🎅",
  "🤶",
  "🧑‍",
  "🎄",
  "🦸",
  "🦸‍♂️",
  "🦸‍♀️",
  "🦹",
  "🦹‍♂️",
  "🦹‍♀️",
  "🧙",
  "🧙‍♂️",
  "🧙‍♀️",
  "🧚",
  "🧚‍♂️",
  "🧚‍♀️",
  "🧛",
  "🧛‍♂️",
  "🧛‍♀️",
  "🧜",
  "🧜‍♂️",
  "🧜‍♀️",
  "🧝",
  "🧝‍♂️",
  "🧝‍♀️",
  "🧞",
  "🧞‍♂️",
  "🧞‍♀️",
  "🧟",
  "🧟‍♂️",
  "🧟‍♀️",
  "💆",
  "💆‍♂️",
  "💆‍♀️",
  "💇",
  "💇‍♂️",
  "💇‍♀️",
  "🚶",
  "🚶‍♂️",
  "🚶‍♀️",
  "🧍",
  "🧍‍♂️",
  "🧍‍♀️",
  "🧎",
  "🧎‍♂️",
  "🧎‍♀️",
  "🧑‍",
  "🦯",
  "👨‍",
  "🦯",
  "👩‍",
  "🦯",
  "🧑‍",
  "🦼",
  "👨‍",
  "🦼",
  "👩‍",
  "🦼",
  "🧑‍",
  "🦽",
  "👨‍",
  "🦽",
  "👩‍",
  "🦽",
  "🏃",
  "🏃‍♂️",
  "🏃‍♀️",
  "💃",
  "🕺",
  "🕴️",
  "👯",
  "👯‍♂️",
  "👯‍♀️",
  "🧖",
  "🧖‍♂️",
  "🧖‍♀️",
  "🧗",
  "🧗‍♂️",
  "🧗‍♀️",
  "🤺",
  "🏇",
  "⛷️",
  "🏂️",
  "🏌️",
  "🏌️‍♂️",
  "🏌️‍♀️",
  "🏄️",
  "🏄‍♂️",
  "🏄‍♀️",
  "🚣",
  "🚣‍♂️",
  "🚣‍♀️",
  "🏊️",
  "🏊‍♂️",
  "🏊‍♀️",
  "⛹️",
  "⛹️‍♂️",
  "⛹️‍♀️",
  "🏋️",
  "🏋️‍♂️",
  "🏋️‍♀️",
  "🚴",
  "🚴‍♂️",
  "🚴‍♀️",
  "🚵",
  "🚵‍♂️",
  "🚵‍♀️",
  "🤸",
  "🤸‍♂️",
  "🤸‍♀️",
  "🤼",
  "🤼‍♂️",
  "🤼‍♀️",
  "🤽",
  "🤽‍♂️",
  "🤽‍♀️",
  "🤾",
  "🤾‍♂️",
  "🤾‍♀️",
  "🤹",
  "🤹‍♂️",
  "🤹‍♀️",
  "🧘",
  "🧘‍♂️",
  "🧘‍♀️",
  "🛀",
  "🛌",
  "🧑‍",
  "🤝‍",
  "🧑",
  "👭",
  "👫",
  "👬",
  "💏",
  "👩‍❤️‍💋‍👨",
  "👨‍❤️‍💋‍👨",
  "👩‍❤️‍💋‍👩",
  "💑",
  "👩‍❤️‍👨",
  "👨‍❤️‍👨",
  "👩‍❤️‍👩",
  "👪️",
  "👨‍👩‍👦",
  "👨‍👩‍👧",
  "👨‍👩‍👧‍👦",
  "👨‍👩‍👦‍👦",
  "👨‍👩‍👧‍👧",
  "👨‍👨‍👦",
  "👨‍👨‍👧",
  "👨‍👨‍👧‍👦",
  "👨‍👨‍👦‍👦",
  "👨‍👨‍👧‍👧",
  "👩‍👩‍👦",
  "👩‍👩‍👧",
  "👩‍👩‍👧‍👦",
  "👩‍👩‍👦‍👦",
  "👩‍👩‍👧‍👧",
  "👨‍👦",
  "👨‍👦‍👦",
  "👨‍👧",
  "👨‍👧‍👦",
  "👨‍👧‍👧",
  "👩‍👦",
  "👩‍👦‍👦",
  "👩‍👧",
  "👩‍👧‍👦",
  "👩‍👧‍👧",
  "🗣️",
  "👤",
  "👥",
  "👣",
];

module.exports = emoticons;
