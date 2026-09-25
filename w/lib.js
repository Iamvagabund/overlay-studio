// Shared helpers for the overlay widgets in this folder.
// Widgets read all their settings from the URL, e.g. goal.html?title=Sub%20goal&current=12&target=50
(() => {
  const params = new URLSearchParams(location.search);

  const OL = {
    params,
    /** String param, or `def` when missing/empty. */
    str: (key, def = "") => params.get(key) || def,
    /** Number param, or `def` when missing/not a number. */
    num: (key, def = 0) => { const v = parseFloat(params.get(key)); return Number.isFinite(v) ? v : def; },
    /** One of `allowed`, falling back to the first. */
    pick: (key, allowed) => (allowed.includes(params.get(key)) ? params.get(key) : allowed[0]),
    has: key => params.has(key),

    /** Dark backdrop used by the editor preview; OBS gets a transparent page. */
    initPreview() { if (params.has("preview")) document.body.classList.add("preview"); },

    /** Sets --accent from &accent= on the root element. */
    initAccent() { const a = params.get("accent"); if (a) document.documentElement.style.setProperty("--accent", a); },

    /** Scales a fixed-size stage (e.g. 1920x1080) to fit the window, centred. */
    fitStage(el, w = 1920, h = 1080) {
      const fit = () => { el.style.transform = `translate(-50%,-50%) scale(${Math.min(innerWidth / w, innerHeight / h)})`; };
      addEventListener("resize", fit); fit();
    },

    pad: n => String(n).padStart(2, "0"),

    /** Seconds -> "M:SS", "MM:SS" or "H:MM:SS". */
    clock(sec, { alwaysHours = false } = {}) {
      sec = Math.max(0, Math.floor(sec));
      const h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = sec % 60;
      return h || alwaysHours ? `${h}:${OL.pad(m)}:${OL.pad(s)}` : `${OL.pad(m)}:${OL.pad(s)}`;
    },

    /** "19:30" -> timestamp of the next 19:30 (today, or tomorrow if it already passed). */
    nextTime(hhmm) {
      const [h, m] = hhmm.split(":").map(Number);
      const d = new Date(); d.setHours(h, m || 0, 0, 0);
      if (d < Date.now()) d.setDate(d.getDate() + 1);
      return d.getTime();
    },

    /** "19:30" -> timestamp of the most recent 19:30 (today, or yesterday if it's still in the future). */
    lastTime(hhmm) {
      const [h, m] = hhmm.split(":").map(Number);
      const d = new Date(); d.setHours(h, m || 0, 0, 0);
      if (d > Date.now()) d.setDate(d.getDate() - 1);
      return d.getTime();
    },

    /**
     * Read-only anonymous connection to a Twitch channel's chat. No login or token needed.
     * onMessage({ name, color, text, emotes: [{ id, start, end }] }) is called for every chat line.
     */
    twitchChat(channel, onMessage) {
      const ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
      ws.onopen = () => {
        ws.send("CAP REQ :twitch.tv/tags");
        ws.send("PASS SCHMOOPIIE");
        ws.send("NICK justinfan" + Math.floor(Math.random() * 90000 + 10000));
        ws.send("JOIN #" + channel.toLowerCase());
      };
      ws.onmessage = ({ data }) => {
        for (const line of data.split("\r\n")) {
          if (line.startsWith("PING")) { ws.send("PONG :tmi.twitch.tv"); continue; }
          const m = line.match(/^@(\S+) :(\w+)!\S+ PRIVMSG #\S+ :(.*)$/);
          if (!m) continue;
          const [, rawTags, login, rawText] = m;
          const tags = Object.fromEntries(rawTags.split(";").map(kv => kv.split("=")));
          const emotes = [];
          for (const part of (tags.emotes || "").split("/").filter(Boolean)) {
            const [id, ranges] = part.split(":");
            for (const r of ranges.split(",")) { const [start, end] = r.split("-").map(Number); emotes.push({ id, start, end }); }
          }
          // "/me" messages arrive wrapped in \u0001ACTION ... \u0001
          const text = rawText.startsWith("\u0001ACTION ") ? rawText.slice(8, -1) : rawText;
          onMessage({ name: tags["display-name"] || login, color: tags.color, text, emotes });
        }
      };
      ws.onclose = () => setTimeout(() => OL.twitchChat(channel, onMessage), 3000);
    },

    emoteUrl: (id, size = "2.0") => `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/${size}`,
  };

  window.OL = OL;
})();
