# Що підключити, щоб сайт запрацював і приносив гроші

Робіть по порядку. Кроки 1–3 обов'язкові, щоб сайт взагалі був в інтернеті. Решта — щоб з'явились відвідувачі й гроші.

---

## 1. Посилання на Etsy (5 хвилин)
Відкрийте `assets/widgets.js`, перший рядок:
```js
window.ETSY_URL = "https://www.etsy.com/shop/YOUR-SHOP";
```
Замініть на посилання свого магазину Etsy. Звідси ведуть усі кнопки «Get it on Etsy / Купити на Etsy».

## 2. Викласти сайт в інтернет: Netlify (безкоштовно, 5 хвилин)
1. Зайдіть на **https://app.netlify.com/drop** і зареєструйтеся (email або GitHub).
2. Перетягніть **усю папку `overlay-studio`** у вікно.
3. Отримаєте адресу виду `https://random-name-123.netlify.app`.
4. **Site configuration → Change site name**: змініть на щось зрозуміле, наприклад `overlaystudio-yuri`.
5. Щоб оновити сайт: **Deploys** → знову перетягніть папку.

> ⚠️ Посилання, які люди вставляють в OBS, ведуть на ваш сайт (`/w/...`). Не видаляйте й не перейменовуйте файли в папці `w/`, бо в людей зламаються оверлеї.

## 3. Вписати адресу сайту у файли (2 хвилини)

> Зараз сайт викладено на GitHub Pages: **https://iamvagabund.github.io/overlay-studio/**, і адреса вже вписана. Цей крок знадобиться лише при переїзді на інший хостинг чи домен: замініть `iamvagabund.github.io/overlay-studio` на нову адресу тією ж командою.
У файлах `index.html`, `uk/index.html`, `sitemap.xml`, `robots.txt` стоїть заглушка `YOUR-DOMAIN`. Замініть її на свою адресу **без** `https://`, наприклад `overlaystudio-yuri.netlify.app`.
Можна однією командою в Терміналі (з папки `overlay-studio`):
```bash
grep -rl YOUR-DOMAIN . | xargs sed -i '' 's/YOUR-DOMAIN/overlaystudio-yuri.netlify.app/g'
```
Після цього знову викладіть папку на Netlify.

---

## 4. Google Search Console, щоб сайт з'явився в пошуку (безкоштовно, 10 хвилин)
1. **https://search.google.com/search-console** → Add property → **URL prefix** → адреса сайту.
2. Підтвердження: вибрати **HTML tag**, скопіювати рядок `<meta name="google-site-verification" ...>` і вставити в `<head>` файлу `index.html`. Викласти сайт, натиснути **Verify**.
3. **Sitemaps** → ввести `sitemap.xml` → Submit.
4. Перші покази в Google зазвичай з'являються через 1–4 тижні.

## 5. Статистика відвідувачів (безкоштовно)
Щоб бачити, скільки людей заходить і звідки. Раджу **Cloudflare Web Analytics** або **GoatCounter**: безкоштовні й без cookie, тож не потрібен банер згоди.
- GoatCounter: зареєструйтеся на **goatcounter.com**, отримайте рядок `<script ...>` і вставте перед `</body>` у всі 4 сторінки (`index.html`, `editor.html`, `uk/index.html`, `uk/editor.html`).
- Або надішліть мені код, і я вставлю.

## 6. Власний домен (за бажанням, ~$10 на рік)
Сайт працює і на `.netlify.app`, але власний домен (`overlaystudio.gg`, `streamoverlays.app` тощо):
- виглядає солідніше й краще ранжується;
- **зазвичай потрібен для Google AdSense** (піддомени `.netlify.app` там, як правило, не приймають).

Купити можна на Porkbun, Namecheap або Cloudflare Registrar. Потім у Netlify: **Domain management → Add a domain**, і вони покажуть, що прописати.

## 7. Реклама Google AdSense (коли буде трафік)
- Подавайте заявку, коли буде **власний домен** і хоча б кілька сотень відвідувачів на місяць. Порожні нові сайти часто не проходять.
- На **adsense.google.com** додайте сайт і вставте їхній код. Місця для реклами на сторінках вже позначені блоками `<div class="ad-slot">`.
- Виплати AdSense йдуть банківським переказом. Перевірте в налаштуваннях AdSense, що Україна підтримується для вашого типу акаунта.
- Для відвідувачів з ЄС і Великобританії Google вимагає банер згоди на cookie. В AdSense є вбудований (Privacy & messaging), його треба увімкнути.

---

## Звідки брати перших відвідувачів (без цього Google сам не приведе)
- **Reddit:** r/Twitch, r/obs, r/streaming, r/letsplay. Пост «I made a free browser tool for animated OBS overlays» з гіфкою редактора.
- **TikTok, Shorts, Reels:** 15-секундні відео «як зробити крутий оверлей за 30 секунд» з посиланням у профілі.
- **Discord-сервери стрімерів**, канали #resources і #self-promo.
- **Українською:** українські спільноти стрімерів у Telegram, Discord, TikTok. Конкуренції там майже немає.
