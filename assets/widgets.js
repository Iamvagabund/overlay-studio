// Every widget the editor can configure. Each field becomes a URL parameter of the widget page.
// Fields left at their default value are not added to the URL, so links stay short.
// Text can be translated with a `uk: { ... }` object next to it (see i18n.js).
window.ETSY_URL = ""; // TODO: your Etsy shop link. While empty, PRO buttons show "Coming soon".

// Styling options shared by all widgets (shown under "More styling" in the editor). Each widget lists the
// ones that make sense for it in `style: [...]`. Handled in w/lib.js → OL.applyStyle().
const FONTS = ["Inter", "Poppins", "Montserrat", "Space Grotesk", "Archivo", "Bebas Neue", "Oswald", "Nunito", "Quicksand",
               "Orbitron", "Press Start 2P", "JetBrains Mono", "Permanent Marker", "Pacifico"];
window.STYLE_FIELDS = {
  font:   { key: "font", label: "Font", uk: { label: "Шрифт", labels: ["Як у стилі", ...FONTS] }, type: "dropdown", options: ["", ...FONTS], labels: ["Style default", ...FONTS], def: "" },
  text:   { key: "text", label: "Text colour", type: "color", def: "#ffffff", hint: "White = keep the style's colours.", uk: { label: "Колір тексту", hint: "Білий = кольори стилю." } },
  panel:  { key: "panel", label: "Background colour", uk: { label: "Колір підкладки" }, type: "color", def: "#000000" },
  alpha:  { key: "alpha", label: "Background opacity (%)", uk: { label: "Непрозорість підкладки (%)" }, type: "range", min: 0, max: 100, def: "90" },
  corner: { key: "corner", label: "Corner roundness (px)", uk: { label: "Заокруглення кутів (px)" }, type: "range", min: 0, max: 40, def: "12" },
  scale:  { key: "scale", label: "Size (%)", uk: { label: "Розмір (%)" }, type: "range", min: 50, max: 200, step: 5, def: "100" },
  speed:  { key: "speed", label: "Animation speed", uk: { label: "Швидкість анімації" }, type: "select", options: ["0.5", "1", "1.5", "2"], labels: ["0.5×", "1×", "1.5×", "2×"], def: "1" },
};
for (const f of Object.values(STYLE_FIELDS)) f.group = "style";

window.WIDGETS = [
  {
    id: "starting-soon",
    style: ["font", "text", "speed"],
    name: "Starting Soon Screen",
    blurb: "Animated countdown screen in 4 styles. Minimal, neon, pixel and cozy.",
    uk: { name: "Заставка «Starting Soon»", blurb: "Анімована заставка з таймером перед стрімом. 4 стилі: мінімалізм, неон, піксель, затишний." },
    file: "starting-soon.html",
    size: [1920, 1080],
    img: "img/starting-soon.jpg",
    fields: [
      { key: "theme", label: "Style", uk: { label: "Стиль" }, type: "select", options: ["minimal", "neon", "pixel", "cozy"], def: "minimal" },
      { key: "title", label: "Title", uk: { label: "Заголовок", placeholder: "Стрім скоро почнеться" }, type: "text", def: "", placeholder: "Starting Soon" },
      { key: "sub", label: "Subtitle", uk: { label: "Підзаголовок", placeholder: "Беріть чай, скоро почнемо" }, type: "text", def: "", placeholder: "Grab a drink, we'll be live shortly" },
      { key: "minutes", label: "Countdown (minutes)", uk: { label: "Таймер (хвилин)" }, type: "number", def: "5", min: 1, max: 180 },
      { key: "until", label: "…or count down to a time", uk: { label: "…або відлік до певного часу", hint: "Замінює хвилини. Завжди правильний, навіть після перезапуску OBS." }, type: "time", def: "", hint: "Overrides minutes. Always correct, even after OBS restarts." },
      { key: "done", label: "Text when the timer ends", uk: { label: "Текст, коли таймер закінчився", placeholder: "Починаємо!" }, type: "text", def: "", placeholder: "Starting now!" },
      { key: "accent", label: "Accent color", uk: { label: "Акцентний колір" }, type: "color", def: "#3b82f6" },
    ],
  },
  {
    id: "webcam-frame",
    style: ["font", "text", "panel", "alpha", "speed"],
    name: "Animated Webcam Frame",
    blurb: "Moving borders for your facecam: neon beam, rainbow, glitch, pixel, glass, minimal.",
    uk: { name: "Анімована рамка для вебки", blurb: "Рухомі рамки для камери: неоновий промінь, райдуга, глітч, піксель, скло, мінімал." },
    file: "webcam-frame.html",
    size: [640, 360],
    img: "img/webcam-frames.jpg",
    fields: [
      { key: "style", label: "Style", uk: { label: "Стиль" }, type: "select", options: ["neon", "rainbow", "minimal", "glitch", "pixel", "glass"], def: "neon" },
      { key: "name", label: "Name tag", uk: { label: "Бірка з ім'ям", placeholder: "Залиште порожнім, щоб без бірки" }, type: "text", def: "", placeholder: "Leave empty for no tag" },
      { key: "accent", label: "Accent color", uk: { label: "Акцентний колір" }, type: "color", def: "#a855f7" },
      { key: "thick", label: "Border thickness (px)", uk: { label: "Товщина рамки (px)" }, type: "number", def: "8", min: 1, max: 40 },
      { key: "radius", label: "Corner radius (px)", uk: { label: "Заокруглення кутів (px)" }, type: "number", def: "24", min: 0, max: 80 },
    ],
  },
  {
    id: "socials",
    style: ["font", "text", "panel", "alpha", "corner", "scale", "speed"],
    name: "Socials Rotator",
    blurb: "Your socials cycling in one sleek lower-third, with real logos.",
    uk: { name: "Ротатор соцмереж", blurb: "Ваші соцмережі по черзі в одній стильній панелі, зі справжніми логотипами." },
    file: "socials.html",
    size: [1920, 1080],
    img: "img/socials.jpg",
    fields: [
      { key: "style", label: "Style", uk: { label: "Стиль" }, type: "select", options: ["slide", "pill", "neon"], def: "slide" },
      { key: "pos", label: "Position", uk: { label: "Позиція", labels: ["Внизу ліворуч", "Внизу праворуч", "Вгорі ліворуч", "Вгорі праворуч", "Внизу по центру"] }, type: "select", options: ["bl", "br", "tl", "tr", "bc"], labels: ["Bottom left", "Bottom right", "Top left", "Top right", "Bottom center"], def: "bl" },
      { key: "interval", label: "Seconds per item", uk: { label: "Секунд на кожну" }, type: "number", def: "6", min: 2, max: 60 },
      { key: "twitch", label: "Twitch", type: "text", def: "", placeholder: "yourname" },
      { key: "youtube", label: "YouTube", type: "text", def: "", placeholder: "yourname" },
      { key: "tiktok", label: "TikTok", type: "text", def: "", placeholder: "yourname" },
      { key: "instagram", label: "Instagram", type: "text", def: "", placeholder: "yourname" },
      { key: "x", label: "X / Twitter", type: "text", def: "", placeholder: "yourname" },
      { key: "kick", label: "Kick", type: "text", def: "", placeholder: "yourname" },
      { key: "discord", label: "Discord invite", uk: { label: "Discord-запрошення" }, type: "text", def: "", placeholder: "abc123" },
    ],
  },
  {
    id: "chat",
    style: ["font", "text", "panel", "alpha", "corner", "speed"],
    name: "Twitch Chat Overlay",
    blurb: "Your live chat on stream with emotes. Bubble, neon, terminal and cozy styles. No login.",
    uk: { name: "Чат Twitch на стрімі", blurb: "Живий чат на екрані з емоутами. Стилі: бульбашки, неон, термінал, затишний. Без логіну." },
    file: "chat.html",
    size: [500, 800],
    demoParams: { demo: 1 }, // sample messages in the preview until a channel is typed; never in OBS links
    img: "img/chat.jpg",
    fields: [
      { key: "channel", label: "Your Twitch channel", uk: { label: "Ваш канал Twitch", hint: "Назва з адреси twitch.tv/…" }, type: "text", def: "", placeholder: "yourname", hint: "The name from your twitch.tv/… address.", required: true },
      { key: "style", label: "Style", uk: { label: "Стиль" }, type: "select", options: ["bubble", "neon", "terminal", "cozy"], def: "bubble" },
      { key: "size", label: "Font size (px)", uk: { label: "Розмір шрифту (px)" }, type: "number", def: "24", min: 12, max: 60 },
      { key: "max", label: "Max messages", uk: { label: "Максимум повідомлень" }, type: "number", def: "8", min: 1, max: 30 },
      { key: "fade", label: "Hide after (seconds, 0 = never)", uk: { label: "Ховати через (секунд, 0 = ніколи)" }, type: "number", def: "30", min: 0, max: 600 },
      { key: "hide", label: "Hide these users", uk: { label: "Не показувати цих користувачів" }, type: "text", def: "", placeholder: "nightbot,streamelements" },
    ],
  },
  {
    id: "goal",
    style: ["font", "text", "panel", "alpha", "corner", "scale", "speed"],
    name: "Goal Bar",
    blurb: "Animated progress bar for sub, follower or donation goals. Confetti when you hit it.",
    uk: { name: "Прогрес-бар цілі", blurb: "Анімована шкала цілі для підписок, фоловерів чи донатів. Конфеті, коли ціль досягнуто." },
    file: "goal.html",
    size: [800, 160],
    img: "img/goal.jpg",
    fields: [
      { key: "style", label: "Style", uk: { label: "Стиль" }, type: "select", options: ["sleek", "neon", "pixel"], def: "sleek" },
      { key: "title", label: "Goal title", uk: { label: "Назва цілі", placeholder: "Ціль: 50 підписок" }, type: "text", def: "", placeholder: "Sub goal" },
      { key: "current", label: "Current", uk: { label: "Зараз", hint: "Оновіть число і перевставте посилання в OBS (або відредагуйте URL прямо в OBS)." }, type: "number", def: "0", min: 0, hint: "Update the number and paste the new link into OBS (or edit the URL right in OBS)." },
      { key: "target", label: "Target", uk: { label: "Ціль" }, type: "number", def: "100", min: 1 },
      { key: "prefix", label: "Before number", uk: { label: "Перед числом", placeholder: "₴" }, type: "text", def: "", placeholder: "$" },
      { key: "suffix", label: "After number", uk: { label: "Після числа", placeholder: "підписок" }, type: "text", def: "", placeholder: "subs" },
      { key: "accent", label: "Accent color", uk: { label: "Акцентний колір" }, type: "color", def: "#8b5cf6" },
    ],
  },
  {
    id: "timer",
    style: ["font", "text", "panel", "alpha", "corner", "scale", "speed"],
    name: "Stream Timer & Clock",
    blurb: "Show how long you've been live, count down to the end of stream, or show the time.",
    uk: { name: "Таймер стріму і годинник", blurb: "Скільки триває стрім, відлік до кінця або просто годинник." },
    file: "timer.html",
    size: [600, 140],
    img: "img/timer.jpg",
    fields: [
      { key: "mode", label: "Mode", uk: { label: "Режим", labels: ["Час стріму", "Відлік", "Годинник"] }, type: "select", options: ["uptime", "countdown", "clock"], labels: ["Uptime", "Countdown", "Clock"], def: "uptime" },
      { key: "style", label: "Style", uk: { label: "Стиль" }, type: "select", options: ["pill", "neon", "pixel"], def: "pill" },
      { key: "label", label: "Label", uk: { label: "Підпис", placeholder: "В ефірі" }, type: "text", def: "", placeholder: "Live for" },
      { key: "since", label: "Uptime: stream started at", uk: { label: "Час стріму: початок о", hint: "Порожньо = рахує від моменту, коли OBS завантажив джерело." }, type: "time", def: "", hint: "Empty = counts from when OBS loads the source." },
      { key: "minutes", label: "Countdown: minutes", uk: { label: "Відлік: хвилин" }, type: "number", def: "60", min: 1 },
      { key: "until", label: "Countdown: …or until", uk: { label: "Відлік: …або до" }, type: "time", def: "" },
      { key: "accent", label: "Accent color", uk: { label: "Акцентний колір" }, type: "color", def: "#ef4444" },
    ],
  },
  {
    id: "counter",
    style: ["font", "text", "panel", "alpha", "corner", "scale", "speed"],
    name: "Death / Win Counter",
    blurb: "Count deaths, wins, kills or anything. Click + / − in OBS. Remembers the number.",
    uk: { name: "Лічильник смертей / перемог", blurb: "Рахуйте смерті, перемоги, кіли. Натискайте + / − прямо в OBS. Число запам'ятовується.",
          note: "В OBS: правий клік на джерелі → Interact → натискайте + / −, або клавіші + / − / 0." },
    file: "counter.html",
    size: [500, 160],
    img: "img/counter.jpg",
    fields: [
      { key: "style", label: "Style", uk: { label: "Стиль" }, type: "select", options: ["card", "comic", "pixel"], def: "card" },
      { key: "label", label: "Label", uk: { label: "Підпис", placeholder: "Смерті" }, type: "text", def: "", placeholder: "Deaths" },
      { key: "icon", label: "Emoji", uk: { label: "Емодзі", hint: "Напишіть none, щоб без емодзі." }, type: "text", def: "", placeholder: "💀", hint: "Type none for no emoji." },
      { key: "start", label: "Start from", uk: { label: "Почати з" }, type: "number", def: "0" },
      { key: "accent", label: "Accent color", uk: { label: "Акцентний колір" }, type: "color", def: "#ef4444" },
    ],
    note: "In OBS: right-click the source → Interact → click + / −, or press + / − / 0.",
  },
];

window.PRO = [
  { name: "Scene Kit PRO", blurb: "Full Just Chatting and Gameplay layouts with windows for your camera, game and chat. Dark Mode, Synth Runner and Glass series.",
    uk: { blurb: "Готові сцени Just Chatting і Gameplay з вікнами для камери, гри й чату. Серії Dark Mode, Synth Runner і Glass." },
    img: "img/pro-scene-kit.jpg", price: "$15" },
  { name: "Live Alerts PRO", blurb: "Big editorial-style alerts for subs, gift subs, raids and bits, with sound. Same 3 design series. No login.",
    uk: { name: "Живі алерти PRO", blurb: "Великі стильні сповіщення про підписки, подарунки, рейди й біти, зі звуком. Ті самі 3 серії. Без логіну." },
    img: "img/pro-alerts.jpg", price: "$12" },
  { name: "Stream Screens PRO", blurb: "Starting Soon, BRB and Ending in 3 pro design series: Dark Mode, Synth Runner and Glass. Huge type, live countdown, your name and socials.",
    uk: { blurb: "Starting Soon, BRB і Ending у 3 професійних серіях: Dark Mode, Synth Runner і Glass. Великі заголовки, таймер, ваше ім'я й соцмережі." },
    img: "img/pro-stream-screens.jpg", price: "$19" },
  { name: "Emote Rain", blurb: "Your chat's emotes fall onto the stream with real physics, bounce and pile up.",
    uk: { name: "Дощ емоутів", blurb: "Емоути з чату падають на стрім зі справжньою фізикою, відскакують і складаються в купу." },
    img: "img/pro-emote-rain.jpg", price: "$10" },
];

// Ready-made themes: every free widget pre-styled to match. `items` holds each widget's settings
// (same keys as its fields). On the themes page the user's channel and name are added on top (see PERSONAL).
window.THEMES = [
  {
    id: "neon", name: "Neon Night", uk: { name: "Неонова ніч", blurb: "Рожевий неон і світіння. Яскраво, як кіберпанк-вивіска." },
    blurb: "Hot pink neon and glow. Loud, bright, cyberpunk sign energy.", colors: ["#ff2bd6", "#00f0ff", "#1a0b2e"],
    items: {
      "starting-soon": { theme: "neon", accent: "#ff2bd6" }, "webcam-frame": { style: "neon", accent: "#ff2bd6" },
      chat: { style: "neon" }, socials: { style: "neon" }, goal: { style: "neon", accent: "#ff2bd6" },
      timer: { style: "neon", accent: "#ff2bd6" }, counter: { style: "card", accent: "#ff2bd6" },
    },
  },
  {
    id: "retro", name: "Retro Arcade", uk: { name: "Ретро-аркада", blurb: "Піксельні шрифти й 8-бітні рамки. Для ретро- й інді-ігор." },
    blurb: "Pixel fonts and 8-bit borders. Made for retro and indie games.", colors: ["#ffd23f", "#e8505b", "#1b1f3b"],
    items: {
      "starting-soon": { theme: "pixel", accent: "#ffd23f" }, "webcam-frame": { style: "pixel", accent: "#8b5cf6" },
      chat: { style: "terminal" }, socials: { style: "slide" }, goal: { style: "pixel", accent: "#8b5cf6" },
      timer: { style: "pixel", accent: "#e8505b" }, counter: { style: "pixel", accent: "#e8505b" },
    },
  },
  {
    id: "cozy", name: "Cozy Pastel", uk: { name: "Затишна пастель", blurb: "М'які пастельні кольори й скло. Для спокійних стрімів і розмов." },
    blurb: "Soft pastels and frosted glass. For chill streams and chatting.", colors: ["#f9d9e3", "#cfe7f5", "#b56a9a"],
    items: {
      "starting-soon": { theme: "cozy", accent: "#b56a9a" }, "webcam-frame": { style: "glass" },
      chat: { style: "cozy" }, socials: { style: "pill" }, goal: { style: "sleek", accent: "#f472b6" },
      timer: { style: "pill", accent: "#f472b6" }, counter: { style: "card", accent: "#f472b6", icon: "☕", label: "Cups of tea" },
    },
  },
  {
    id: "cyber", name: "Cyber Glitch", uk: { name: "Кібер-глітч", blurb: "Зламаний сигнал, розшарування кольорів, термінал. Для шутерів і хакерської естетики." },
    blurb: "Broken signal, RGB split, hacker terminal. For shooters and cyber vibes.", colors: ["#00e5ff", "#ff004c", "#05010a"],
    items: {
      "starting-soon": { theme: "neon", accent: "#00e5ff" }, "webcam-frame": { style: "glitch" },
      chat: { style: "terminal" }, socials: { style: "neon" }, goal: { style: "neon", accent: "#00e5ff" },
      timer: { style: "neon", accent: "#ff004c" }, counter: { style: "card", accent: "#00e5ff" },
    },
  },
  {
    id: "clean", name: "Clean Minimal", uk: { name: "Чистий мінімал", blurb: "Стримано й охайно. Пасує до будь-якої гри." },
    blurb: "Understated and tidy. Works with any game.", colors: ["#3b82f6", "#e5e7eb", "#0e0f12"],
    items: {
      "starting-soon": { theme: "minimal", accent: "#3b82f6" }, "webcam-frame": { style: "minimal" },
      chat: { style: "bubble" }, socials: { style: "slide" }, goal: { style: "sleek", accent: "#3b82f6" },
      timer: { style: "pill", accent: "#3b82f6" }, counter: { style: "card", accent: "#3b82f6" },
    },
  },
];

// On the themes page the user types these once; they're copied into every widget that has the field.
window.PERSONAL = [
  { id: "channel", label: "Your Twitch channel", uk: { label: "Ваш канал Twitch" }, placeholder: "yourname", to: { chat: "channel", socials: "twitch" } },
  { id: "name", label: "Your name on camera", uk: { label: "Ім'я на рамці камери" }, placeholder: "YourName", to: { "webcam-frame": "name" } },
];
